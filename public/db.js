let db;

const request = indexedDB.open("budget", 1)

request.onsuccess = event => {
    const db = event.target.result;
    console.log(request.result)
    db.createObjectStore("pending", { autoIncrement: true })
};


window.addEventListener("online", checkDatabase);