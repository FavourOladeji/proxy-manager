// Background Service Worker for Proxy Management

let currentProxyConfig = null;

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setProxy') {
    setProxyConfiguration(request.config)
      .then(() => {
        currentProxyConfig = request.config;
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error setting proxy:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }

  if (request.action === 'clearProxy') {
    clearProxyConfiguration()
      .then(() => {
        currentProxyConfig = null;
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error clearing proxy:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (request.action === 'getStatus') {
    sendResponse({ 
      success: true, 
      isConnected: currentProxyConfig !== null,
      config: currentProxyConfig 
    });
    return true;
  }
});

// Set proxy configuration
async function setProxyConfiguration(config) {
  return new Promise((resolve, reject) => {
    const proxyConfig = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: 'http',
          host: config.host,
          port: config.port
        },
        bypassList: ['localhost', '127.0.0.1']
      }
    };

    chrome.proxy.settings.set(
      { value: proxyConfig, scope: 'regular' },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      }
    );
  });
}

// Clear proxy configuration
async function clearProxyConfiguration() {
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.set(
      { value: { mode: "direct" }, scope: "regular" },
      () => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else resolve();
      }
    );
  });
}

// Handle proxy authentication
chrome.webRequest.onAuthRequired.addListener(
  (details) => {
    if (currentProxyConfig) {
      return {
        authCredentials: {
          username: currentProxyConfig.username,
          password: currentProxyConfig.password
        }
      };
    }
    return { cancel: false };
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// Restore proxy configuration on browser startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    const result = await chrome.storage.local.get(['proxyConfig', 'proxyStatus']);
    
    if (result.proxyStatus?.isConnected && result.proxyConfig) {
      const parts = result.proxyConfig.split(':');
      if (parts.length === 4) {
        const config = {
          host: parts[0],
          port: parseInt(parts[1], 10),
          username: parts[2],
          password: parts[3]
        };
        
        await setProxyConfiguration(config);
        currentProxyConfig = config;
        console.log('Proxy configuration restored on startup');
      }
    }
  } catch (error) {
    console.error('Error restoring proxy on startup:', error);
  }
});

// Initialize on extension install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Proxy Manager extension installed');
});