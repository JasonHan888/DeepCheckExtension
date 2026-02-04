chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'READ_CLIPBOARD') {
        navigator.clipboard.readText().then(text => sendResponse({ text }));
        return true;
    }
});
