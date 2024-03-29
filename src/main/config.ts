import os from 'os';
import { app } from 'electron';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

export const DB_NAME = 'database.sqlite3';

export const IS_PROD = process.env.NODE_ENV === 'production';

const isMac = os.platform() === 'darwin';

const macPath = isMac ? path.resolve(app.getPath('exe'), '../../../../') : '';
const rootFolder = path.resolve(__dirname, '../../');

export const EXE_PATH = IS_PROD
  ? isMac
    ? macPath
    : path.resolve(process.env.PORTABLE_EXECUTABLE_DIR! || rootFolder) // portable.exe dir
  : // ? path.resolve(process.execPath) // unpacked version
    rootFolder; // in development, is the root folder

export const DATABASE_PATH = path.resolve(EXE_PATH, DB_NAME);

export const INDEX_HTML_PATH = IS_PROD
  ? url.format({
      pathname: path.join(app.getAppPath(), 'dist', 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  : url.format({
      protocol: 'http',
      host: `localhost:${process.env.PORT}`,
      pathname: 'index.html',
    });

export const ENV_TXT_PATH = path.resolve(EXE_PATH, './env.txt');
dotenv.config({ path: ENV_TXT_PATH });
