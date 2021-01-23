import 'reflect-metadata';
import { app, BrowserWindow } from 'electron';
import sqlite3 from 'sqlite3';
import url from 'url';
import path from 'path';

import { createConnection } from 'typeorm';
import { Item } from '../entities/Item';
// createConnection({
//   type: 'sqlite',
//   database: 'inventory',
//   entities: [Item],
//   synchronize: true,
// })
//   .then((connection) => {
//     // here you can start to work with your entities
//     console.log(connection);
//   })
//   .catch((error) => console.log(error));

const isProd = process.env.NODE_ENV === 'production';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });

  // and load the index.html of the app.
  let indexHtmlUrl = url.format({
    protocol: 'http',
    host: 'localhost:3000',
    pathname: 'index.html',
  });

  if (isProd) {
    indexHtmlUrl = url.format({
      pathname: path.join(__dirname, '../../dist/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  }

  console.log(indexHtmlUrl);
  mainWindow.loadURL(indexHtmlUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
