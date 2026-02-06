document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const toggle = document.getElementById('toggle-switch');
    const blockScreenToggle = document.getElementById('toggle-block-screen');
    const statusText = document.getElementById('status-text');
    const footerStatus = document.getElementById('footer-status');
    const body = document.body;

    // View Elements
    const settingsBtn = document.getElementById('settings-btn');
    const backBtn = document.getElementById('back-btn');
    const mainView = document.getElementById('main-view');
    const settingsView = document.getElementById('settings-view');

    // Load persisted state
    const { isDeepCheckEnabled, isBlockScreenEnabled } = await chrome.storage.local.get(['isDeepCheckEnabled', 'isBlockScreenEnabled']);

    // Initialize State
    const enabled = isDeepCheckEnabled !== false;
    toggle.checked = enabled;

    const blockScreenEnabled = isBlockScreenEnabled !== false;
    blockScreenToggle.checked = blockScreenEnabled;

    applyUIState(enabled);

    // --- Core Logic ---

    // Main Protection Toggle
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.local.set({ isDeepCheckEnabled: isEnabled });
        applyUIState(isEnabled);
    });

    // Block Screen Toggle
    blockScreenToggle.addEventListener('change', () => {
        const isEnabled = blockScreenToggle.checked;
        chrome.storage.local.set({ isBlockScreenEnabled: isEnabled });
    });

    // --- UX / View Switching ---

    settingsBtn.addEventListener('click', () => {
        mainView.classList.add('hidden');
        settingsView.classList.remove('hidden');
    });

    backBtn.addEventListener('click', () => {
        settingsView.classList.add('hidden');
        mainView.classList.remove('hidden');
    });

    function applyUIState(enabled) {
        if (enabled) {
            statusText.innerHTML = "Protection is <strong>ON</strong>";
            if (footerStatus) {
                footerStatus.textContent = "ONLINE";
            }
            body.classList.remove('disabled-mode');
            blockScreenToggle.disabled = false;
        } else {
            statusText.innerHTML = "Protection is <strong>OFF</strong>";
            if (footerStatus) {
                footerStatus.textContent = "OFFLINE";
            }
            body.classList.add('disabled-mode');
            blockScreenToggle.disabled = true;
        }
    }
});
