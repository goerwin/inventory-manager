import { app } from 'electron';
import path from 'path';
import url from 'url';

const DB_NAME = 'database.sqlite3';

export const IS_PROD = process.env.NODE_ENV === 'production';

export const DATABASE_PATH = IS_PROD
  ? path.resolve(process.env.PORTABLE_EXECUTABLE_DIR, DB_NAME) // portable.exe
  : // ? path.resolve(process.execPath, '../', DB_NAME) // unpacked version
    path.resolve(__dirname, '../../', DB_NAME);

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
