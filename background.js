const HF_BASE_URL = "https://jasonhan888-my-url-scanner.hf.space";
const THREAT_CACHE = new Map();
const MASTER_WHITELIST = ["google.com", "huggingface.co", "facebook.com", "maybank2u.com.my", "gemini.google.com", "openai.com"];

// Global Protection State (Default to true)
let isProtectionEnabled = true;
let isBlockScreenEnabled = true;

// 0. INITIALIZATION & STATE MANAGEMENT
function updateState() {
    chrome.storage.local.get(["isDeepCheckEnabled", "isBlockScreenEnabled"], (result) => {
        // If undefined, default to true. Otherwise use the stored value.
        isProtectionEnabled = result.isDeepCheckEnabled !== false;
        isBlockScreenEnabled = result.isBlockScreenEnabled !== false;

        console.log("DeepCheck Policy:", {
            protection: isProtectionEnabled ? "ENABLED" : "DISABLED",
            blockScreen: isBlockScreenEnabled ? "ENABLED" : "DISABLED"
        });

        // Update badge to reflect state visually
        if (isProtectionEnabled) {
            chrome.action.setBadgeText({ text: "ON" });
            chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
        } else {
            chrome.action.setBadgeText({ text: "OFF" });
            chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
        }
    });
}

// Initialize on startup
updateState();

// Listen for changes from the popup
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && (changes.isDeepCheckEnabled || changes.isBlockScreenEnabled)) {
        updateState();
    }
});


// --- 1. DOWNLOAD KILLER (The Fix for Downloads) ---
chrome.downloads.onCreated.addListener(async (downloadItem) => {
    if (!isProtectionEnabled) return; // Feature Guard

    const url = downloadItem.finalUrl || downloadItem.url;
    if (MASTER_WHITELIST.some(d => url.includes(d))) return;

    // Check Cache first for speed
    if (THREAT_CACHE.has(url)) {
        chrome.downloads.cancel(downloadItem.id);
        chrome.downloads.erase({ id: downloadItem.id });
        return;
    }

    // DeepScan the download link
    const result = await analyzeLinkLogic(url);
    if (result && result.is_malicious) {
        chrome.downloads.cancel(downloadItem.id);
        chrome.downloads.erase({ id: downloadItem.id });
        showSystemNotification("Malware Blocked", `DeepCheck stopped a malicious download: ${result.method}`);
    }
});

// --- 2. AUTOMATIC NAVIGATION BLOCKER (Address Bar/Search) ---
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (!isProtectionEnabled) return; // Feature Guard

    if (details.frameId !== 0 || !details.url.startsWith('http')) return;
    const url = details.url;

    if (MASTER_WHITELIST.some(d => url.includes(d))) return;

    if (THREAT_CACHE.has(url)) {
        blockNavigation(details.tabId, url, THREAT_CACHE.get(url));
    } else {
        // Scan in background so it's ready if they visit again
        analyzeLinkLogic(url, details.tabId);
    }
});

// --- 3. CORE ANALYSIS ENGINE ---
async function analyzeLinkLogic(url, tabId = null) {
    if (!isProtectionEnabled) return null; // Logic Guard

    try {
        const API = `${HF_BASE_URL}/gradio_api/call/predict`;
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [url] })
        });
        const { event_id } = await res.json();

        if (event_id) {
            const resultRes = await fetch(`${API}/${event_id}`);
            const reader = resultRes.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                if (chunk.includes('data: ')) {
                    const data = JSON.parse(chunk.split('data: ')[1])[0];
                    if (data.is_malicious) {
                        const reason = data.method || "Malicious Threat";
                        THREAT_CACHE.set(url, reason);
                        if (tabId) {
                            chrome.tabs.sendMessage(tabId, { action: "SHOW_WARNING", url, reason }).catch(() => { });
                            setTimeout(() => blockNavigation(tabId, url, reason), 500);
                        }
                        return data;
                    }
                    await reader.cancel();
                    break;
                }
            }
        }
    } catch (e) { console.error("Scanner Offline"); }
    return null;
}

function blockNavigation(tabId, url, reason, type = "Malicious") {
    // Double check state before taking disruptive action
    if (!isProtectionEnabled) return;

    // Check if user wants to see the block screen
    if (isBlockScreenEnabled) {
        const page = chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(url)}&reason=${encodeURIComponent(reason)}&type=${encodeURIComponent(type)}`);

        // Close the malicious tab FIRST, then open blocked page in a NEW tab
        // This ensures the new tab has NO history to go back to
        chrome.tabs.remove(tabId).then(() => {
            chrome.tabs.create({ url: page });
        }).catch(() => {
            // If remove fails, still try to create the blocked page
            chrome.tabs.create({ url: page });
        });
    } else {
        // SILENT BLOCK MODE
        // Just close the tab preventing access, but show a notification so they know why
        chrome.tabs.remove(tabId).catch(() => { });
        showSystemNotification("Malicious Site Blocked", `DeepCheck blocked a threat: ${reason}`);
    }
}

function showSystemNotification(title, msg) {
    if (!isProtectionEnabled) return;
    chrome.notifications.create({ type: "basic", iconUrl: "icons/icon128.png", title: title, message: msg });
}

chrome.runtime.onMessage.addListener((req, sender) => {
    if (!isProtectionEnabled) return; // Feature Guard

    const tabId = sender?.tab?.id;
    if (tabId && req.action === "SCAN_ACTION") analyzeLinkLogic(req.url, tabId);
});
