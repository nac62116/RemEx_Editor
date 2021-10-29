const DATABASE_NAME = "ExperimentResourcesDB";

class IndexedDB {

    addResource(encodedResource) {
        let db = openDatabase(),
        request;

        return new Promise(function(resolve, reject) {
            db.then(function(result) {
                if (typeof(result) === "string") {
                    reject(result);
                }
                else {
                    try {
                        request = result.transaction(["resources"], "readwrite")
                                .objectStore("resources")
                                .add(encodedResource);
                
                        request.onsuccess = function() {
                            resolve(true);
                        };
                        request.onerror = function(event) {
                            reject(event.target.error);
                        };
                    }
                    catch (error) {
                        //reject(error);
                    }
                }
            });
        });
    }

    // TODO: Handle errors like above
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

    // TODO: Handle errors like above
    getResource(fileName) {
        let db = openDatabase(),
        request,
        promise;

        if (fileName !== null) {
            promise = db.then(function(result) {
                if (typeof(result) === "string" || result === undefined) {
                    console.log(result);
                }
                else {
                    promise = new Promise(function(resolve, reject) {
                        request = result.transaction(["resources"])
                                .objectStore("resources")
                                .get(fileName);
                        request.onerror = function(event) {
                            reject(event.target.errorCode);
                        };
                        request.onsuccess = function() {
                            resolve(request.result);
                            console.log("Resource fetched");
                        };
                    });
                }
                return promise;
            });
            return promise;
        }
        return null;
    }

    // TODO: Handle errors like above
    clearDatabase() {
        let db = openDatabase(),
        request;

        db.then(function(result) {
            if (typeof(result) === "string" || result === undefined) {
                console.log(result);
            }
            else {
                request = result.transaction(["resources"], "readwrite")
                        .objectStore("resources")
                        .clear();
        
                request.onsuccess = function() {
                    console.log("Database cleared");
                };
            }
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
            transaction = event.target.transaction;
            
            db.createObjectStore("resources", {keyPath:"fileName"});
            transaction.oncomplete = function(event) {    
                    resolve(event.target.result);
            };
        };
    });
}

export default new IndexedDB();