import {getConfig} from './configLoader';

const env = process.env.NODE_ENV || 'local';

export let config = getConfig(env);