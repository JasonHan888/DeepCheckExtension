document.addEventListener('DOMContentLoaded', () => {
    // History trap removed - blocked page now opens in a fresh tab with no history

    // 1. Get URL parameters (passed from background.js)
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    const reason = params.get('reason');
    const type = params.get('type') || "Malicious";

    // 2. Display them on the screen
    if (url) document.getElementById('blocked-url').textContent = url;
    if (type) document.getElementById('blocked-type').textContent = type;
    if (reason) {
        let cleanReason = reason.replace(/^Heuristic:\s*/i, "");
        document.getElementById('blocked-reason').textContent = cleanReason;
    }

    // 3. Handle Countdown and Auto-Close (Persists across refresh)
    const btn = document.getElementById('back-btn');
    const TIMER_KEY = 'deepcheck_timer_start';
    const TIMER_DURATION = 10; // seconds

    // Get or set the start time
    let startTime = sessionStorage.getItem(TIMER_KEY);
    if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem(TIMER_KEY, startTime);
    } else {
        startTime = parseInt(startTime, 10);
    }

    const getTimeLeft = () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        return Math.max(0, TIMER_DURATION - elapsed);
    };

    const closeTab = () => {
        sessionStorage.removeItem(TIMER_KEY); // Clean up
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.getCurrent) {
            chrome.tabs.getCurrent((tab) => {
                if (tab) chrome.tabs.remove(tab.id);
                else window.close();
            });
        } else {
            window.close();
        }
    };

    const updateTimer = () => {
        const timeLeft = getTimeLeft();
        if (btn) {
            btn.textContent = `Closing Tab in ${timeLeft}s...`;
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            closeTab();
        }
    };

    // If already expired on load (user refreshed after timer ended), close immediately
    if (getTimeLeft() <= 0) {
        closeTab();
    } else {
        updateTimer();
        var timerInterval = setInterval(updateTimer, 1000);

        // 4. Manual Close (Immediate)
        if (btn) {
            btn.addEventListener('click', () => {
                clearInterval(timerInterval);
                closeTab();
            });
        }
    }
});
