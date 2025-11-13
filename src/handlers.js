import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { join, parse, extname } from 'node:path';
import { readdir, stat, copyFile, rename } from 'node:fs/promises';

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

export function initHandlers() {
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
}
