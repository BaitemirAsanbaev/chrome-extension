
  // Background script handles messaging between content script and popup
browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    // Forward the message to the active tab
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const activeTab = tabs[0];
      browser.tabs.sendMessage(activeTab.id, msg);
    });
  });
});
