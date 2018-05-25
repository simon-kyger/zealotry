import fs from 'fs';
import { config } from './configs';
import * as Server from './server';

fs.readFile('banner.txt', 'utf8', (err,data) => console.log(data));

Server.create(config);
Server.start();