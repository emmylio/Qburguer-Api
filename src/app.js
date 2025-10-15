// src/app.js

import express from 'express';
import { resolve } from 'node:path'; // 1. Importe o resolve
import { fileURLToPath } from 'url';
import routes from './routes.js';
import './database/index.js';

// 2. Recrie o __dirname (se ainda não tiver)
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use('/product-file', express.static(resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;