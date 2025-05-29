# Ollama GUI - Desktop Application

A modern, minimal desktop interface for Ollama - Local LLM Manager built with Electron.

## Features

- 🎨 **Dark/Light Theme** - Toggle between themes with persistent preferences
- 💬 **Chat Interface** - Clean, intuitive chat experience with your local LLMs
- 🖼️ **Image Support** - Upload images for vision-enabled models like LLaVA
- ⚙️ **Model Management** - Easy model selection, pulling, and management
- 🎛️ **Advanced Settings** - Fine-tune temperature, top-p, and token limits
- 📱 **Responsive Design** - Works well on different screen sizes
- 🔄 **Real-time Status** - Connection status and model information
- ⌨️ **Keyboard Shortcuts** - Efficient navigation and controls

## Prerequisites

1. **Ollama** must be installed and running on your system
   - Download from: https://ollama.ai/
   - Make sure it's running on `localhost:11434`

2. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/

## Installation

1. **Clone or download** this repository
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Quick Start (Windows)
```bash
run.bat
```
This will start the application with helpful setup reminders.

### Development Mode
```bash
npm run dev
```
This runs the app with developer tools and live reload.

### Production Mode
```bash
npm start
```

## Building for Distribution

### Build for current platform
```bash
npm run build
```

### Build for specific platforms
```bash
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

Built applications will be in the `dist/` folder.

## Keyboard Shortcuts

- `Ctrl/Cmd + N` - New Chat
- `Ctrl/Cmd + D` - Toggle Dark/Light Mode
- `Ctrl/Cmd + Q` - Quit Application
- `Enter` - Send message
- `Shift + Enter` - New line in message
- `Escape` - Close modals

## Configuration

### CORS Setup for Ollama

If you encounter connection issues, you may need to enable CORS in Ollama:

**Windows (Command Prompt):**
```cmd
set OLLAMA_ORIGINS=*
ollama serve
```

**Windows (PowerShell):**
```powershell
$env:OLLAMA_ORIGINS="*"
ollama serve
```

**macOS/Linux:**
```bash
export OLLAMA_ORIGINS="*"
ollama serve
```

## Project Structure

```
ollama-gui/
├── main.js              # Electron main process
├── ollama-gui.html      # Application UI
├── package.json         # Project configuration
├── README.md           # This file
└── dist/               # Built applications (after build)
```

## Development

The application is built with:
- **Electron** - Desktop app framework
- **Vanilla JavaScript** - No additional frameworks for simplicity
- **CSS Custom Properties** - For theming support
- **Ollama API** - Direct integration with local Ollama instance

## Troubleshooting

### Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check if Ollama is accessible: visit `http://localhost:11434` in your browser
- Configure CORS as described above

### Build Issues
- Make sure Node.js version is 16 or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are installed

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details.
