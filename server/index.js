import fs from 'fs';
import { config } from './configs';
import * as Server from './main';

fs.readFile('./server/banner.txt', 'utf8', (err,data) => console.log(data));

Server.create(config);
Server.start();