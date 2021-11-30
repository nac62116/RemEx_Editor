import Config from "../utils/Config.js";
import {Observable, Event as ControllerEvent} from "../utils/Observable.js";

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
                        this.resources.push(result);
                    }.bind(this));
                }
                // When the last promise is fullfilled all relevant data gets zipped and downloaded via the downloadLinkElement
                else {
                    resourcePromise.then(function(result) {

                        this.resources.push(result);

                        addExperimentToZip(this, experiment);
                        addNameCodeTableToZip(this, nameCodeTable, experiment);
                        addResourcesToZip(this);
                        
                        zipFilesAndDownload(this, experiment.name);
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

    importExperiment() {
        let controllerEvent,
        zipPromises = [],
        fileNames = [],
        experimentJSON,
        resourceFile,
        fileNameTypeMap = new Map(),
        fileNameBlobMap = new Map(),
        type,
        experimentData = {
            experiment: undefined,
            resources: [],
            success: false,
        };
        
        this.uploadInputElement.addEventListener("change", function(event) {
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
                                zipPromises.push(zip.files[fileName].async("array"));
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
                                // MIME sniffing of byte header to prevent corrupted file load 
                                type = getMIMEType(fileData[i]);
                                fileNameTypeMap.set(fileNames[i], type);
                            }
                        }
                        for (let fileName of fileNameBlobMap.keys()) {
                            if (fileNameTypeMap.get(fileName) !== undefined) {
                                resourceFile = new File([fileNameBlobMap.get(fileName)], fileName.replace("resources/", ""), {type: fileNameTypeMap.get(fileName)});
                                experimentData.resources.push(resourceFile);
                            }
                            else {
                                alert(Config.FILE_TYPE_INSIDE_ZIP_NOT_SUPPORTED + "(" + fileName + ")");
                            }
                        }
                        experimentData.success = true;
                        controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
                        this.notifyAll(controllerEvent);
                    }.bind(this),
                    function (error) {
                        alert(Config.READ_ZIP_ALERT + "\n" + error);
                        controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
                        this.notifyAll(controllerEvent);
                    }.bind(this));
                }.bind(this),
                function (error) {
                    alert(Config.READ_ZIP_ALERT + "\n" + error);
                    controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
                    this.notifyAll(controllerEvent);
                }.bind(this));
            }.bind(this),
            function (error) {
                alert(Config.READ_ZIP_ALERT + "\n" + error);
                controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
                this.notifyAll(controllerEvent);
            }.bind(this));
        }.bind(this));
        this.uploadInputElement.click();
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
    // Adding all resources (Videos and images)
    for (let resource of that.resources) {
        that.zipFolder.folder("resources").file(resource.name, resource);
    }
}

function zipFilesAndDownload(that, zipFileName) {
    // Zipping all files
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

function getMIMEType(fileData) {
    let shortestHeader = "",
    shortHeader = "",
    midHeader = "",
    midHeaderWithOffset = "",
    longHeader = "",
    longHeaderWithOffset = "",
    type;

    for (let i = 0; i < Config.MIME_SNIFFING_HEADER_LENGTH_IN_BYTES; i++) {
        if (i < 2) {
            shortestHeader += "" + fileData[i];
        }
        if (i < 4) {
            shortHeader += "" + fileData[i];
        }
        if (i < 6) {
            midHeader += "" + fileData[i];
        }
        if (i < 8) {
            longHeader += "" + fileData[i];
        }
        if (i >= 4 && i < 10) {
            midHeaderWithOffset += "" + fileData[i];
        }
        if (i >= 4) {
            longHeaderWithOffset += "" + fileData[i];
        }
    }

    switch (shortestHeader) {
        case "6677":
            type = "image/bmp";
            break;
        
        default:
            break;
    }
    switch (shortHeader) {
        case "2669223163":
            type = "video/webm";
            break;
        
        case "255216255219":
        case "255216255238":
            type = "image/jpeg";
            break;
        
        default:
            break;
    }
    switch (midHeader) {
        case "717370565597":
        case "717370565797":
            type = "image/gif";
            break;
        
        default:
            break;
    }
    switch (midHeaderWithOffset) {
        case "10211612111251103":
            type = "video/3gpp";
            break;
        
        default:
            break;
    }
    switch (longHeader) {
        case "2552162552240167470":
            type = "image/jpeg";
            break;

        case "13780787113102610":
            type = "image/png";
            break;
        
        default:
            break;
    }
    switch (longHeaderWithOffset) {
        case "102116121112105115111109":
            type = "video/mp4";
            break;

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
    let controllerEvent = new ControllerEvent(Config.EVENT_UPLOAD_EXPERIMENT, null);
    this.notifyAll(controllerEvent);
}

function onNewExperiment() {
    let controllerEvent = new ControllerEvent(Config.EVENT_NEW_EXPERIMENT, null);
    this.notifyAll(controllerEvent);
}

export default new ImportExportView();