# 🤖 JustRunMy.App Auto Reset

[![GitHub stars](https://img.shields.io/github/stars/j-a-y-e-s-h/justrunmy-auto-reset?style=flat-square&logo=github)](https://github.com/j-a-y-e-s-h/justrunmy-auto-reset)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Available-brightgreen?style=flat-square&logo=google-chrome)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0-orange?style=flat-square)]()
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow?style=flat-square&logo=javascript)]()
[![Telegram Compatible](https://img.shields.io/badge/🤖%20Telegram-Bot%20Compatible-0088cc?style=flat-square)]()
![Downloads](https://img.shields.io/badge/dynamic/json?url=https://github.com/j-a-y-e-s-h/justrunmy-auto-reset&query=watchers&label=Watchers&style=flat-square&logo=github)

**Automatically reset your JustRunMy.App timer on schedule. Keep your Telegram bot alive 24/7 without manual intervention.** ⏰✨

A powerful Chrome extension that automates timer resets for [JustRunMy.App](https://justrunmy.app) users. Perfect for developers who use JustRunMy to keep their Telegram bots and applications running indefinitely.

## 🎯 Why Use This?

**Problem:** JustRunMy.App timer resets manually every 24 hours, but if you forget or your bot can't access it, your Telegram bot goes offline.

**Solution:** This extension automatically resets the timer on your schedule - no manual effort required. Your bot stays alive 24/7.

**Result:** ✅ Never worry about bot downtime again  
✅ Set it once, forget it  
✅ Works while you sleep  
✅ Completely free and open source  

### Perfect For:
- 🤖 **Telegram Bot Developers** - Keep bots running indefinitely
- 🔧 **App Maintainers** - Automate JustRunMy.App resets
- ⏰ **Lazy Developers** - No manual reset clicks
- 💰 **Budget-Conscious** - Free replacement for paid alternatives

## Overview

JustRunMy.App Auto Reset is a powerful automation tool designed for developers and bot maintainers who use JustRunMy.App to keep their applications running. This extension automatically accesses your JustRunMy.App panel and resets the timer at scheduled intervals, ensuring your Telegram bot (or any other application) remains active without manual intervention.

## Comparison with Alternatives

| Feature | This Extension | Manual Click | Browser Task | Other Bots |
|---------|---|---|---|---|
| **Automatic** | ✅ | ❌ | ❌ | ✅ |
| **Easy Setup** | ✅ | N/A | ❌ | ❌ |
| **Free** | ✅ | N/A | ✅ | ❌ |
| **Open Source** | ✅ | N/A | ❌ | ❌ |
| **No Dependencies** | ✅ | N/A | ✅ | ❌ |
| **Schedule Control** | ✅ | N/A | ❌ | ✅ |
| **Works Offline** | ❌ | ✅ | ❌ | Depends |

---

## 📸 Screenshots

### Main Popup Interface
![Main Popup](https://via.placeholder.com/600x400?text=Main+Popup+Interface)

### Status Dashboard
![Status Tab](https://via.placeholder.com/600x400?text=Status+Dashboard)

### Reset History
![History Tab](https://via.placeholder.com/600x400?text=Reset+History+Tracking)

### Settings Configuration
![Settings Page](https://via.placeholder.com/600x400?text=Easy+Settings+Configuration)

### Schedule Example
![Schedule](https://via.placeholder.com/600x400?text=Flexible+Day+Scheduling)

> **Note:** Replace placeholder images with actual screenshots. Instructions below. 👇

#### How to Add Your Screenshots:

1. **Take screenshots** of your extension in action:
   - Popup interface
   - Status tab
   - History tab
   - Settings page
   - Any other interesting features

2. **Save images** to a `screenshots/` folder in your repo:
   ```
   screenshots/
   ├── popup.png
   ├── status.png
   ├── history.png
   ├── settings.png
   └── schedule.png
   ```

3. **Update README** with your images:
   ```markdown
   ![Feature Name](./screenshots/filename.png)
   ```

4. **Commit and push**:
   ```bash
   git add screenshots/
   git commit -m "Add screenshots"
   git push origin main
   ```

---

## ⚡ Features

✨ **Automatic Timer Reset**
- Scheduled resets on specific days and times
- Configurable frequency (select which days of the week to run)
- Set custom reset times in IST (Indian Standard Time)

📊 **Real-time Monitoring**
- Live countdown to next scheduled reset
- Status indicators (idle, running, success, error, retry)
- Visual progress tracking with step indicators

📅 **Flexible Scheduling**
- Choose specific days of the week (Sun-Sat)
- Default: Tuesday, Thursday, Saturday at 23:00 IST
- Customizable through options page

🔄 **Automatic Retries**
- Automatic retry on failure (up to 3 attempts)
- 5-minute delay between retry attempts
- Detailed error and success logging

📝 **Reset History**
- View recent reset attempts (last 10 entries)
- Detailed timestamps for each reset
- Success/failure status indicators

⚙️ **Easy Configuration**
- User-friendly settings page
- No coding required
- Browse button to customize the target URL

## Installation

### From Source (Developer Mode)

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   # or download as ZIP and extract
   ```

2. **Open Chrome Extensions Page**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)

3. **Load Extension**
   - Click **Load unpacked**
   - Navigate to and select this project folder
   - The extension should appear in your extensions list

4. **Verify Installation**
   - An icon should appear in your Chrome toolbar
   - Click it to see the popup and verify it's working

## Usage

### Quick Start

1. **Click the extension icon** in your Chrome toolbar
2. **View Status** - See your next scheduled reset in the main panel
3. **Configure Settings** (optional):
   - Click the ⚙️ settings button
   - Adjust schedule days and time if needed
   - Customize the target application URL if different

### Popup Interface

The main popup includes:

- **Status Bar** - Current operation state and timer information
- **Countdown Timer** - Hours:minutes:seconds until next reset
- **Next Reset Info** - Formatted date and time (IST) of upcoming reset
- **Tabs:**
  - **Status** - Current state and countdown
  - **History** - Recent reset attempts (success/failures with timestamps)
  - **Next Reset** - Detailed information about the scheduled reset

### Settings Page

Access via the ⚙️ button or `chrome://extensions/` → Details → Options

- **Schedule Days** - Toggle which days to run resets (Sun-Sat)
- **Time** - Set the reset time (default: 23:00 IST)
- **Cloudflare Wait** - Time to allow for Cloudflare processing (default: 12s)
- **Application URL** - Target URL for reset (default: JustRunMy.App panel)

## Configuration

### Default Settings

```javascript
scheduleDays:    [2, 4, 6]        // Tuesday, Thursday, Saturday
hourIST:         23               // 11:00 PM IST
minuteIST:       0                // Start of hour
cfWaitSeconds:   12               // Cloudflare processing time
appUrl:          "https://justrunmy.app/panel/application/5438"
```

### Changing Settings

1. Click the settings (⚙️) icon in the popup
2. Adjust days and time as needed
3. Settings are automatically saved
4. The countdown timer updates immediately

## How It Works

1. **Scheduling** - Extension uses Chrome's Alarm API to schedule resets
2. **Background Processing** - Background service worker runs at scheduled times
3. **Timer Reset** - Automatically navigates to your app URL and triggers the reset
4. **Error Handling** - On failure, retries up to 3 times with 5-minute intervals
5. **Notification** - Updates UI with success/failure status and badge indicator

### Permissions Explanation

- **alarms** - Schedule reset operations
- **tabs** - Access JustRunMy.App in background tab
- **scripting** - Run scripts to trigger reset mechanism
- **storage** - Save settings and reset history
- **notifications** - Alert you of important events
- **justrunmy.app/\*** - Access the target application

## Project Structure

```
📦 justrunmy-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker & scheduling logic
├── popup.html            # Popup UI template
├── popup.js              # Popup functionality & interactions
├── options.html          # Settings page template
├── options.js            # Settings management logic
├── icon.png              # Extension icon (48x48)
└── README.md             # This file
```

## Technical Details

### Browser Compatibility
- **Chrome 88+** (uses Manifest V3)
- Works with Chromium-based browsers (Edge, Brave, etc.)

### Architecture
- **Manifest V3** compatible
- Service Worker based (not Content Script dependent)
- LocalStorage for settings persistence
- Chrome Alarms API for scheduling

### Performance
- Minimal background activity
- Lightweight (~50KB total)
- Efficient timer calculations
- No continuous polling

## Troubleshooting

### Extension Not Triggering Resets

1. **Check Schedule**
   - Verify the enabled days match your desired schedule
   - Confirm the time is set correctly (IST timezone)
   - Ensure system time is accurate

2. **Check Status**
   - Open popup to see current status
   - Look for error indicators (red badge)
   - Review history for failure messages

3. **Verify Settings**
   - Confirm the app URL is correct
   - Check Cloudflare wait time if needed
   - Try manually opening the URL in browser

### Reset Failed - Error Status

1. **Check Internet Connection** - Ensure stable connection
2. **Check App URL** - Verify JustRunMy.App is accessible
3. **Check Credentials** - Ensure you're logged in to the application
4. **Review Logs** - Check history for specific error messages
5. **Retry** - The extension will auto-retry 3 times

### History Not Showing

- Click the **History** tab in popup
- Check that resets have been attempted (at least one)
- Clear extension data and reset if needed

## Support & Issues

If you encounter issues:

1. Check the troubleshooting section above
2. Review recent history in the popup for error details
3. Verify all settings are configured correctly
4. Try uninstalling and reinstalling the extension
5. Check that JustRunMy.App is online and accessible

## Privacy & Security

- ✅ No data collected or transmitted to external servers
- ✅ All settings stored locally in Chrome
- ✅ History stored only on your computer
- ✅ No tracking or analytics
- ✅ Open source - review the code yourself

## License

[Add your license here]

## Version History

### v2.0
- Complete redesign with modern UI
- Improved reliability with better error handling
- Enhanced settings page
- Live countdown timer
- Reset history tracking
- Automatic retry mechanism
- Multiple day scheduling support
- Status indicators and badges

### v1.0
- Initial release
- Basic automated reset functionality

---

**Developed for keeping your JustRunMy.App bots running 24/7** 🤖

## 🙏 Support This Project

If you find this extension helpful:

- ⭐ **Star the repository** - Helps others discover it!
- 🐛 **Report bugs** - Use GitHub Issues
- 💡 **Suggest features** - Share your feature ideas
- 📣 **Tell your friends** - Share in communities
- 🤝 **Contribute** - Submit pull requests with improvements

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Community

- 🐛 **Found a bug?** [Open an Issue](https://github.com/j-a-y-e-s-h/justrunmy-auto-reset/issues)
- 💬 **Have feedback?** [Start a Discussion](https://github.com/j-a-y-e-s-h/justrunmy-auto-reset/discussions)
- 📝 **Want to contribute?** [See Contributing Guide](#contributing)

## Related Projects

- [JustRunMy.App](https://justrunmy.app) - Official JustRunMy application
- [Awesome Telegram Bots](https://github.com/botlist/awesome-telegram) - Curated Telegram bot resources
- [Awesome Chrome Extensions](https://github.com/topics/chrome-extension) - Chrome extension showcase

---

## 📊 Stats

![GitHub repo size](https://img.shields.io/github/repo-size/j-a-y-e-s-h/justrunmy-auto-reset?style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/j-a-y-e-s-h/justrunmy-auto-reset?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/j-a-y-e-s-h/justrunmy-auto-reset?style=flat-square)
