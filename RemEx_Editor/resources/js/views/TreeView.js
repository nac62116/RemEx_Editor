/* eslint-env broswer */

import Config from "../utils/Config.js";

class TreeView {

    init() {
        this.treeViewContainer = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID);
        this.treeView = this.treeViewContainer.firstElementChild;
        initTreeViewBox(this);

        this.center = {
            x: this.treeViewContainer.clientWidth / 2,
            y: this.treeViewContainer.clientHeight / 2
        }
        this.experimentPositionY = this.center.y;
        this.experimentGroupsPositionY = this.center.y * (1 + Config.TREE_VIEW_ROW_DISTANCE_FACTOR);
        this.surveysPositionY = this.center.y * (1 + 2 * Config.TREE_VIEW_ROW_DISTANCE_FACTOR);
        this.stepsPositionY = this.center.y * (1 + 3 * Config.TREE_VIEW_ROW_DISTANCE_FACTOR);
        this.questionsPositionY = this.center.y * (1 + 4 * Config.TREE_VIEW_ROW_DISTANCE_FACTOR);
        this.experimentRootNode = undefined;
    }

    setInitialTree(rootNode) {
        let groupX = this.center.x,
        stepX = this.center.x,
        surveyX = this.center.x,
        questionX = this.center.x;

        this.experimentRootNode = rootNode;
        this.experimentRootNode.setInputPath(null);
        this.experimentRootNode.updatePosition(this.center.x, this.experimentPositionY, true);
        insertNodeIntoDOM(this, this.experimentRootNode);
        for (let groupNode of this.experimentRootNode.childNodes) {
            groupNode.setInputPath(this.experimentRootNode.bottom);
            groupNode.updatePosition(groupX, this.experimentGroupsPositionY, true);
            insertNodeIntoDOM(this, groupNode);
            groupX = groupX + Config.NODE_DISTANCE;
            for (let surveyNode of groupNode.childNodes) {
                surveyNode.setInputPath(groupNode.bottom);
                surveyNode.updatePosition(surveyX, this.surveysPositionY, true);
                insertNodeIntoDOM(this, surveyNode);
                surveyX = surveyX + Config.NODE_DISTANCE;
                for (let stepNode of surveyNode.childNodes) {
                    stepNode.setInputPath(surveyNode.bottom);
                    stepNode.updatePosition(stepX, this.stepsPositionY, true);
                    insertNodeIntoDOM(this, stepNode);
                    stepX = stepX + Config.NODE_DISTANCE;
                    if (stepNode.type = Config.NODE_TYPE_QUESTIONNAIRE) {
                        for (questionNode of stepNode.childNodes) {
                            questionNode.setInputPath(stepNode.bottom);
                            questionNode.updatePosition(questionX, this.questionsPositionY, true);
                            insertNodeIntoDOM(this, questionNode);
                            questionX = questionX + Config.NODE_DISTANCE;
                        }
                    }
                }
            }
        }
    }

    insertNode(node, previousNode, nextNode) {
        let x;
        if (previousNode !== null) {
            x = previousNode.center.x + Config.NODE_DISTANCE;
        }
        else if (nextNode !== null) {
            x = nextNode.center.x - Config.NODE_DISTANCE;
        }
        else {
            x = this.center.x;
        }
        if (node.type === Config.NODE_TYPE_EXPERIMENT_GROUP) {
            node.setInputPath(this.experimentRootNode.bottom);
            node.updatePosition(x, this.experimentGroupsPositionY, true);
        }
        // else if TODO
        insertNodeIntoDOM(this, node);
    }

    setFocusOn(node) {
        let centerOffsetVector = getCenterOffsetVector(this, node);
        moveTree(this.experimentRootNode, null, centerOffsetVector);
        showChildNodes(node, true);
        node.focus();
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
    for (let element of node.elements) {
        that.treeView.appendChild(element);
    }
}

function removeNodeFromDOM(node) {
    for (let element of node.elements) {
        element.remove();
    }
}

function getCenterOffsetVector(that, node) {
    let centerOffsetVector = {
        x: undefined,
        y: undefined
    }

    centerOffsetVector.x = that.center.x - node.center.x;
    centerOffsetVector.y = that.center.y - node.center.y;

    return centerOffsetVector;
}

function moveTree(node, previousNode, vector) {
    let x, y;

    if (node === undefined) {
        return;
    }
    x = node.center.x + vector.x;
    y = node.center.y + vector.y;
    if (previousNode !== null) {
        node.parentOutputPoint.x = previousNode.bottom.x;
        node.parentOutputPoint.y = previousNode.bottom.y;
    }
    node.updatePosition(x, y, true);
    for (let childNode of node.childNodes) {
        moveTree(childNode, node, vector);
    }
}

function showChildNodes(node, isFirstIteration) {
    let childNode;
    if (node.childNodes.length === 0) {
        return;
    }
    if (isFirstIteration) {
        for (childNode of node.childNodes) {
            childNode.show();
            childNode.defocus();
            childNode.deemphasize();
        }
    }
    else {
        for (childNode of node.childNodes) {
            childNode.hide();
            showChildNodes(childNode, false);
        }
    }
}

export default new TreeView();