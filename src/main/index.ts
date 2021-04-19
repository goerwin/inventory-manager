process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || String(3000);
console.log('ENVIRONMENT:', process.env.NODE_ENV);

import { app, BrowserWindow, ipcMain } from 'electron';
import 'reflect-metadata';
import { INDEX_HTML_PATH, IS_PROD } from './config';
import { sendDatabaseToRecipient } from './mailer';
import './db';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 750,
    minHeight: 450,
    height: 600,
    width: 1200,
    title: 'Inventario',
    backgroundColor: 'black',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL(INDEX_HTML_PATH);

  if (!IS_PROD) mainWindow.webContents.openDevTools();
}

// TODO: REFACTOR THIS
ipcMain.handle('email-send-database', async (_) =>
  sendDatabaseToRecipient().catch((e) => {
    throw new Error(
      `Probablemente debes crear el archivo env.txt. ${e.message}`
    );
  })
);

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
