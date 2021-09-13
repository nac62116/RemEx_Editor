import Config from "../utils/Config.js";

class TreeView {

    init() {
        this.treeViewContainer = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID);
        this.treeView = this.treeViewContainer.firstElementChild;
        initTreeViewBox(this);

        this.center = {
            x: this.treeViewContainer.clientWidth / 2, // eslint-disable-line no-magic-numbers
            y: this.treeViewContainer.clientHeight / 2, // eslint-disable-line no-magic-numbers
        };
        this.rowDistance = this.treeViewContainer.clientHeight / 3; // eslint-disable-line no-magic-numbers

        this.experimentPositionY = this.center.y;
        this.experimentGroupsPositionY = this.experimentPositionY + this.rowDistance;
        this.surveysPositionY = this.experimentGroupsPositionY + this.rowDistance;
        this.stepsPositionY = this.surveysPositionY + this.rowDistance;
        this.questionsPositionY = this.stepsPositionY + this.rowDistance;

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
            groupX = groupX + Config.NODE_DISTANCE_HORIZONTAL;
            for (let surveyNode of groupNode.childNodes) {
                surveyNode.setInputPath(groupNode.bottom);
                surveyNode.updatePosition(surveyX, this.surveysPositionY, true);
                insertNodeIntoDOM(this, surveyNode);
                surveyX = surveyX + Config.NODE_DISTANCE_HORIZONTAL;
                for (let stepNode of surveyNode.childNodes) {
                    stepNode.setInputPath(surveyNode.bottom);
                    stepNode.updatePosition(stepX, this.stepsPositionY, true);
                    insertNodeIntoDOM(this, stepNode);
                    stepX = stepX + Config.NODE_DISTANCE_HORIZONTAL;
                    if (stepNode.type === Config.NODE_TYPE_QUESTIONNAIRE) {
                        for (let questionNode of stepNode.childNodes) {
                            questionNode.setInputPath(stepNode.bottom);
                            questionNode.updatePosition(questionX, this.questionsPositionY, true);
                            insertNodeIntoDOM(this, questionNode);
                            questionX = questionX + Config.NODE_DISTANCE_HORIZONTAL;
                        }
                    }
                }
            }
        }
    }

    // TODO: Insertion

    insertNode(node, insertionType) {
        let x,
        y,
        isInsertion = true;
        if (insertionType === Config.TREE_VIEW_INSERT_AFTER && node.previousNode !== undefined) {
            x = node.previousNode.center.x + Config.NODE_DISTANCE_HORIZONTAL;
            y = node.previousNode.center.y;
            updateNextNodePosition(node.nextNode, isInsertion);
        }
        else if (insertionType === Config.TREE_VIEW_INSERT_BEFORE && node.nextNode !== undefined) {
            x = node.nextNode.center.x - Config.NODE_DISTANCE_HORIZONTAL;
            y = node.nextNode.center.y;
            updatePreviousNodePosition(node.previousNode, isInsertion);
        }
        else {
            x = this.center.x;
            y = node.parentNode.center.y + this.rowDistance;
        }
        node.setInputPath(node.parentNode.bottom);
        node.updatePosition(x, y, true);
        insertNodeIntoDOM(this, node);
    }

    removeNode(node) {
        let isInsertion = false;
        if (node.previousNode !== undefined) {
            updateNextNodePosition(node.nextNode, isInsertion);
        }
        else if (node.nextNode !== undefined) {
            updatePreviousNodePosition(node.previousNode, isInsertion);
        }
        else {
            // No other nodes in this row which have to be updated
        }
        removeNodeFromDOM(node);
    }

    setFocusOn(node) {
        let firstNodeOfRow = getFirstNodeOfRow(node),
        centerOffsetVector = getCenterOffsetVector(this, node),
        partialVector = {
            x: centerOffsetVector.x / Config.TREE_MOVEMENT_ANIMATION_STEPS,
            y: centerOffsetVector.y / Config.TREE_MOVEMENT_ANIMATION_STEPS,
        },
        i = 0,
        intervall;
        
        intervall = setInterval(() => {
            moveHorizontal(firstNodeOfRow, partialVector);
            moveVertical(this.experimentRootNode, null, partialVector);
            i += 1;
            if (i === Config.TREE_MOVEMENT_ANIMATION_STEPS) {
                clearInterval(intervall);
            }
        }, Config.TREE_MOVEMENT_ANIMATION_FRAME_RATE_MS);
        
        showChildNodes(node, true);
        defocusNextNodes(firstNodeOfRow);
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

function updateNextNodePosition(node, isInsertion) {
    if (node === undefined) {
        return;
    }
    if (isInsertion) {
        node.updatePosition(node.center.x + Config.NODE_DISTANCE_HORIZONTAL, node.center.y, true);
    }
    else {
        node.updatePosition(node.center.x - Config.NODE_DISTANCE_HORIZONTAL, node.center.y, true);
    }
    updateNextNodePosition(node.nextNode);
}

function updatePreviousNodePosition(node, isInsertion) {
    if (node === undefined) {
        return;
    }
    if (isInsertion) {
        node.updatePosition(node.center.x - Config.NODE_DISTANCE_HORIZONTAL, node.center.y, true);
    }
    else {
        node.updatePosition(node.center.x + Config.NODE_DISTANCE_HORIZONTAL, node.center.y, true);
    }
    updatePreviousNodePosition(node.previousNode);
}

function getCenterOffsetVector(that, node) {
    let centerOffsetVector = {
        x: undefined,
        y: undefined,
    };

    centerOffsetVector.x = that.center.x - node.center.x;
    centerOffsetVector.y = that.center.y - node.center.y;

    return centerOffsetVector;
}

function moveHorizontal(node, vector) {
    let x;

    if (node === undefined) {
        return;
    }
    x = node.center.x + vector.x;
    node.updatePosition(x, node.center.y, true);
    moveHorizontal(node.nextNode, vector);
}

function moveVertical(node, parentNode, vector) {
    let y;

    if (node === undefined) {
        return;
    }
    y = node.center.y + vector.y;
    if (parentNode !== null) {
        node.parentOutputPoint.x = parentNode.bottom.x;
        node.parentOutputPoint.y = parentNode.bottom.y;
    }
    node.updatePosition(node.center.x, y, true);
    for (let childNode of node.childNodes) {
        moveVertical(childNode, node, vector);
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

function defocusNextNodes(node) {
    if (node === undefined) {
        return;
    }
    node.defocus();
    defocusNextNodes(node.nextNode);
}

function getFirstNodeOfRow(node) {
    let firstNode = node;

    while (firstNode.previousNode !== undefined) {
        firstNode = firstNode.previousNode;
    }
    return firstNode;
}

export default new TreeView();