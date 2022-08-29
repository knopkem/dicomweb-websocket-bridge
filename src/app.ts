import config from 'config';
import { Server } from 'socket.io';
import path from 'path';
import fastify from 'fastify';
import jsonwebtoken from 'jsonwebtoken';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifyHelmet from '@fastify/helmet';
import fastifyCompress from '@fastify/compress';
import fastifyAutoload from '@fastify/autoload';
import { getLogger } from './utils';

declare module 'fastify' {
  // eslint-disable-next-line no-unused-vars
  interface FastifyRequest {
    websocketToken: string;
    multipart: Buffer;
  }
}

const httpPort = config.get('webserverPort') as number;
const wsPort = config.get('websocketPort') as number;
const defaultToken = config.get('websocketToken') as string;
const io = new Server(wsPort);

const server = fastify({ logger: false, bodyLimit: 20971520 });

server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
});

server.register(fastifyCors, {});
server.register(fastifySensible);
server.register(fastifyHelmet, { contentSecurityPolicy: false });
server.register(fastifyCompress, { global: true });

server.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
});

server.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
  options: { prefix: '/viewer' },
});

server.decorateRequest('multipart', '');
server.addContentTypeParser('multipart/related', { parseAs: 'buffer' }, async (request, payload) => {
  request.multipart = payload;
});

const logger = getLogger();

global.connectedClients = {};

// log exceptions
process.on('uncaughtException', async (err) => {
  await logger.error('uncaught exception received:');
  await logger.error(err.stack);
});

//------------------------------------------------------------------

process.on('SIGINT', async () => {
  await logger.info('shutting down web server...');
  io.close();
  server.close().then(
    async () => {
      await logger.info('webserver shutdown successfully');
    },
    (err) => {
      logger.error('webserver shutdown failed', err);
    }
  );
  process.exit(1);
});

//------------------------------------------------------------------

// incoming websocket connections are registered here
io.on('connection', (socket) => {
  const origin = socket.conn.remoteAddress;
  logger.info(`websocket client connected from origin: ${origin}`);
  const { token } = socket.handshake.auth;
  logger.info('Added socket to clients', token);
  global.connectedClients[token] = socket;

  socket.on('disconnect', (reason) => {
    logger.info(`websocket client disconnected, origin: ${origin}, reason: ${reason}`);
    delete global.connectedClients[token];
  });
});

server.decorateRequest('websocketToken', '');

server.addHook('onRequest', async (request) => {
  const { headers } = request;
  const token = headers.authorization?.replace(/bearer /gi, '');
  if (token) {
    try {
      const secret = config.get('jwtPacsSecret') as string;
      const issuer = config.get('jwtPacsIssuer') as string;
      const { websocketToken } = jsonwebtoken.verify(token, secret, { issuer });
      logger.info(websocketToken, ' ', request.url, ' ', request.method);
      request.websocketToken = websocketToken || defaultToken;
    } catch (e) {
      request.websocketToken = defaultToken;
    }
  } else {
    request.websocketToken = defaultToken;
  }
});

//------------------------------------------------------------------

logger.info('starting...');

server.listen({ port: httpPort, host: '0.0.0.0' }, async (err, address) => {
  if (err) {
    await logger.error(err, address);
    process.exit(1);
  }
  logger.info(`web-server listening on port: ${httpPort}`);
  logger.info(`websocket-server listening on port: ${wsPort}`);
});

//------------------------------------------------------------------
