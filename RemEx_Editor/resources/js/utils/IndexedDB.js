const DATABASE_NAME = "ExperimentResourcesDB";

class IndexedDB {

    addResource(encodedResource) {
        let db = openDatabase(),
        transaction,
        objectStore,
        request;

        db.then(function(result) {
            if (typeof(result) === "string") {
                console.log(result);
            }
            else {
                transaction = result.transaction(["resources"], "readwrite");
                transaction.oncomplete = function() {
                    console.log("Resource added");
                };
                
                transaction.onerror = function(event) {
                    console.log("Datenbankfehler: " + event.target.errorCode);
                };
                
                objectStore = transaction.objectStore("resources");
                request = objectStore.add(encodedResource);
                request.onsuccess = function(event) {
                    console.log("Add request suceeded");
                };
            }
        });
    }

    deleteResource(fileName) {
        let db = openDatabase(),
        request;

        db.then(function(result) {
            if (typeof(result) === "string") {
                console.log(result);
            }
            else {
                request = result.transaction(["resources"], "readwrite")
                        .objectStore("resources")
                        .delete(fileName);
        
                request.onsuccess = function() {
                    console.log("Resource deleted");
                };
            }
        });
    }

    getResource(fileName) {
        let db = openDatabase(),
        transaction,
        objectStore,
        request,
        promise;

        return db.then(function(result) {
            if (typeof(result) === "string") {
                console.log(result);
            }
            else {
                transaction = result.transaction(["resources"]);
                objectStore = transaction.objectStore("resources");
                promise = new Promise(function(resolve, reject) {
                    request = objectStore.get(fileName);
                    request.onerror = function(event) {
                        reject(event.target.errorCode);
                    };
                    request.onsuccess = function() {
                        resolve(request.result);
                    };
                });
            }
            return promise;
        });

    }
}

function openDatabase() {
    return new Promise(function(resolve, reject) {
        let request = indexedDB.open(DATABASE_NAME);
        request.onerror = function(event) {
            reject(event.target.errorCode);
        };
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onupgradeneeded = function(event) {
            let db = event.target.result,
            store = db.createObjectStore("resources", {keyPath:"fileName"}),
            transaction = event.target.transaction;

            transaction.oncomplete = function(event) {    
                    resolve(event.target.result);
            };
        };
    });
}

export default new IndexedDB();