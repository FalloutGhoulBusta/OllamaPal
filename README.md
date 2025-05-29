# Ollama GUI - Desktop Application

A modern, minimal desktop interface for Ollama - Local LLM Manager built with Electron.

## Features

- 🎨 **Dark/Light Theme** - Toggle between themes with persistent preferences
- 💬 **Chat Interface** - Clean, intuitive bubble-style chat experience with your local LLMs
- 🖼️ **Image Support** - Upload images for vision-enabled models like LLaVA
- ⚙️ **Model Management** - Easy model selection, pulling, and management
- 🔄 **Automatic Model Switching** - Intelligent cleanup of previous models when switching
- 🔍 **Registry Testing** - Validate model availability before downloading
- 🧪 **Test Suite** - Automated testing of predefined models
- 🎛️ **Advanced Settings** - Fine-tune temperature, top-p, and token limits
- 📱 **Mobile Responsive** - Fully responsive design with touch-friendly controls and mobile optimizations
- 📊 **Performance Monitoring** - Real-time system metrics dashboard with CPU, memory, and network monitoring
- 🎯 **Collapsible Sidebar** - Auto-hide sidebar with hover expansion for better space utilization
- 🔄 **Real-time Status** - Connection status and model information
- ⚠️ **Smart Notifications** - Color-coded warnings, errors, and success messages
- ⌨️ **Keyboard Shortcuts** - Efficient navigation and controls
- 🛠️ **Setup Assistant** - Guided CORS configuration with dark theme support
- 🎨 **Font Customization** - Multiple font options with dropdown selector
- 🌈 **Animated SVG Logo** - Auto-inverting colors every 2 seconds for dynamic visual appeal
- 🍁 **Maple Theme** - Beautiful Maple-inspired color scheme with frosted glass effects

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

## Mobile Responsiveness

The application features comprehensive mobile optimization for an excellent experience across all devices.

### Mobile Features
- **Responsive Layout** - Automatically adapts to different screen sizes (tablets, phones)
- **Touch-Friendly Controls** - Optimized button sizes and touch targets for mobile interaction
- **Collapsible Sidebar** - Full-width sidebar on mobile with auto-hide functionality
- **Mobile Chat Interface** - Bubble-style messages with appropriate sizing (max-width: 85% on mobile)
- **Responsive Dropdowns** - Model and font selectors adapt to mobile screen constraints
- **Mobile Performance Modal** - 2-column grid layout on mobile vs 4-column on desktop
- **Optimized Typography** - Scalable fonts and readable text sizes across devices

### Mobile Breakpoints
- **Desktop**: Full layout with expanded sidebar and 4-column performance grid
- **Mobile** (≤768px): Collapsed sidebar, 2-column performance grid, touch-optimized controls

### Mobile-Specific Optimizations
- Hamburger menu positioned on the right for better thumb accessibility
- Performance charts resize appropriately for mobile screens
- Input areas and message bubbles scale for mobile viewing
- Dropdown menus have minimum widths and appropriate padding for touch interaction

## Performance Monitoring

Real-time system performance monitoring with beautiful visualizations and accurate metrics.

### Performance Dashboard Features
- **Real-time Metrics** - Live CPU, memory, network, and system load monitoring
- **Interactive Charts** - Dynamic area charts showing performance trends over time
- **Accurate Readings** - Uses systeminformation library for precise system metrics matching Task Manager
- **Network Activity** - Displays network usage in KB/s for better granularity
- **Expandable Y-Axis** - Charts automatically adjust scale to accommodate values above 20
- **Maple Theme Integration** - Performance UI matches the beautiful Maple color scheme

### Accessing Performance Metrics
1. Click the **hamburger menu** (☰) in the top-right corner
2. Select **📊 Performance Metrics** from the menu
3. View real-time system performance data and charts
4. Charts update every second with smooth animations

### Performance Metrics Displayed
- **CPU Usage** - Real-time processor utilization percentage
- **Memory Usage** - Current RAM usage vs total available memory
- **Network Activity** - Network throughput in KB/s
- **System Load** - Overall system load average

## Automatic Model Switching

The application now features intelligent model management that automatically stops previous models when switching to prevent multiple models from consuming GPU memory simultaneously.

### How It Works
- **Smart Detection** - Automatically detects when you switch models via dropdown, sidebar, or before sending messages
- **Background Cleanup** - Stops the previously running model using Ollama's API
- **Memory Optimization** - Prevents multiple models from running simultaneously, saving GPU memory
- **User Feedback** - Shows notifications during the switching process

### Model Switch Triggers
1. **Dropdown Selection** - Selecting a different model from the header dropdown
2. **Sidebar Clicks** - Clicking on a model in the sidebar model list
3. **Send Button** - Automatic detection when sending a message with a different model selected

