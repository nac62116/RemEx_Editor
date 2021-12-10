/*
MIT License

Copyright (c) 2021 Colin Nash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const DATABASE_NAME = "ExperimentResourcesDB";

class IndexedDB {

    addResource(resource) {
        let db = openDatabase(),
        request;

        return new Promise(function(resolve, reject) {
            db.then(function(result) {
                if (typeof(result) === "string" || result === undefined) {
                    reject(result);
                }
                else {
                    try {
                        request = result.transaction(["resources"], "readwrite")
                                .objectStore("resources")
                                .add(resource, resource.name);
                
                        request.onsuccess = function() {
                            resolve();
                        };
                        request.onerror = function(event) {
                            reject(event.target.error);
                        };
                    }
                    catch (error) {
                        reject(error);
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
            if (typeof(result) !== "string") {
                //console.log(result);
            }
            else {
                request = result.transaction(["resources"], "readwrite")
                        .objectStore("resources")
                        .delete(fileName);
        
                request.onsuccess = function() {
                    //console.log("Resource deleted");
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
                    //console.log(result);
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
                        };
                    });
                }
                return promise;
            });
            return promise;
        }
        return undefined;
    }

    // TODO: Handle errors like above
    clearDatabase() {
        let db = openDatabase(),
        request;

        db.then(function(result) {
            if (typeof(result) === "string" || result === undefined) {
                //console.log(result);
            }
            else {
                request = result.transaction(["resources"], "readwrite")
                        .objectStore("resources")
                        .clear();
        
                request.onsuccess = function() {
                    //console.log("Database cleared");
                };
            }
        });
    }
}

function openDatabase() {
    return new Promise(function(resolve, reject) {
        let request = indexedDB.open(DATABASE_NAME, 3);
        request.onerror = function(event) {
            reject(event.target.errorCode);
        };
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onupgradeneeded = function(event) {
            let db = event.target.result,
            transaction = event.target.transaction;
            
            db.createObjectStore("resources");
            transaction.oncomplete = function(event) {    
                resolve(event.target.result);
            };
        };
    });
}

export default new IndexedDB();