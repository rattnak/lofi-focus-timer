# LoFi Focus Timer

A minimalistic Pomodoro timer Progressive Web App (PWA) designed for focused work sessions with a beautiful, distraction-free interface.

## Features

- **Pomodoro Timer**: 25-minute focus sessions with 5-minute breaks
- **Task Management**: Track and complete daily tasks
- **Session Statistics**: Monitor sessions completed, tasks done, and total focus time
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Progressive Web App**: Install and use offline on any device
- **Customizable Settings**: Adjust focus/break durations and notification preferences
- **Modern UI**: Gradient animations and glassmorphism effects

## Project Structure

```
lofi-focus-timer/
├── index.html              # Main application page
├── manifest.json           # PWA manifest file
├── serviceWorker.js        # Service worker for offline support
├── css/
│   ├── materialize.css     # Materialize framework (full)
│   ├── materialize.min.css # Materialize framework (minified)
│   └── style.css           # Custom styles and animations
├── js/
│   ├── materialize.js      # Materialize JavaScript (full)
│   ├── materialize.min.js  # Materialize JavaScript (minified)
│   └── ui.js               # Custom application logic
├── pages/
│   ├── about.html          # About page
│   └── settings.html       # Settings page
└── README.md               # Project documentation
```

## Installation

### Local Development

1. Clone or download this repository
2. Start a local server in the project directory:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using VS Code:**
- Install the "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

3. Open your browser and navigate to `http://localhost:8000`

### Installing as PWA

Once the app is running on a local server or deployed:

**Desktop (Chrome/Edge):**
- Look for the install icon in the address bar
- OR click the three-dot menu → "Install LoFi Focus Timer"

**Mobile:**
- Tap the menu (three dots)
- Select "Add to Home Screen" or "Install app"

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Application logic and PWA functionality
- **Materialize CSS**: UI framework for responsive design
- **Service Workers**: Offline functionality and caching
- **Web App Manifest**: PWA configuration

## Usage

### Timer Controls

1. **Start/Pause**: Click the play button to start or pause the timer
2. **Reset**: Click the refresh button to reset the current session
3. **Auto-transitions**: Timer automatically switches between focus and break sessions

### Task Management

1. Enter a task in the input field
2. Click "Add Task" or press Enter
3. Mark tasks as complete or delete them
4. Track completed tasks in the statistics

### Settings

Access the settings page to customize:
- Focus session duration (1-60 minutes)
- Break duration (1-30 minutes)
- Auto-start breaks toggle
- Sound and desktop notifications
- Reset all data

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Opera 67+

**Note**: PWA features require HTTPS (or localhost for development)

## Offline Support

The app includes a service worker that caches all necessary files for offline use. Once installed, you can use the timer without an internet connection.

## Future Enhancements

- Long break sessions (after 4 pomodoros)
- Custom timer sounds
- Task categories and priorities
- Weekly/monthly statistics
- Data export functionality
- Theme customization

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Materialize CSS](https://materializecss.com/)
- Icons from [Google Material Icons](https://fonts.google.com/icons)
- Inspired by the Pomodoro Technique by Francesco Cirillo
