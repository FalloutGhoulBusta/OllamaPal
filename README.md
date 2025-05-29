# Ollama GUI - Desktop Application

A modern, minimal desktop interface for Ollama - Local LLM Manager built with Electron.

## Features

- 🎨 **Dark/Light Theme** - Toggle between themes with persistent preferences
- 💬 **Chat Interface** - Clean, intuitive chat experience with your local LLMs
- 🖼️ **Image Support** - Upload images for vision-enabled models like LLaVA
- ⚙️ **Model Management** - Easy model selection, pulling, and management
- 🔍 **Registry Testing** - Validate model availability before downloading
- 🧪 **Test Suite** - Automated testing of predefined models
- 🎛️ **Advanced Settings** - Fine-tune temperature, top-p, and token limits
- 📱 **Responsive Design** - Works well on different screen sizes
- 🔄 **Real-time Status** - Connection status and model information
- ⚠️ **Smart Notifications** - Color-coded warnings, errors, and success messages
- ⌨️ **Keyboard Shortcuts** - Efficient navigation and controls
- 🛠️ **Setup Assistant** - Guided CORS configuration with dark theme support

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

## Registry Testing

The application includes comprehensive model registry validation to ensure models exist before attempting to download them.

### Features
- **Manual Testing** - Test individual model names in the Pull Model modal
- **Automated Test Suite** - Run predefined tests on common models
- **Smart Validation** - Parses model names with namespace/tag support
- **Visual Feedback** - Color-coded results with detailed error messages

### How to Use
1. Open the **Pull New Model** dialog
2. Enter a model name (e.g., `llama2`, `mistral:7b`, `library/codellama:13b`)
3. Click **Test Registry** to validate the model exists
4. Or click **Run Test Suite** to test multiple predefined models
5. Review results before pulling the model

### Supported Model Formats
- `model` - Uses default 'library' namespace and 'latest' tag
- `model:tag` - Uses default 'library' namespace with specified tag
- `namespace/model:tag` - Full specification with custom namespace

### Test Results
- ✅ **Success** - Model found in registry (green background)
- ⚠️ **Warning** - Model not found (light yellow background with dark yellow text)
- ❌ **Error** - Network or parsing error (red background)

## Keyboard Shortcuts

- `Ctrl/Cmd + N` - New Chat
- `Ctrl/Cmd + D` - Toggle Dark/Light Mode
- `Ctrl/Cmd + Q` - Quit Application
- `Enter` - Send message (chat) / Test registry (model input)
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
├── main.js                    # Electron main process
├── ollama-gui.html           # Main application UI with registry testing
├── test-registry-check.html  # Standalone registry testing utility
├── package.json              # Project configuration
├── README.md                 # This file
└── dist/                     # Built applications (after build)
```

## Development

The application is built with:
- **Electron** - Desktop app framework
- **Vanilla JavaScript** - No additional frameworks for simplicity
- **CSS Custom Properties** - For theming support
- **Ollama API** - Direct integration with local Ollama instance

## Recent Improvements

### Registry Testing Integration (Latest Update)
- **Complete Feature Parity** - All functionality from `test-registry-check.html` integrated into main GUI
- **Enhanced UI** - Registry testing now available directly in the Pull Model modal
- **Improved Styling** - Light yellow warning messages with dark yellow text for better visibility
- **Better Contrast** - Enhanced button borders for improved accessibility
- **Dark Theme Support** - Full dark theme compatibility for Setup Required modal
- **Smart Notifications** - Context-aware warning vs error messages

### Key Features Added
- Manual model registry validation before downloading
- Automated test suite with predefined models
- Enter key support for quick testing
- Comprehensive error handling and user feedback
- Theme-consistent styling across all components

## Troubleshooting

### Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check if Ollama is accessible: visit `http://localhost:11434` in your browser
- Configure CORS as described above
- Use the built-in Setup Assistant for guided configuration

### Registry Testing Issues
- **Model not found warnings** are normal for non-existent models
- **Network errors** may indicate connectivity issues with registry.ollama.ai
- **Parsing errors** suggest invalid model name format
- Use the Test Suite to verify registry connectivity

### Build Issues
- Make sure Node.js version is 16 or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are installed

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details.
