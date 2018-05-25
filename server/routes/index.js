import express from 'express';
import path from 'path';
import ApiV1 from './api/v1';
import * as SocketsV1 from './sockets/v1';

let io;

export function init(app) {
    app.use('/', express.static(path.join(__dirname, '../../client')));
    app.get('/', (req, res)=> path.join(__dirname, '../../client/index.html'));

    app.use('/api/v1', ApiV1);
}

export function initSockets(io) {
    SocketsV1.init(io);
}