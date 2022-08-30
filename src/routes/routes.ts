import { FastifyInstance } from 'fastify';
import { getLogger, emitToQidoWsClient, emitToWadoWsClient, emitToStowRsClient } from '../utils';
import { v4 as uuidv4 } from 'uuid';

const logger = getLogger();

interface QueryParams {
  [key: string]: string;
}

module.exports = function (server: FastifyInstance, opts: unknown, done: () => void) {
  server.get<{}>('/rs/studies', async (req, reply) => {
    try {
      const resp = await emitToQidoWsClient('STUDY', req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/metadata', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    try {
      const resp = await emitToQidoWsClient('SERIES', query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    try {
      const resp = await emitToQidoWsClient('SERIES', query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/metadata', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    try {
      const resp = await emitToQidoWsClient('IMAGE', query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    try {
      const resp = await emitToQidoWsClient('IMAGE', query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string; sopInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/metadata', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.SOPInstanceUID = req.params.sopInstanceUid;
    try {
      const resp = await emitToQidoWsClient('IMAGE', query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/rendered', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.dataFormat = 'rendered';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/pixeldata', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.dataFormat = 'pixeldata';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/thumbnail', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.dataFormat = 'thumbnail';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/rendered', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.dataFormat = 'rendered';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/pixeldata', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.dataFormat = 'pixeldata';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/thumbnail', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.dataFormat = 'thumbnail';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string; sopInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.SOPInstanceUID = req.params.sopInstanceUid;
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string; sopInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/rendered', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.SOPInstanceUID = req.params.sopInstanceUid;
    query.dataFormat = 'rendered';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string; sopInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/pixeldata', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.SOPInstanceUID = req.params.sopInstanceUid;
    query.dataFormat = 'pixeldata';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.get<{
    Querystring: QueryParams;
    Params: { studyInstanceUid: string; seriesInstanceUid: string; sopInstanceUid: string };
  }>('/rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/thumbnail', async (req, reply) => {
    const { query } = req;
    query.StudyInstanceUID = req.params.studyInstanceUid;
    query.SeriesInstanceUID = req.params.seriesInstanceUid;
    query.SOPInstanceUID = req.params.sopInstanceUid;
    query.dataFormat = 'thumbnail';
    try {
      const resp = await emitToWadoWsClient(req.query, req.websocketToken);
      reply.send(resp);
    } catch (error) {
      logger.error(error);
      reply.send(500);
    }
  });

  //------------------------------------------------------------------

  server.put('/rs/studies', async (req, reply) => {
    const { headers, multipart, websocketToken } = req;
    const type = headers['content-type'];
    return await emitToStowRsClient(reply, multipart, websocketToken, type);
  });

  //------------------------------------------------------------------

  server.get(
    '/viewer/wadouri',
    (req, reply): Promise<void> =>
      new Promise((resolve) => {
        const uuid = uuidv4();

        const client = global.connectedClients[req.websocketToken];
        if (!client || client.handshake.auth !== req.websocketToken) {
          client.once(uuid, (data) => {
            reply.header('Content-Type', data.contentType);
            reply.send(data.buffer);
            resolve();
          });

          const { query } = req;
          client.emit('wadouri-request', { query, uuid });
        } else {
          const msg = 'no ws client connected, cannot emit';
          logger.error(msg);
          reply.send(msg);
        }
      })
  );

  done();
};

//------------------------------------------------------------------