### Visual Feedback
- **Warning Notifications** - "Switching from [old-model] to [new-model]..." (light yellow background)
- **Success Notifications** - "Successfully stopped [old-model] and switched to [new-model]" (green background)
- **Error Handling** - Graceful handling with appropriate error messages if cleanup fails

### Before vs After
**Before (Multiple Models Running):**
```
PS C:\Users\user> ollama ps
NAME                ID              SIZE      PROCESSOR    UNTIL
qwen2.5:0.5b        a8b0c5157701    1.3 GB    100% GPU     5 minutes from now
tinyllama:latest    2644915ede35    1.9 GB    100% GPU     3 minutes from now
```

**After (Only Current Model Running):**
```
PS C:\Users\user> ollama ps
NAME                ID              SIZE      PROCESSOR    UNTIL
qwen2.5:0.5b        a8b0c5157701    1.3 GB    100% GPU     5 minutes from now
```

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

### Mobile Responsiveness & Performance Monitoring (Latest Update)
- **Full Mobile Support** - Comprehensive responsive design with touch-friendly controls
- **Real-time Performance Dashboard** - Live system metrics with beautiful charts and accurate readings
- **Collapsible Sidebar** - Auto-hide sidebar with hover expansion for better space utilization
- **Bubble-style Chat Interface** - Modern messaging app-style chat bubbles for better UX
- **Maple Theme Integration** - Beautiful Maple-inspired color scheme with frosted glass effects
- **Font Customization** - Multiple font options with dropdown selector for personalization
- **Animated SVG Logo** - Dynamic logo with automatic color inversion every 2 seconds

### UI/UX Enhancements
- **Hamburger Menu** - Right-positioned menu with performance metrics access
- **Frosted Glass Effects** - Translucent backgrounds for dropdowns with backdrop-filter blur
- **Mobile Optimizations** - Touch targets, responsive grids, and mobile-specific layouts
- **Performance Charts** - Dynamic area charts with expandable y-axis and real-time updates
- **Network Monitoring** - KB/s network activity measurements for better granularity

### Automatic Model Switching
- **Intelligent Model Management** - Automatically stops previous models when switching to new ones
- **Memory Optimization** - Prevents multiple models from running simultaneously, saving GPU memory
- **Smart Detection** - Detects model switches via dropdown, sidebar clicks, and send button
- **Real-time Feedback** - Visual notifications during model switching process
- **API Integration** - Uses Ollama's `/api/ps` and `/api/generate` endpoints for model management
- **Debug Support** - Comprehensive console logging for troubleshooting

### Registry Testing Integration
- **Enhanced UI** - Registry testing now available directly in the Pull Model modal
- **Improved Styling** - Light yellow warning messages with dark yellow text for better visibility
- **Better Contrast** - Enhanced button borders for improved accessibility
- **Dark Theme Support** - Full dark theme compatibility for Setup Required modal
- **Smart Notifications** - Context-aware warning vs error messages

### Key Features Added
- Full mobile responsiveness with touch-friendly controls
- Real-time performance monitoring dashboard with system metrics
- Animated SVG logo with automatic color inversion
- Collapsible sidebar with auto-hide functionality
- Bubble-style chat interface for modern messaging experience
- Font customization options with multiple typeface choices
- Maple theme with frosted glass effects and beautiful color scheme
- Automatic background model cleanup when switching models
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

### Automatic Model Switching Issues
- **Models not stopping** - Check browser console for API errors; ensure Ollama is running
- **Multiple models still running** - Verify `/api/ps` endpoint is accessible at `http://localhost:11434/api/ps`
- **Switch notifications not appearing** - Check if JavaScript console shows any errors
- **Debug information** - Open browser DevTools (F12) to see detailed switching logs

### Mobile Responsiveness Issues
- **Touch targets too small** - Ensure you're using the latest version with mobile optimizations
- **Sidebar not collapsing** - Check if CSS media queries are supported in your browser
- **Performance modal layout issues** - Verify screen width detection is working correctly
- **Charts not resizing** - Refresh the page or toggle the performance modal

### Performance Monitoring Issues
- **Metrics showing "--"** - Ensure the systeminformation library is properly installed
- **Charts not updating** - Check browser console for JavaScript errors
- **Network activity showing N/A** - This is normal; network monitoring requires additional setup
- **Performance modal not opening** - Verify the hamburger menu is accessible and functional

### Animated SVG Logo Issues
- **Logo not inverting colors** - Check if CSS filter property is supported in your browser
- **Animation too fast/slow** - The 2-second interval is fixed but can be modified in the code
- **Logo not visible** - Ensure SVG content is loading properly and CSS is applied

### Registry Testing Issues
- **Model not found warnings** are normal for non-existent models
- **Network errors** may indicate connectivity issues with registry.ollama.ai
- **Parsing errors** suggest invalid model name format
- Use the Test Suite to verify registry connectivity

### Build Issues
- Make sure Node.js version is 16 or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are installed
- For mobile testing, use browser developer tools to simulate mobile devices

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details.
