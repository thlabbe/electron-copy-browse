import { app, BrowserWindow, ipcMain } from "electron";
import { dialog } from "electron";
import * as path from "path";
import { COPY_ANALYZE_MSG, COPY_SELECT_MSG } from "./actions";
import { Copy } from "./Copy";

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "views/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on( COPY_SELECT_MSG, (event: any, ...args: any[]) => {
  const copybook = dialog.showOpenDialog({ title: "Selectionnez un Copybook",
        // multiSelections: false,
        filters: [
            { name: "Copybook", extensions: ["cpy"] },
            { name: "Cobol", extensions: ["cob", "cbl"] },
            { name: "All Files", extensions: ["*"] },
        ],
        properties: ["openFile"],
    });

  if (copybook && copybook.length >= 1) {
    event.returnValue = copybook[0];
  } else {
    event.returnValue = null;
  }
});

ipcMain.on( COPY_ANALYZE_MSG, (event: any, copyToParse: string) => {
  const copy = new Copy(copyToParse);
  event.returnValue = copy.parse();

});
