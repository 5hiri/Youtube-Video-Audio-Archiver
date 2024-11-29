// options.js

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

// Save the directory handle
async function saveDirectoryHandle(directoryHandle) {
    const db = await openDatabase();
    const tx = db.transaction('directories', 'readwrite');
    const store = tx.objectStore('directories');
    store.put(directoryHandle, 'archiveLocation');
    return tx.complete;
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

// Event listener for the button
document.getElementById('setLocation').addEventListener('click', async () => {
    try {
        const directoryHandle = await window.showDirectoryPicker();
        await saveDirectoryHandle(directoryHandle);
        document.getElementById('archiveLocation').textContent = directoryHandle.name;
    } catch (err) {
        console.error(err);
    }
});

// Display the stored folder name when the options page is opened
getDirectoryHandle()
    .then((directoryHandle) => {
        if (directoryHandle) {
            document.getElementById('archiveLocation').textContent = directoryHandle.name;
        }
    })
    .catch((err) => {
        console.error(err);
    });
