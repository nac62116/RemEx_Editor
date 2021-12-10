import Config from "../utils/Config.js";
import {Observable, Event as ControllerEvent} from "../utils/Observable.js";
import UserAgentDetector from "../utils/UserAgentDetector.js";

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

class ImportExportView extends Observable {

    init(importExportContainer) {
        this.importExportContainer = importExportContainer;
        this.downloadLinkElement = importExportContainer.querySelector("#" + Config.DOWNLOAD_LINK_ID);
        this.uploadInputElement = importExportContainer.querySelector("#" + Config.UPLOAD_INPUT_ID);
        this.saveButton = importExportContainer.querySelector("#" + Config.SAVE_EXPERIMENT_BUTTON_ID);
        this.uploadButton = importExportContainer.querySelector("#" + Config.UPLOAD_EXPERIMENT_BUTTON_ID);
        this.newButton = importExportContainer.querySelector("#" + Config.NEW_EXPERIMENT_BUTTON_ID);
        this.saveButton.addEventListener("click", onSaveExperiment.bind(this));
        this.uploadButton.addEventListener("click", onUploadExperiment.bind(this));
        this.uploadInputElement.addEventListener("click", function() {
            this.uploadInputElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }.bind(this));
        this.uploadInputElement.addEventListener("change", onUploadInputChanged.bind(this));
        this.newButton.addEventListener("click", onNewExperiment.bind(this));
        this.resources = [];
        this.zipFolder = null;
    }

    exportExperiment(experiment, nameCodeTable, resourcePromises) {
        let savingFinishedEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_SAVED, null);

        this.zipFolder = new JSZip(); // eslint-disable-line no-undef
        // Setting up download link
        this.downloadLinkElement.addEventListener("click", function onClick() {
            this.resources = [];
            this.zipFolder = null;
            this.notifyAll(savingFinishedEvent);
        }.bind(this));

        // Saving with Resources
        if (resourcePromises.length !== 0) {
            for (let resourcePromise of resourcePromises) {
                // Gathering resources out of the ModelManager promises array
                if (resourcePromises.indexOf(resourcePromise) !== resourcePromises.length - 1) {
                    resourcePromise.then(function(result) {
                        if (result !== undefined) {
                            this.resources.push(result);
                        }
                    }.bind(this));
                }
                // When the last promise is fullfilled all relevant data gets zipped and downloaded via the downloadLinkElement
                else {
                    resourcePromise.then(function(result) {
                        let addResourceResult;

                        this.resources.push(result);

                        addExperimentToZip(this, experiment);
                        addNameCodeTableToZip(this, nameCodeTable, experiment);
                        addResourceResult = addResourcesToZip(this);
                        
                        if (addResourceResult) {
                            zipFilesAndDownload(this, experiment.name);
                        }
                        else {
                            this.resources = [];
                            this.zipFolder = null;
                            this.notifyAll(savingFinishedEvent);
                        }
                    }.bind(this));
                }
            }
        }
        // Saving without resources
        else {
            addExperimentToZip(this, experiment);
            addNameCodeTableToZip(this, nameCodeTable, experiment);

            zipFilesAndDownload(this, experiment.name);
        }
    }

    showImportExperimentElement() {
        this.uploadInputElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }

    enableSaveButton() {
        this.saveButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }

    disableSaveButton() {
        this.saveButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }
}

function addExperimentToZip(that, experiment) {
    let experimentJSON;
                        
    // Gathering experiment JSON
    experimentJSON = JSON.stringify(experiment, null, 4); // eslint-disable-line
    // Declare type property as an enum for the android json library "com.fasterxml.jackson"
    experimentJSON = experimentJSON.replaceAll(/"type"/g, "\"@type\"");
    that.zipFolder.file(experiment.name + ".txt", experimentJSON);
}

function addNameCodeTableToZip(that, nameCodeTable, experiment) {
    if (nameCodeTable.length !== 0) {
        that.zipFolder.file(experiment.name + "_Code_Tabelle.txt", nameCodeTable);
    }
}

function addResourcesToZip(that) {
    let size = 0;
    // Adding all resources (Videos and images)
    for (let resource of that.resources) {
        if (resource !== undefined) {
            that.zipFolder.folder("resources").file(resource.name, resource);
            size += resource.size;
        }
    }
    if (UserAgentDetector.isEdge
        || UserAgentDetector.isChrome
        || UserAgentDetector.isOperaAboveV15) {
        if (size >= Config.MAX_ZIP_SIZE) {
            alert(Config.ZIP_TOO_LARGE);
            return false;
        }
    }
    return true;
}

function zipFilesAndDownload(that, zipFileName) {
    that.zipFolder.generateAsync({type: "blob", compression: "DEFLATE", compressionOptions: {level: 9}}, 
    function updateCallback(metaData) {
        let savingProgressEvent = new ControllerEvent(Config.EVENT_SAVING_PROGRESS, metaData);
        that.notifyAll(savingProgressEvent);
    })
    .then(function (blob) {
        that.downloadLinkElement.setAttribute("href", URL.createObjectURL(blob));
        that.downloadLinkElement.setAttribute("download", zipFileName + ".zip");
        that.downloadLinkElement.click();
    });
}

