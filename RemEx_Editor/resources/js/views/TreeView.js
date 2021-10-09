import Config from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";

class TreeView extends Observable {

    init(treeViewContainer) {
        this.treeViewContainer = treeViewContainer;
        this.treeViewElement = treeViewContainer.querySelector("#" + Config.TREE_VIEW_ID);
        this.importExportContainer = treeViewContainer.querySelector("#" + Config.IMPORT_EXPORT_CONTAINER_ID);
        this.saveButton = this.importExportContainer.querySelector("#" + Config.SAVE_EXPERIMENT_BUTTON_ID);
        this.loadButton = this.importExportContainer.querySelector("#" + Config.LOAD_EXPERIMENT_BUTTON_ID);
        this.newButton = this.importExportContainer.querySelector("#" + Config.NEW_EXPERIMENT_BUTTON_ID);
        this.saveButton.addEventListener("click", onSaveButtonClicked.bind(this));
        this.loadButton.addEventListener("click", onLoadButtonClicked.bind(this));
        this.newButton.addEventListener("click", onNewButtonClicked.bind(this));
        this.currentFocusedNode = undefined;
    }

    getCenter() {
        let center = {
            x: this.treeViewElement.clientWidth / 2, // eslint-disable-line no-magic-numbers
            y: this.treeViewElement.clientHeight / 2, // eslint-disable-line no-magic-numbers
        };
        return center;
    }

    getWidth() {
        return this.treeViewElement.clientWidth;
    }

    getHeight() {
        return this.treeViewElement.clientHeight;
    }

    hideImportExportButtons() {
        this.importExportContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }
    
    showImportExportButtons() {
        this.importExportContainer.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }

    insertNode(node) {
        for (let nodeKey in node.nodeElements) {
            if (Object.prototype.hasOwnProperty.call(node.nodeElements, nodeKey)) {
                if (nodeKey !== "timelineElements") {
                    this.treeViewElement.appendChild(node.nodeElements[nodeKey]);
                }
                else {
                    for (let timelineKey in node.nodeElements.timelineElements) {
                        if (Object.prototype.hasOwnProperty.call(node.nodeElements.timelineElements, timelineKey)) {
                            if (timelineKey !== "labels") {
                                this.treeViewElement.appendChild(node.nodeElements.timelineElements[timelineKey]);
                            }
                        }
                    }
                }
            }
        }
    }

    removeNode(node) {
        for (let nodeKey in node.nodeElements) {
            if (Object.prototype.hasOwnProperty.call(node.nodeElements, nodeKey)) {
                if (nodeKey !== "timelineElements") {
                    node.nodeElements[nodeKey].remove();
                }
                else {
                    for (let timelineKey in node.nodeElements.timelineElements) {
                        if (Object.prototype.hasOwnProperty.call(node.nodeElements.timelineElements, timelineKey)) {
                            if (timelineKey !== "labels") {
                                node.nodeElements.timelineElements[timelineKey].remove();
                            }
                        }
                    }
                }
            }
        }
        removeChildNodes(node);
    }

}

function removeChildNodes(node) {
    if (node.childNodes === undefined || node.childNodes.length === 0) {
        return;
    }
    for (let childNode of node.childNodes) {
        for (let nodeKey in childNode.nodeElements) {
            if (Object.prototype.hasOwnProperty.call(childNode.nodeElements, nodeKey)) {
                if (nodeKey !== "timelineElements") {
                    childNode.nodeElements[nodeKey].remove();
                }
                else {
                    for (let timelineKey in childNode.nodeElements.timelineElements) {
                        if (Object.prototype.hasOwnProperty.call(childNode.nodeElements.timelineElements, timelineKey)) {
                            if (timelineKey !== "labels") {
                                childNode.nodeElements.timelineElements[timelineKey].remove();
                            }
                        }
                    }
                }
            }
        }
        removeChildNodes(childNode);
    }
}

function onSaveButtonClicked() {
    let controllerEvent = new Event(Config.EVENT_SAVE_EXPERIMENT, null);

    this.notifyAll(controllerEvent);
}

function onLoadButtonClicked() {
    let controllerEvent = new Event(Config.EVENT_LOAD_EXPERIMENT, null);

    this.notifyAll(controllerEvent);
}

function onNewButtonClicked() {
    let controllerEvent = new Event(Config.EVENT_NEW_EXPERIMENT, null);

    this.notifyAll(controllerEvent);
}

export default new TreeView();