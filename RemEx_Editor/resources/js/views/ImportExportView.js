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

        this.zipFolder = new JSZip(); // eslint-disable-line
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
        
        this.uploadElement.addEventListener("change", function(event) {
            new Promise(function(resolve, reject) {
                var reader = new FileReader();
                reader.onload = function() { resolve(reader.result); };
                reader.onerror = reject;
                reader.readAsText(event.target.files[0]);
                
            }).then(function(result) {
                let controllerEvent,
                experimentData = {
                    experiment: JSON.parse(result),
                    resources: undefined,
                };


//###
                // TODO: resources = ...
//###


                controllerEvent = new ControllerEvent(Config.EVENT_EXPERIMENT_UPLOADED, experimentData);
                this.notifyAll(controllerEvent);
            }.bind(this));
        });
        this.uploadElement.click();
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
    experimentJSON = experimentJSON.replace(/"type"/g, "\"@type\"");
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