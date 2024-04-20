document.getElementById('save').addEventListener('click', () => {
    const domain = document.getElementById('domain').value;
    const selector = document.getElementById('selector').value;
    const value = document.getElementById('value').value;

    chrome.storage.local.get('autofillData', (data) => {
        const newData = data.autofillData || {};
        if (!newData[domain]) {
            newData[domain] = [];
        }
        newData[domain].push({ selector, value });
        chrome.storage.local.set({autofillData: newData}, () => {
            showEntries(newData);
        });
    });
});

function showEntries(data) {
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = '';
    Object.keys(data).forEach(domain => {
        const domainData = data[domain];
        domainData.forEach((item, index) => {
            const entry = document.createElement('div');
            entry.className = 'entry';
            entry.textContent = `Domain: ${domain}, Selector: ${item.selector}, Value: ${item.value}`;
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function() {
                editEntry(domain, index);
            };
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                deleteEntry(domain, index);
            };
            entry.appendChild(editButton);
            entry.appendChild(deleteButton);
            entriesDiv.appendChild(entry);
        });
    });
}

function deleteEntry(domain, index) {
    chrome.storage.local.get('autofillData', (data) => {
        let newData = data.autofillData;
        newData[domain].splice(index, 1);
        if (newData[domain].length === 0) {
            delete newData[domain];
        }
        chrome.storage.local.set({autofillData: newData}, () => {
            showEntries(newData);
        });
    });
}

function editEntry(domain, index) {
    chrome.storage.local.get('autofillData', (data) => {
        let newData = data.autofillData;
        document.getElementById('domain').value = domain;
        document.getElementById('selector').value = newData[domain][index].selector;
        document.getElementById('value').value = newData[domain][index].value;
        deleteEntry(domain, index); // Remove the old entry, assuming it will be added again
    });
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('autofillData', (data) => {
        showEntries(data.autofillData || {});
    });
});
