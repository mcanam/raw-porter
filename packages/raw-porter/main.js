import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron/main';
import started from 'electron-squirrel-startup';
import { join, parse, extname, dirname } from 'node:path';
import { readdir, stat, copyFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) app.quit();

// constants
const DIR_NAME = dirname(fileURLToPath(import.meta.url));
const DEV_SERVER_URL = 'http://localhost:5173';

// states
let isProcessFiles = false;

async function processFiles(source, dest, fileName, fileType, mode, resultRef) {
    try {
        const contents = await readdir(source);

        for (const content of contents) {
            if (!isProcessFiles) return;

            const contentPath = join(source, content);
            const stats = await stat(contentPath);

            if (stats.isDirectory()) {
                await processFiles(contentPath, dest, fileName, fileType, mode, resultRef);
            }

            if (stats.isFile()) {
                const name = parse(content).name;
                const type = extname(content).replace('.', '').toUpperCase();

                if (name === fileName && type === fileType) {
                    const destPath = join(dest, content);
                    mode === 'copy' ? await copyFile(contentPath, destPath) : await rename(contentPath, destPath);

                    resultRef.status = mode === 'copy' ? 'copied' : 'moved';
                    return; // stop execution
                }
            }
        }
    } catch (error) {
        resultRef.status = 'error';
        resultRef.message = error.message;
    }
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 700,
        icon: './images/icon.png',
        webPreferences: {
            preload: join(DIR_NAME, 'preload.js'),
        },
    });

    if (process.env.NODE_ENV === 'development') {
        win.loadURL(DEV_SERVER_URL);
    } else {
        Menu.setApplicationMenu(null);
        win.loadFile(join(DIR_NAME, 'dist/index.html'));
    }
};

app.whenReady().then(() => {
    ipcMain.handle('show-dialog', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        return canceled ? null : filePaths[0];
    });

    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });

    ipcMain.handle('process-files', async (event, payload) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        const { source, destination, fileList, type, mode } = payload;

        isProcessFiles = true;

        try {
            for (const [index, fileName] of fileList.entries()) {
                if (!isProcessFiles) return;

                const resultRef = {
                    index,
                    fileName,
                    status: 'not found',
                    message: '',
                };

                await processFiles(source, destination, fileName, type, mode, resultRef);
                win.webContents.send('log', resultRef);
            }
        } catch (error) {
            win.webContents.send('log', {
                status: 'fatal-error',
                message: error.message,
            });
        }
    });

    ipcMain.handle('cancel-process-files', () => {
        isProcessFiles = false;
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
