# Proxy Manager

A simple Chrome extension for managing HTTP proxy connections with one click.

## Why This Extension?

Tired of navigating through Chrome settings every time you need to configure a proxy? This extension puts proxy management right in your toolbar with a clean, simple interface.

## Features

✅ **One-Click Connection** - Connect/disconnect with a single click  
✅ **Multiple Format Support** - Works with different proxy configuration formats  
✅ **Visual Status** - Know instantly if you're connected (green) or not (red)  
✅ **Auto-Save** - Remembers your last configuration  
✅ **Auto-Restore** - Reconnects automatically when Chrome restarts  
✅ **Input Validation** - Prevents configuration mistakes before they happen  

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `chrome-proxy-manager` folder
6. Done! The extension icon will appear in your toolbar

## Usage

### Quick Start

1. Click the extension icon
2. Select your proxy format from the dropdown
3. Enter your proxy details
4. Click **Connect**
5. When Chrome prompts, enter your credentials

### Supported Formats

| Format | Example | Use Case |
|--------|---------|----------|
| `ip:port:username:password` | `192.168.1.1:8080:user:pass` | Standard format |
| `ip:port@username:password` | `192.168.1.1:8080@user:pass` | Alternative format |
| `ip:port` | `192.168.1.1:8080` | No authentication |

### Status Indicator

- 🔴 **Red dot** = Disconnected
- 🟢 **Green dot** = Connected

### Disconnecting

1. Click the extension icon
2. Click **Disconnect**
3. You're back to direct connection

## Authentication

When you connect, Chrome will show an authentication dialog. This is normal:

1. Enter your **username** in Chrome's dialog
2. Enter your **password** in Chrome's dialog
3. Chrome caches these for your session
4. You won't be prompted again until Chrome restarts

**Why?** Chrome's security model requires system-level authentication for proxies. The extension can't bypass this, but it makes setup much faster than manual configuration.

## Tips & Tricks

### Pin the Extension
Click the puzzle piece icon → Find "Proxy Manager" → Click the pin icon

### Keyboard Shortcut
Press `Enter` after typing your proxy config to connect instantly

### Clear Saved Config
Click "Clear Saved Config" at the bottom to remove stored credentials

### Check Your Connection
Open any website - if it loads through the proxy, you're connected

## Troubleshooting

### Extension won't load
- Check that all files are present
- Look for errors on `chrome://extensions/`
- Try removing and re-adding the extension

### Can't connect
- Verify proxy server is running
- Check IP address and port are correct
- Ensure firewall isn't blocking the connection
- Try disconnecting and reconnecting

### Authentication fails
- Double-check username and password
- Remove extra spaces from credentials
- Try a different format from the dropdown
- Contact your proxy provider

### Proxy works but sites won't load
- Some sites may block proxy traffic
- Check if your proxy supports HTTPS
- Try accessing HTTP sites first
- Verify the proxy isn't filtering content

## Privacy & Security

✅ **Local Storage Only** - Credentials saved in Chrome's encrypted storage  
✅ **No External Calls** - Extension doesn't phone home  
✅ **No Tracking** - Zero analytics or telemetry  
✅ **Open Source** - Review the code yourself  
✅ **Minimal Permissions** - Only requests what's absolutely necessary  

### What Gets Stored?

- Your proxy configuration (IP, port, username, password)
- Connection status (connected/disconnected)

### Where Is It Stored?

In Chrome's local storage, which is:
- Encrypted on disk by Chrome
- Isolated per-extension
- Cleared when you uninstall

### Security Best Practices

1. ✅ Use strong, unique passwords for proxy authentication
2. ✅ Clear saved config on shared computers
3. ✅ Disconnect when not needed
4. ✅ Only use trusted proxy servers
5. ❌ Don't share your proxy credentials

## How It Works

```
You enter config → Extension validates → Chrome sets proxy → 
Chrome prompts for auth → You enter credentials → Connected!
```

The extension uses Chrome's Proxy API with PAC (Proxy Auto-Configuration) scripts. This is the standard, secure way to configure proxies in modern browsers.

## Limitations

⚠️ **Authentication Dialog** - Chrome will always prompt for credentials (security requirement)  
⚠️ **HTTP Only** - Currently supports HTTP proxies (SOCKS coming soon)  
⚠️ **Session-Based Auth** - Credentials cleared when Chrome closes  
⚠️ **Single Proxy** - Can't rotate between multiple proxies (yet)  

## Roadmap

Ideas for future versions:

- [ ] SOCKS proxy support
- [ ] Multiple proxy profiles
- [ ] Auto-switch by domain
- [ ] Proxy testing/validation
- [ ] Import/export configurations
- [ ] Dark mode
- [ ] Keyboard shortcuts

## Development

### Project Structure

```
chrome-proxy-manager/
├── manifest.json      # Extension configuration
├── background.js      # Proxy logic & state management
├── popup.html        # User interface
├── popup.css         # Styling
├── popup.js          # UI logic & validation
```

### Making Changes

1. Edit the files
2. Go to `chrome://extensions/`
3. Click the reload icon on the extension card
4. Test your changes

### Debugging

- **Background script**: Click "Inspect views: service worker"
- **Popup**: Right-click icon → "Inspect popup"
- **Console logs**: Check browser console for errors

## Technical Details

- **Manifest Version**: 3 (latest)
- **Permissions**: `proxy`, `storage`
- **Browser**: Chrome 88+ (Chromium-based browsers)
- **Dependencies**: None

## Contributing

Found a bug? Have a feature request? Contributions welcome!

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

Having issues? Try these:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the code - it's simple and well-commented
3. Open an issue with details about your problem

## License

This extension is provided as-is for personal and professional use.

## Acknowledgments

Built with ❤️ for developers who value their time.

---

**Made by**: Favour Oladeji  
**Version**: 1.0.1  
**Last Updated**: February 2026

> "Why spend 30 seconds in Chrome settings when you can spend 1 second in an extension?"