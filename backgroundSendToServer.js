chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchFB") {
        fetch(request.url, { credentials: 'include' })
            .then(response => response.text())
            .then(text => sendResponse({ data: text }))
            .catch(err => sendResponse({ error: err.message }));
        return true; 
    }
});
