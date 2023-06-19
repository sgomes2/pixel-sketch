const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");

const isDev = process.env.NODE_ENV !== "production" ? true : false;

const isMac = process.platform === "darwin" ? true : false;

const windowLoc = isDev ? "localhost:3000" : `${__dirname}/out/index.html`;

let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Pixel Sketch",
    width: 1000,
    height: 1000,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(windowLoc);
}

// function createAboutWindow() {
//   aboutWindow = new BrowserWindow({
//     title: "About Image Shrink",
//     width: 300,
//     height: 300,
//     icon: `${__dirname}/assets/icons/Icon_256x256.png`,
//     resizable: false,
//   });

//   aboutWindow.loadFile(`${__dirname}/app/about.html`);
// }

// async function shrinkImage({ imgPath, quality, dest }) {
//   try {
//     const pngQuality = quality / 100;

//     const files = await imagemin([slash(imgPath)], {
//       destination: dest,
//       plugins: [
//         imageminMozjpeg(quality),
//         imageminPngquant({ quality: [pngQuality, pngQuality] }),
//       ],
//     });

//     log.info(files);

//     shell.openPath(dest);

//     mainWindow.webContents.send("image:done");
//   } catch (err) {
//     log.info(err);
//   }
// }

// ipcMain.on("image:minimize", (e, options) => {
//   shrinkImage(options);
// });

app.on("ready", () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("ready", () => (mainWindow = null));
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
  { role: "fileMenu" },
  // ...(!isMac
  //   ? [
  //       {
  //         label: app.name,
  //         submenu: [{ label: "About", click: createAboutWindow }],
  //       },
  //     ]
  //   : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with cmd + q
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
