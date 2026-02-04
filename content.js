// --- 1. THE "INSTANT" SENSORS ---
const IGNORED_TAGS = ['INPUT', 'TEXTAREA'];

// Helper: Check state before scanning
async function shouldScan() {
    try {
        const { isDeepCheckEnabled } = await chrome.storage.local.get('isDeepCheckEnabled');
        return isDeepCheckEnabled !== false;
    } catch (e) { return true; } // Fail safe to enabled if error
}

// Detect Right-Click (Triggers BEFORE context menu shows)
document.addEventListener('contextmenu', async (e) => {
    if (IGNORED_TAGS.includes(e.target.tagName)) return;
    if (!(await shouldScan())) return;

    const url = e.target.closest('a')?.href || window.getSelection().toString().trim();
    if (isUrl(url)) triggerScan(url);
});

// Detect Ctrl+C (Copy) and Ctrl+V (Paste)
document.addEventListener('keydown', async (e) => {
    const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
    const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';

    if (isCopy || isPaste) {
        if (!(await shouldScan())) return;

        setTimeout(() => {
            const url = window.getSelection().toString().trim();
            if (isUrl(url)) triggerScan(url);
        }, 50);
    }
});

function isUrl(str) { return str && (str.startsWith('http') || str.startsWith('www')); }

function triggerScan(url) {
    try {
        if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.id) return;
        chrome.runtime.sendMessage({ action: "SCAN_ACTION", url: url }).catch(() => { });
    } catch (e) {
        // Context invalidated, silently fail
    }
}

// --- 2. THE WARNING UI (Shadow DOM) ---
try {
    chrome.runtime.onMessage.addListener((msg) => {
        try {
            if (msg.action === "SHOW_WARNING") {
                if (window.top !== window.self) return; // Prevent double popups in iframes
                injectShadowPopup(msg.url, msg.reason);
            }
        } catch (e) { }
    });
} catch (e) { }

function injectShadowPopup(url, reason) {
    if (document.getElementById('dc-guardian-root')) return;

    const host = document.createElement('div');
    host.id = 'dc-guardian-root';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'closed' });
    const container = document.createElement('div');

    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            .card {
                position: fixed; top: 20px; right: 20px; z-index: 2147483647;
                background: #ffffff; color: #1e293b;
                padding: 24px; border-radius: 16px;
                border: 1px solid #e2e8f0; width: 320px; font-family: 'Inter', sans-serif;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                animation: slide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                border-top: 4px solid #ef4444;
            }
            .header-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
            .brand { 
                font-size: 14px; font-weight: 800; 
                background: linear-gradient(135deg, #0288d1 0%, #00bcd4 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                letter-spacing: -0.3px;
            }
            .title { color: #ef4444; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .url-container { margin-bottom: 16px; }
            .url { 
                background: #f8fafc; padding: 12px; font-size: 11px; word-break: break-all; 
                border-radius: 8px; border: 1px solid #e2e8f0; color: #64748b; font-family: monospace; 
                line-height: 1.4;
            }
            .reason { color: #1e293b; font-weight: 600; margin-bottom: 24px; font-size: 13px; line-height: 1.5; display: flex; align-items: flex-start; gap: 8px; }
            .reason-label { color: #ef4444; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; display: block; }
            button { 
                width: 100%; background: #ef4444; border: none; color: white; padding: 14px; 
                border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 13px; 
                transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; 
                box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
            }
            button:hover { background: #dc2626; transform: translateY(-1px); box-shadow: 0 6px 10px -1px rgba(239, 68, 68, 0.3); }
            @keyframes slide { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        </style>
        <div class="card">
            <div class="header-info">
                <div class="brand">DeepCheck</div>
                <div class="title">Security Warning</div>
            </div>
            
            <span class="reason-label">Suspicious Link Detected</span>
            <div class="url-container">
                <div class="url">${url}</div>
            </div>

            <div>
                <span class="reason-label">Threat Reason</span>
                <div class="reason">⚠️ ${reason}</div>
            </div>
            <button id="close-dc">Dismiss Warning</button>
        </div>
    `;

    shadow.appendChild(container);
    shadow.getElementById('close-dc').onclick = () => host.remove();
}
