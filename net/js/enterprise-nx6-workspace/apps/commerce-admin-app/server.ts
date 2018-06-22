// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';
import * as domino from 'domino';
import fetch from 'node-fetch';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();


// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'apps/commerce-admin-app/dist');

const template = fs.readFileSync(join(DIST_FOLDER, 'apps/index.html')).toString();

const win = domino.createWindow(template);
win.fetch = fetch;
global['window'] = win;
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  },
});
Object.defineProperty(win.document.body.style, 'box-shadow', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  },
});
global['document'] = win.document;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';




app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');

app.set('views', join(DIST_FOLDER, 'apps'));

interface IConfiguration {
  identityUrl: string,
  catalogUrl: string,
  basketUrl: string,
  orderUrl: string,
  orderSignalR: string
}
app.get('/api/configuration', (req, res) => {
  res.status(200).send(<IConfiguration>{
    identityUrl: process.env.identityUrl || 'http://localhost:5105',
    catalogUrl: process.env.catalogUrl || 'http://localhost:5101',
    basketUrl: process.env.basketUrl || 'http://localhost:5103',
    orderUrl: process.env.basketUrl || 'http://localhost:5102',
    orderSignalR: process.env.orderSignalR || 'http://localhost:5112'
  });
});

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'apps')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});