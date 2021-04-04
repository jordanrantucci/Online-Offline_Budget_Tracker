const { response } = require("express");

let db;

const request = indexedDB.open("budget", 1)

request.onsuccess = event => {
    const db = event.target.result;
    console.log(request.result)
    db.createObjectStore("pending", { autoIncrement: true })
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase()
    }
};

request.onerror = function(event) {
    console.log("Error " + event.target.errorCode);
}

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    store.add(record)
}

function checkDatabase() {
    const transaction = db.transaction(["pending", "readwrite"]);
    const store = transaction.objectStore("pending")
    const getAll = store.getAll()
    
    getAll.onsuccess = function() {
        if (getAll.results.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        };
    }
}

window.addEventListener("online", checkDatabase);