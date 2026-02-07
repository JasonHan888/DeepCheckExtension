document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('toggle-switch');
    const statusText = document.getElementById('status-text');
    const body = document.body;

    // Load persisted state
    const { isDeepCheckEnabled } = await chrome.storage.local.get('isDeepCheckEnabled');

    // Default to enabled if not set
    const enabled = isDeepCheckEnabled !== false;
    toggle.checked = enabled;
    applyUIState(enabled);

    // Toggle logic
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ isDeepCheckEnabled: isEnabled });
        applyUIState(isEnabled);
    });

    function applyUIState(enabled) {
        const footerStatus = document.getElementById('footer-status');
        if (enabled) {
            statusText.textContent = "PROTECTION ENABLE";
            statusText.style.color = "#10b981"; // Green
            if (footerStatus) {
                footerStatus.textContent = "ONLINE";
                footerStatus.style.color = "#10b981";
            }
            body.classList.remove('disabled-mode');
        } else {
            statusText.textContent = "PROTECTION DISABLE";
            statusText.style.color = "#ef4444"; // Red
            if (footerStatus) {
                footerStatus.textContent = "OFFLINE";
                footerStatus.style.color = "#ef4444";
            }
            body.classList.add('disabled-mode');
        }
    }
});
