// Open the options page when the button is clicked
document.getElementById('openOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage(() => {
        if (chrome.runtime.lastError) {
            console.error('Error opening options page:', chrome.runtime.lastError.message);
        } else {
            console.log('Options page opened successfully.');
        }
    });
});

// Open the database (same as before)
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('directoryDB', 1);
        request.onerror = () => {
            reject('Database failed to open');
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('directories');
        };
    });
}

// Get the directory handle
async function getDirectoryHandle() {
    const db = await openDatabase();
    const tx = db.transaction('directories', 'readonly');
    const store = tx.objectStore('directories');
    const request = store.get('archiveLocation');
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Failed to get directory handle');
    });
}

// Display the stored folder name when the popup is opened
getDirectoryHandle()
    .then((directoryHandle) => {
        if (directoryHandle) {
            document.getElementById('archiveLocation').textContent = directoryHandle.name;
        }
    })
    .catch((err) => {
        console.error(err);
    });
