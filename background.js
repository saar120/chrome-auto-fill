chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['autofillData'], (result) => {
        if (!result.autofillData) {
            chrome.storage.local.set({ autofillData: {} });
        }
    });
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.storage.local.get('autofillData', (data) => {
            try {
                if (!tab.url) {
                    return;
                }
                const url = new URL(tab.url);
                const domains = Object.keys(data.autofillData);
                const key = domains.find((d) => url.hostname.includes(d));
                if (!key) {
                    return;
                }
                const domainData = data.autofillData[key];
                if (domainData) {
                    domainData.forEach(item => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabId },
                            function: fillField,
                            args: [item.selector, item.value]
                        });
                    });
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
});

function fillField(selector, value) {
    const field = document.querySelector(selector);
    if (field) {
        field.value = value;
    }
}