function onUploadInputChanged(event) {
    let controllerEvent,
    zipPromises = [],
    fileNames = [],
    experimentJSON,
    resourceFile,
    fileNameTypeMap = new Map(),
    fileNameBlobMap = new Map(),
    newFileName,
    type,
    experimentData = {
        experiment: undefined,
        resources: [],
        success: false,
    };

    if (!UserAgentDetector.isGeckoEngine) {
        if (event.target.files[0].size >= Config.MAX_ZIP_SIZE) {
            alert(Config.ZIP_TOO_LARGE + " (" + event.target.files[0].name + ")");
            this.uploadInputElement.value = null;
            return;
        }
    }

    controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOAD_STARTED, null);
    this.notifyAll(controllerEvent);

    new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = function() { reject(reader.result); };
        reader.readAsArrayBuffer(event.target.files[0]);
        
    }).then(function(zipFile) {
        this.zipFolder = new JSZip(); // eslint-disable-line no-undef
        this.zipFolder.loadAsync(zipFile).then(function(zip) {
            Object.keys(zip.files).forEach(function (fileName) {
                if (fileName.includes(".txt")
                    && !fileName.includes("_Code_Tabelle")) {
                        zipPromises.push(zip.files[fileName].async("string"));
                        fileNames.push(fileName);
                    }
                if (fileName.includes("resources/")
                    && !zip.files[fileName].dir) {
                        zipPromises.push(zip.files[fileName].async("blob"));
                        zipPromises.push(zip.files[fileName].async("uint8array"));
                        fileNames.push(fileName);
                        fileNames.push(fileName);
                }
            });
            Promise.all(zipPromises).then(function (fileData) {
                for (let i = 0; i < fileData.length; i++) {
                    if (typeof(fileData[i]) === "string") {
                        experimentJSON = fileData[i];
                        // JSZip escapes the " with \" and shows new lines with \n
                        // We dont want this for the JSON parser
                        experimentJSON = experimentJSON.replaceAll(/\n/g, "");
                        experimentJSON = experimentJSON.replaceAll(/\\/g, "");
                        // Type property is declared as an enum for the android json library "com.fasterxml.jackson"
                        // In this environment we need the normal property name "type":
                        experimentJSON = experimentJSON.replaceAll(/"@type"/g, "\"type\"");
                        experimentData.experiment = JSON.parse(experimentJSON);
                    }
                    else if (fileData[i] instanceof Blob) {
                        fileNameBlobMap.set(fileNames[i], fileData[i]);
                    }
                    else {
                        // MIME sniffing of byte header to prevent corrupted or not supported file load 
                        type = getMIMEType(fileData[i]);
                        fileNameTypeMap.set(fileNames[i], type);
                    }
                }
                for (let fileName of fileNameBlobMap.keys()) {
                    if (fileNameTypeMap.get(fileName) !== undefined) {
                        newFileName = fileName.split("/");
                        newFileName = newFileName[newFileName.length - 1];
                        resourceFile = new File([fileNameBlobMap.get(fileName)], newFileName, {type: fileNameTypeMap.get(fileName)});
                        experimentData.resources.push(resourceFile);
                    }
                    else {
                        alert(Config.FILE_TYPE_INSIDE_ZIP_NOT_SUPPORTED + "(" + fileName + ")");
                    }
                }
                fileNameBlobMap = null;
                experimentData.success = true;
                this.uploadInputElement.value = null;
                controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
                this.notifyAll(controllerEvent);
            }.bind(this),
            function (error) {
                alert(Config.READ_ZIP_ALERT + "\n" + error);
                this.uploadInputElement.value = null;
                controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
                this.notifyAll(controllerEvent);
            }.bind(this));
        }.bind(this),
        function (error) {
            alert(Config.READ_ZIP_ALERT + "\n" + error);
            this.uploadInputElement.value = null;
            controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
            this.notifyAll(controllerEvent);
        }.bind(this));
    }.bind(this),
    function (error) {
        alert(Config.READ_ZIP_ALERT + "\n" + error);
        this.uploadInputElement.value = null;
        controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
        this.notifyAll(controllerEvent);
    }.bind(this));
}

function getMIMEType(fileData) {
    let shortHeader = "",
    midHeader = "",
    longHeader = "",
    longHeaderWithOffset = "",
    type;

    for (let i = 0; i < Config.MIME_SNIFFING_HEADER_LENGTH_IN_BYTES; i++) {
        if (i < 2) { // eslint-disable-line no-magic-numbers
            shortHeader += "" + fileData[i];
        }
        if (i < 3) { // eslint-disable-line no-magic-numbers
            midHeader += "" + fileData[i];
        }
        if (i < 4) { // eslint-disable-line no-magic-numbers
            longHeader += "" + fileData[i];
        }
        if (i >= 4 && i < 8) { // eslint-disable-line no-magic-numbers
            longHeaderWithOffset += "" + fileData[i];
        }
    }

    switch (shortHeader) {
        case "6677":
            type = "image/bmp";
            return type;
        
        default:
            break;
    }
    switch (midHeader) {
        case "255216255":
            type = "image/jpeg";
            return type;
        
        default:
            break;
    }
    switch (longHeader) {
        case "137807871":
            type = "image/png";
            return type;

        case "2669223163":
            type = "video/webm";
            return type;

        case "71737056":
            type = "image/gif";
            return type;
        
        default:
            break;
    }
    switch (longHeaderWithOffset) {
        case "102116121112":
            type = "video/mp4";
            return type;

        default:
            break;
    }
    return type;
}

function onSaveExperiment() {
    let controllerEvent = new ControllerEvent(Config.EVENT_SAVE_EXPERIMENT, null);
    this.notifyAll(controllerEvent);
}

function onUploadExperiment() {
    if (confirm(Config.LOAD_EXPERIMENT_ALERT)) {
        this.uploadInputElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }
}

function onNewExperiment() {
    let controllerEvent = new ControllerEvent(Config.EVENT_NEW_EXPERIMENT, null);
    this.notifyAll(controllerEvent);
}

export default new ImportExportView();