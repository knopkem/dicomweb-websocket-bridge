import config from 'config';
import SimpleLogger from 'simple-node-logger';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import SocketIOStream from '@wearemothership/socket.io-stream';

// make sure default directories exist
const logDir = config.get('logDir') as string;
fs.mkdir(logDir, { recursive: true });

// create a rolling file logger based on date/time that fires process events
const opts = {
  errorEventName: 'error',
  logDirectory: logDir, // NOTE: folder must exist and be writable...
  fileNamePattern: 'roll-<DATE>.log',
  dateFormat: 'YYYY.MM.DD',
};
const manager = SimpleLogger.createLogManager();
manager.createRollingFileAppender(opts);
const logger = manager.createLogger();

export const getLogger = () => logger;

export const emitToQidoWsClient = (level, query, token): Promise<any> =>
  new Promise((resolve, reject) => {
    const client = global.connectedClients[token];
    if (!client || client.handshake.auth.token !== token) {
      const msg = 'no ws client connected, cannot emit';
      logger.error(msg);
      reject(msg);
    } else {
      const uuid = uuidv4();
      client.once(uuid, (data) => {
        if (data instanceof Error) {
          reject('error');
        }
        resolve(data);
      });

      client.emit('qido-request', { level, query, uuid });
    }
  });

export const emitToWadoWsClient = (reply, query, token): Promise<void> =>
  new Promise((resolve) => {
    const client = global.connectedClients[token];
    if (!client || client.handshake.auth.token !== token) {
      const msg = 'no ws client connected, cannot emit';
      logger.error(msg);
      reply.send(msg);
      resolve();
    } else {
      const uuid = uuidv4();
      SocketIOStream(client, {}).on(uuid, (stream, headers) => {
        const { contentType } = headers;
        reply.status(200);
        reply.header('content-type', contentType);
        const bufferData: Buffer[] = [];
        stream.on('data', (data) => {
          bufferData.push(data);
        });
        stream.on('end', () => {
          const b = Buffer.concat(bufferData);
          reply.send(b);
          resolve();
        });
      });
      client.on(uuid, (resp) => {
        if (resp instanceof Error) {
          reply.send(500);
        }
      });
      client.emit('wado-request', { query, uuid });
    }
  });

export const emitToStowRsClient = (reply, body, token, type): Promise<void> =>
  new Promise((resolve) => {
    const client = global.connectedClients[token];
    if (!client || client.handshake.auth.token !== token) {
      const msg = 'no ws client connected, cannot emit';
      logger.error(msg);
      reply.send(msg);
      resolve();
    } else {
      const uuid = uuidv4();
      const stream = SocketIOStream.createStream({});
      SocketIOStream(client, {}).emit('stow-request', stream, { contentType: type, uuid });
      client.once(uuid, (data) => {
        if (data instanceof Error) {
          reply.send(500);
        }
        reply.send(data);
        resolve();
      });
      logger.info(body.length, token, type);
      let offset = 0;
      const chunkSize = 512 * 1024; // 512kb
      const writeBuffer = () => {
        let ok = true;
        do {
          const b = Buffer.alloc(chunkSize);
          body.copy(b, 0, offset, offset + chunkSize);
          ok = stream.write(b);
          offset += chunkSize;
        } while (offset < body.length && ok);
        if (offset < body.length) {
          stream.once('drain', writeBuffer);
        } else {
          stream.end();
        }
      };
      writeBuffer();

      client.emit('stow-request', { type, body, uuid });
    }
  });
