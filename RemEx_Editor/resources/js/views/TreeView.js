/* eslint-env broswer */

import Config from "../utils/Config.js";
import NodeView from "./NodeView.js";

class TreeView {

    init(element) {
        this.treeViewContainer = element;
        this.treeView = element.firstElementChild;
        initTreeViewBox(this);

        this.center = {
            x: this.treeViewContainer.clientWidth / 2,
            y: this.treeViewContainer.clientHeight / 2
        }
        this.experimentRootNode = {
            x: this.center.x,
            y: this.center.y * 0.3,
            node: undefined
        }
        // TODO: Groups and Surveys
        this.currentStepNodes = {
            // TODO: Outsource the row distances in Config
            y: this.center.y,
            nodes: []
        }
        this.currentQuestionNodes = {
            // TODO: Outsource the row distances in Config
            y: this.center.y * 1.7,
            nodes: []
        }
    }

    insertNode(node) {
        if (node.getType() === Config.NODE_TYPE_NEW_EXPERIMENT) {
            this.experimentRootNode.node = node;
            node.updatePosition(this.experimentRootNode.x, this.experimentRootNode.y, true);
        }
        else if (node.getType() === Config.NODE_TYPE_EXPERIMENT) {
            removeNodeFromDOM(this.experimentRootNode.node);
            this.experimentRootNode.node = node;
            node.updatePosition(this.experimentRootNode.x, this.experimentRootNode.y, true);
        }
        else if (node.getType() === Config.NODE_TYPE_NEW_STEP || node.getType() === Config.NODE_TYPE_INSTRUCTION || node.getType() === Config.NODE_TYPE_BREATHING_EXERCISE || node.getType() === Config.NODE_TYPE_QUESTIONNAIRE) {
            //TODO
            node.updatePosition(this.center.x, this.currentStepNodes.y, true);
        }
        else if (node.getType() === Config.NODE_TYPE_NEW_QUESTION || node.getType() === Config.NODE_TYPE_QUESTION) {
            //TODO
            node.updatePosition(this.center.x, this.currentQuestionNodes.y, true);
        }
        else {
            throw "TreeView: Node type \"" + node.getType() + "\" is not defined for insertion.";
        }
        insertNodeIntoDOM(this, node);
    }

    removeNode(node) {
        // If the root node gets removed a new root node must be created as a replacement
        if (node.getType() === Config.NODE_TYPE_EXPERIMENT) {
            this.experimentRootNode.node = new NodeView(null, null, Config.NODE_TYPE_NEW_EXPERIMENT, Config.NODE_TYPE_NEW_EXPERIMENT_DESCRIPTION);
            this.experimentRootNode.node.updatePosition(this.experimentRootNode.x, this.experimentRootNode.y, true);
            insertNodeIntoDOM(this, this.experimentRootNode.node);
        }
        else if (node.getType() === Config.NODE_TYPE_INSTRUCTION || node.getType() === Config.NODE_TYPE_BREATHING_EXERCISE || node.getType() === Config.NODE_TYPE_QUESTIONNAIRE) {
            //TODO
        }
        else if (node.getType() === Config.NODE_TYPE_QUESTION) {
            //TODO
        }
        else {
            throw "TreeView: Node type \"" + node.getType() + "\" is not defined for removal.";
        }
        removeNodeFromDOM(node);
    }

    defocusNodes(type) {
        if (type === Config.NODE_TYPE_NEW_STEP || type === Config.NODE_TYPE_INSTRUCTION || type === Config.NODE_TYPE_BREATHING_EXERCISE || type === Config.NODE_TYPE_QUESTIONNAIRE) {
            for (let node of this.currentStepNodes.nodes) {
                node.defocus();
            }
        }
        else if (type === Config.NODE_TYPE_NEW_QUESTION || type === Config.NODE_TYPE_QUESTION) {
            for (let node of this.currentQuestionNodes.nodes) {
                node.defocus();
            }
        }
        else {
            // No need to defocus other nodes for the given node type
        }
    }
}

function initTreeViewBox(that) {
    that.treeView.setAttribute("viewBox", "0 0 " + that.treeViewContainer.clientWidth + " " + that.treeViewContainer.clientHeight);
    that.background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    that.background.setAttribute("x", "-150%");
    that.background.setAttribute("y", "-350%");
    that.background.setAttribute("width", "400%");
    that.background.setAttribute("height", "800%");
    that.background.setAttribute("fill", Config.TREE_VIEW_BACKGROUND_COLOR);
    that.background.setAttribute("fill-opacity", Config.TREE_VIEW_BACKGROUND_OPACITY);
    that.treeView.appendChild(that.background);
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