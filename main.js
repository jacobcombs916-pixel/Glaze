const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // Open file
    ipcMain.handle('open-file', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            filters: [
                { name: 'Supported Files', extensions: ['g1', 'txt', 'md', 'json'] }
            ],
            properties: ['openFile']
        });

        if (canceled) return null;
        const content = fs.readFileSync(filePaths[0], 'utf8');
        return { path: filePaths[0], content };
    });

    // Save file
    ipcMain.handle('save-file', async (event, data) => {
        if (!data.path) {
            const { canceled, filePath } = await dialog.showSaveDialog(win);
            if (canceled) return null;
            fs.writeFileSync(filePath, data.content);
            return filePath;
        } else {
            fs.writeFileSync(data.path, data.content);
            return data.path;
        }
    });
}

app.whenReady().then(createWindow);