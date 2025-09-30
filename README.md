# 🎵 Lo-Fi Focus Timer - Progressive Web App

A beautiful and functional Pomodoro timer with ambient soundscapes, task tracking, and progress statistics. Built as a Progressive Web App (PWA) using Materialize CSS framework.

![Lo-Fi Focus Timer](https://img.shields.io/badge/PWA-Ready-brightgreen) ![Materialize](https://img.shields.io/badge/Framework-Materialize-red) ![HTML5](https://img.shields.io/badge/HTML-5-orange) ![CSS3](https://img.shields.io/badge/CSS-3-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

## ✨ Features

- ⏱️ **Pomodoro Timer**: Customizable focus (25min), short break (5min), and long break (15min) intervals
- 🎧 **Ambient Soundscapes**: 6 different sound options (Rain, Café, Nature, Ocean, Fireplace, White Noise)
- ✅ **Task Management**: Add, complete, and delete daily tasks
- 📊 **Progress Tracking**: Session counter, day streak, and tasks completed statistics
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🔄 **Offline Support**: Functions offline as a Progressive Web App
- 💾 **Local Storage**: Saves your progress and tasks automatically
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations

## 🚀 Live Demo

[View Live Demo](#) *(Add your GitHub Pages link here)*

## 📸 Screenshots

### Desktop View
![Desktop Screenshot](images/screenshot1.png)

### Mobile View
![Mobile Screenshot](images/screenshot2.png)

## 🛠️ Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with animations
- **Materialize CSS**: UI framework for responsive design
- **JavaScript (ES6)**: Interactive functionality and timer logic
- **Service Workers**: Offline functionality and caching
- **Web App Manifest**: PWA installation support
- **LocalStorage API**: Data persistence

## 📁 Project Structure

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
├── images/
│   ├── icon-192.png        # PWA icon (192x192)
│   ├── icon-512.png        # PWA icon (512x512)
│   └── screenshots/        # Application screenshots
└── README.md               # Project documentation
```

## 🔧 Installation & Setup

### Option 1: Download and Run Locally

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/rattnak/lofi-focus-timer.git
   cd lofi-focus-timer
   ```

2. **Download Materialize CSS and JS**
   - Visit [Materialize CSS](https://materializecss.com/getting-started.html)
   - Download the latest version
   - Extract `materialize.css`, `materialize.min.css` to `css/` folder
   - Extract `materialize.js`, `materialize.min.js` to `js/` folder

3. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

4. **Access the app**
   - Navigate to `http://localhost:8000`

### Option 2: Deploy to GitHub Pages

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select `main` branch as source
   - Click Save

3. **Access your live site**
   - Visit `https://rattnak.github.io/lofi-focus-timer/`

## 💡 How to Use

1. **Choose Your Mode**: Select between Focus Time (25min), Short Break (5min), or Long Break (15min)
2. **Select Soundscape**: Click on any ambient sound card to activate background audio
3. **Add Tasks**: Type your tasks in the input field and click Add or press Enter
4. **Start Timer**: Click the play button to begin your focus session
5. **Complete Tasks**: Check off tasks as you complete them
6. **Track Progress**: View your session count, streak, and completed tasks in the statistics section

## 🎯 PWA Features

This app includes Progressive Web App functionality:

- **Installable**: Can be installed on your device like a native app
- **Offline Access**: Works without internet connection after first visit
- **Fast Loading**: Cached resources for quick load times
- **Responsive**: Adapts to any screen size
- **App-like Experience**: Full-screen mode without browser chrome

### Installing as PWA

**On Desktop (Chrome/Edge)**:
1. Click the install icon in the address bar
2. Click "Install"

**On Mobile (Chrome/Safari)**:
1. Tap the menu button (⋮ or share icon)
2. Select "Add to Home Screen"
3. Tap "Add"

## 📝 Customization

### Changing Timer Durations

Edit the duration values in `index.html`:
```html
<button class="mode-btn active" data-mode="work" data-duration="25">Focus (25m)</button>
```

### Modifying Colors

Update the gradient colors in `css/style.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adding New Soundscapes

Add new sound cards in `index.html`:
```html
<div class="sound-card" data-sound="your-sound">
    <i class="material-icons">icon_name</i>
    <div>Sound Name</div>
</div>
```

## 🔒 Privacy

This app:
- Stores data locally on your device only
- Does not collect or transmit any personal information
- Does not require an account or login
- Does not use cookies or trackers

## 🐛 Known Issues

- Sound playback is simulated (no actual audio files included)
- Statistics reset when browser data is cleared
- Some browsers may limit service worker functionality

## 🚀 Future Enhancements

- [ ] Actual ambient sound files
- [ ] Custom timer durations
- [ ] Data export/import functionality
- [ ] Multiple theme options
- [ ] Notification sounds
- [ ] Weekly/monthly statistics
- [ ] Cloud sync (optional)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Your Name**
- GitHub: [@rattnak](https://github.com/rattnak)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Materialize CSS](https://materializecss.com/) - UI Framework
- [Material Icons](https://fonts.google.com/icons) - Icon library
- [Francesco Cirillo](https://francescocirillo.com/pages/pomodoro-technique) - Creator of the Pomodoro Technique


