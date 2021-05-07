/* eslint-env broswer */

import Config from "../utils/Config.js";
import NodeView from "./NodeView.js";

class TreeView {

    init(element) {
        this.treeViewContainer = element;
        this.treeView = element.firstElementChild;
        this.treeView.setAttribute("viewBox", "0 0 " + this.treeViewContainer.clientWidth + " " + this.treeViewContainer.clientHeight);
        this.background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.background.setAttribute("x", "-150%");
        this.background.setAttribute("y", "-350%");
        this.background.setAttribute("width", "400%");
        this.background.setAttribute("height", "800%");
        this.background.setAttribute("fill", Config.TREE_VIEW_BACKGROUND_COLOR);
        this.background.setAttribute("fill-opacity", Config.TREE_VIEW_BACKGROUND_OPACITY);
        this.treeView.appendChild(this.background);

        this.center = {
            x: this.treeViewContainer.clientWidth / 2,
            y: this.treeViewContainer.clientHeight / 2
        }
        this.focusPoint = {
            x: this.center.x,
            y: this.treeViewContainer.clientHeight / 4
        }
        this.experimentRootNode = {
            x: this.focusPoint.x,
            y: this.focusPoint.y,
            view: undefined
        }
        this.stepNodes = {
            y: this.focusPoint.y + this.center.y,
            views: []
        }
    }

    insertExperimentNode(experimentNode) {
        if (this.experimentRootNode.view !== undefined) {
            removeNodeFromDOM(this.experimentRootNode.view);
        }
        experimentNode.updatePosition(this.experimentRootNode.x, this.experimentRootNode.y, true);
        insertNodeIntoDOM(this, experimentNode);
    }
}

function insertNodeIntoDOM(that, node) {
    let nodeElements = node.getElements();

    for (let element of nodeElements) {
        that.treeView.appendChild(element);
    }
}

function removeNodeFromDOM(node) {
    let nodeElements = node.getElements();

    for (let element of nodeElements) {
        element.remove();
    }
}

export default new TreeView();