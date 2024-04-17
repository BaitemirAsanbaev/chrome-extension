// Background script handles messaging between content script and popup
chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
      // Forward the message to the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, msg);
      });
    });
  });
  