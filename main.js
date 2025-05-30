const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const si = require('systeminformation');

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
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
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
        },
        {
          label: 'Toggle Settings',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript('ollamaGUI.toggleSettings()');
            }
          }
        },
        {
          label: 'Focus Model Selector',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript('ollamaGUI.focusModelSelector()');
            }
          }
        },
        {
          label: 'Focus Message Input',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript('ollamaGUI.focusMessageInput()');
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
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript('ollamaGUI.showKeyboardShortcuts()');
            }
          }
        },
        { type: 'separator' },
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

async function getSystemMetrics() {
  let cpuUsage = 0;

  try {
    // Use systeminformation for accurate CPU usage
    const currentLoad = await si.currentLoad();
    cpuUsage = Math.round(currentLoad.currentLoad);
  } catch (err) {
    console.error('CPU monitoring error:', err);
    // Fallback to basic calculation if systeminformation fails
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    cpuUsage = Math.round(100 - (100 * idle / total));
  }

  // Memory usage - use systeminformation for more accurate data
  let memoryUsage, memoryTotal;
  try {
    const memInfo = await si.mem();
    memoryUsage = (memInfo.used / (1024 * 1024 * 1024)).toFixed(1); // GB
    memoryTotal = (memInfo.total / (1024 * 1024 * 1024)).toFixed(1); // GB
  } catch (err) {
    console.error('Memory monitoring error:', err);
    // Fallback to os module
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    memoryUsage = (usedMem / (1024 * 1024 * 1024)).toFixed(1); // GB
    memoryTotal = (totalMem / (1024 * 1024 * 1024)).toFixed(1); // GB
  }

  // System load (1, 5, 15 minute averages)
  const loadAvg = os.loadavg();

  // Network monitoring with systeminformation - improved interface selection
  let networkActivity = "N/A";
  try {
    const networkStats = await si.networkStats();

    if (networkStats && networkStats.length > 0) {
      // Find the best interface to monitor (active, external, non-virtual)
      let primaryInterface = networkStats.find(stat => {
        // Look for interfaces with actual activity or known good names
        return stat.iface &&
               !stat.iface.toLowerCase().includes('loopback') &&
               !stat.iface.toLowerCase().includes('virtual') &&
               (stat.rx_sec > 0 || stat.tx_sec > 0 ||
                stat.iface.toLowerCase().includes('wi-fi') ||
                stat.iface.toLowerCase().includes('ethernet'));
      });

      // Fallback to first interface if no ideal one found
      if (!primaryInterface && networkStats[0]) {
        primaryInterface = networkStats[0];
      }

      if (primaryInterface) {
        // Use built-in rates from systeminformation (more accurate)
        const totalBytesPerSec = primaryInterface.rx_sec + primaryInterface.tx_sec;
        const totalKBps = (totalBytesPerSec / 1024).toFixed(1);
        networkActivity = `${totalKBps} KB/s`;
      }
    }
  } catch (err) {
    console.error('Network monitoring error:', err);
  }

  return {
    cpuUsage,
    memoryUsage,
    memoryTotal,
    systemLoad: loadAvg[0].toFixed(2),
    networkActivity
  };
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

  ipcMain.handle('get-system-metrics', async () => {
    return getSystemMetrics();
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
