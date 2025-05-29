const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;
let isQuitting = false; // Flag to prevent infinite loop

// Enable live reload for development
if (process.argv.includes('--dev')) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Allows CORS for Ollama API
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // Add icon if available
    show: false, // Don't show until ready
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
  });

  // Load the HTML file
  mainWindow.loadFile('ollama-gui.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Focus window on creation
    if (process.platform === 'darwin') {
      mainWindow.focus();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle app focus/blur for potential model management
  mainWindow.on('blur', () => {
    console.log('App lost focus - could implement model unload logic here');
    // Optional: Could trigger model unload here based on user preferences
  });

  mainWindow.on('focus', () => {
    console.log('App gained focus');
  });

  // Development tools
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Chat',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript('ollamaGUI.clearChat()');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        {
          label: 'Toggle Dark Mode',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript('ollamaGUI.toggleTheme()');
            }
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Ollama GUI',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Ollama GUI',
              message: 'Ollama GUI',
              detail: 'A desktop interface for Ollama - Local LLM Manager\n\nVersion: 1.0.0'
            });
          }
        },
        {
          label: 'Ollama Documentation',
          click: () => {
            shell.openExternal('https://ollama.ai/');
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Window menu
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Function to get currently running models
function getRunningModels() {
  return new Promise((resolve, reject) => {
    const command = 'ollama ps';
    console.log('Checking for running models...');

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error checking running models:', error);
        reject(error);
        return;
      }

      if (stderr) {
        console.error('stderr checking running models:', stderr);
        reject(new Error(stderr));
        return;
      }

      // Parse the output to extract model names
      const lines = stdout.split('\n').filter(line => line.trim());
      const runningModels = [];

      // Skip header line and parse model names
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          // Extract model name (first column)
          const modelName = line.split(/\s+/)[0];
          if (modelName && modelName !== 'NAME') {
            runningModels.push(modelName);
          }
        }
      }

      console.log('Running models found:', runningModels);
      resolve(runningModels);
    });
  });
}

// Function to stop a specific Ollama model
function stopModel(modelName) {
  return new Promise((resolve, reject) => {
    const command = `ollama stop ${modelName}`;
    console.log(`Stopping model: ${modelName}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error stopping model ${modelName}:`, error);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`stderr stopping model ${modelName}:`, stderr);
        reject(new Error(stderr));
        return;
      }

      console.log(`Successfully stopped model: ${modelName}`);
      resolve(stdout);
    });
  });
}

// Function to stop all running models
async function stopAllRunningModels() {
  try {
    const runningModels = await getRunningModels();

    if (runningModels.length === 0) {
      console.log('No models currently running');
      return;
    }

    console.log(`Found ${runningModels.length} running model(s), stopping them...`);

    // Stop all running models
    const stopPromises = runningModels.map(modelName =>
      stopModel(modelName).catch(error => {
        console.error(`Failed to stop ${modelName}:`, error);
        return null; // Don't let one failure stop the others
      })
    );

    await Promise.all(stopPromises);
    console.log('Finished stopping all running models');

  } catch (error) {
    console.error('Error stopping running models:', error);
  }
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async (event) => {
  // Prevent infinite loop
  if (isQuitting) {
    console.log('Already quitting, allowing app to close...');
    return;
  }

  console.log('App is quitting...');
  isQuitting = true;

  // Prevent immediate quit to allow model stopping
  event.preventDefault();

  try {
    // Stop all currently running models
    await stopAllRunningModels();
  } catch (error) {
    console.error('Error during model cleanup:', error);
  }

  // Now allow the app to quit
  console.log('Model cleanup complete, quitting app...');
  app.quit();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
