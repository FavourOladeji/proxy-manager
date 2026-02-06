// DOM Elements
const proxyInput = document.getElementById('proxyInput');
const proxyFormat = document.getElementById('proxyFormat');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const clearBtn = document.getElementById('clearBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const errorMessage = document.getElementById('errorMessage');
const serverInfo = document.getElementById('serverInfo');
const portInfo = document.getElementById('portInfo');
const usernameInfo = document.getElementById('usernameInfo');

// Constants
const STORAGE_KEY = 'proxyConfig';
const STATUS_KEY = 'proxyStatus';
const PROXY_FORMAT_KEY = 'proxyformat'

// Utility Functions
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 5000);
}

function parseHost(host)
{
  if (!host || host.length === 0) {
    throw new Error('Invalid host address');
  }

  return host.trim();
}

function parsePort(port) {
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    throw new Error('Port must be between 1 and 65535');
  }
  return portNum;
}

function parseFormat1(proxyString) {
  const parts = proxyString.split(':');
  if (parts.length !== 4) {
    throw new Error('Invalid format. Expected: ip:port:username:password');
  }

  return {
    host: parseHost(parts[0]),
    port: parsePort(parts[1]),
    username: parts[2].trim(),
    password: parts[3].trim()
  };
}

function parseFormat2(proxyString) {
  const [hostPort, credentials] = proxyString.split('@');
  if (!hostPort || !credentials) {
    throw new Error('Invalid format. Expected: ip:port@username:password');
  }

  const [host, port] = hostPort.split(':');
  const [username, password] = credentials.split(':');
  return {
    host: parseHost(host),
    port: parsePort(port),
    username: username.trim(),
    password: password.trim()
  };
}

function parseFormat3(proxyString) {
  const parts = proxyString.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid format. Expected: ip:port');
  }

  return {
    host: parseHost(parts[0]),
    port: parsePort(parts[1]),
  };
}

function parseProxyString(proxyString, format) {
  const trimmed = proxyString.trim();
  
  if (!trimmed) {
    throw new Error('Proxy configuration cannot be empty');
  }

  switch (format) {
    case '1': // ip:port:username:passwor
      return parseFormat1(trimmed);
    case '2': // ip:port@username:password
      return parseFormat2(trimmed);
    case '3': // ip:port
      return parseFormat3(trimmed);
  }
  
}

function updateUI(isConnected, config = null) {
  if (isConnected && config) {
    statusDot.classList.add('connected');
    statusText.textContent = 'Connected';
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    
    serverInfo.textContent = config.host;
    portInfo.textContent = config.port;
    usernameInfo.textContent = config.username ?? '-';
  } else {
    statusDot.classList.remove('connected');
    statusText.textContent = 'Disconnected';
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    
    serverInfo.textContent = '-';
    portInfo.textContent = '-';
    usernameInfo.textContent = '-';
  }
}

async function loadSavedConfig() {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY, STATUS_KEY, PROXY_FORMAT_KEY]);
    
    if (result[STORAGE_KEY]) {
      proxyInput.value = result[STORAGE_KEY];
    }
  
    if (result[PROXY_FORMAT_KEY]) {
      console.log('Loaded proxy format:', result[PROXY_FORMAT_KEY]);
      proxyFormat.value = result[PROXY_FORMAT_KEY];
    }
    
    if (result[STATUS_KEY]?.isConnected) {
      const config = parseProxyString(result[STORAGE_KEY], result[PROXY_FORMAT_KEY]);
      updateUI(true, config);
    }
  } catch (error) {
    console.error('Error loading saved config:', error);
  }
}

async function connectProxy() {
  try {
    const proxyString = proxyInput.value;
    const proxyFormatValue = proxyFormat.value;
    const config = parseProxyString(proxyString, proxyFormatValue);

    // Send message to background script to set proxy
    const response = await chrome.runtime.sendMessage({
      action: 'setProxy',
      config: config
    });

    if (response.success) {
      // Save config and status
      await chrome.storage.local.set({
        [STORAGE_KEY]: proxyString,
        [STATUS_KEY]: { isConnected: true },
        [PROXY_FORMAT_KEY]: proxyFormatValue
      });

      updateUI(true, config);
    } else {
      throw new Error(response.error || 'Failed to connect proxy');
    }
  } catch (error) {
    showError(error.message);
    console.error('Connect error:', error);
  }
}

async function disconnectProxy() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'clearProxy'
    });

    if (response.success) {
      await chrome.storage.local.set({
        [STATUS_KEY]: { isConnected: false }
      });

      updateUI(false);
    } else {
      throw new Error(response.error || 'Failed to disconnect proxy');
    }
  } catch (error) {
    showError(error.message);
    console.error('Disconnect error:', error);
  }
}

async function clearSavedConfig() {
  try {
    await chrome.storage.local.remove([STORAGE_KEY, STATUS_KEY]);
    proxyInput.value = '';
    updateUI(false);
  } catch (error) {
    showError('Failed to clear saved configuration');
    console.error('Clear error:', error);
  }
}

async function updateProxyInputPlaceholder() {
  const format = proxyFormat.value;
  const hintElement = document.getElementById('proxyInputHint');
  switch (format) {
    case '1':
      proxyInput.placeholder = 'Example: 192.168.1.1:8080:user:pass';
      hintElement.textContent = 'Format: ip:port:username:password';
      break;
    case '2':
      proxyInput.placeholder = 'Example: 192.168.1.1:8080@user:pass';
      hintElement.textContent = 'Format: ip:port@username:password';
      break;
    case '3':
      proxyInput.placeholder = 'Example: 192.168.1.1:8080';
      hintElement.textContent = 'Format: ip:port';
      break;
  }
}

// Event Listeners
connectBtn.addEventListener('click', connectProxy);
disconnectBtn.addEventListener('click', disconnectProxy);
clearBtn.addEventListener('click', clearSavedConfig);
proxyFormat.addEventListener('change', updateProxyInputPlaceholder);

proxyInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    connectProxy();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadSavedConfig);