import Config from "../utils/Config.js";
import NodeView from "./nodeView/NodeView.js";

class TreeView {

    init(eventListener, experiment) {
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

        this.setTree(eventListener, experiment);
        this.currentFocusedNode = this.experimentRootNode;
    }

    setTree(eventListener, experiment) {
        let groupX = this.center.x,
        stepX = this.center.x,
        surveyX = this.center.x,
        questionX = this.center.x;

        this.experimentRootNode = createExperimentTree(this, eventListener, experiment);
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
                    if (stepNode.type === Config.TYPE_QUESTIONNAIRE) {
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

    createNode(id, eventListener, nodeProperties) {
        let newNode;
    
        if (nodeProperties.description.length >= Config.NODE_DESCRIPTION_MAX_LENGTH) {
            nodeProperties.description = nodeProperties.description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
        }
        newNode = new NodeView(id, nodeProperties.type, nodeProperties.description, nodeProperties.parentNode, nodeProperties.previousNode, nodeProperties.nextNode);
        for (let listener of eventListener) {
            newNode.addEventListener(listener.eventType, listener.callback);
        }
        if (nodeProperties.parentNode !== undefined) {
            nodeProperties.parentNode.childNodes.push(newNode);
        }
        if (nodeProperties.previousNode !== undefined) {
            nodeProperties.previousNode.nextNode = newNode;
        }
        if (nodeProperties.nextNode !== undefined) {
            nodeProperties.nextNode.previousNode = newNode;
        }
    
        return newNode;
    }

    insertNode(node, insertionType) {
        let x,
        y,
        isInsertion = true;

        if (insertionType === Config.INSERT_AFTER) {
            x = node.previousNode.center.x + Config.NODE_DISTANCE_HORIZONTAL;
            y = node.previousNode.center.y;
            updateNextNodePositions(node.nextNode, isInsertion);
        }
        else if (insertionType === Config.INSERT_BEFORE) {
            x = node.nextNode.center.x - Config.NODE_DISTANCE_HORIZONTAL;
            y = node.nextNode.center.y;
            updatePrevNodePositions(node.previousNode);
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
        let isInsertion = false,
        nextFocusedNode;

        updateNodeLinks(node);
        nextFocusedNode = getNextFocusedNode(node);
        updateNextNodePositions(node.nextNode, isInsertion);
        removeNodeFromParentsList(node);
        removeNodeFromDOM(node);
        return nextFocusedNode;
    }

    focusNode(node) {
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
        this.currentFocusedNode = node;
    }

    emphasizeNode(node) {
        node.emphasize();
    }

    deemphasizeNode(node) {
        node.deemphasize();
    }

    clickNode(node) {
        node.nodeSvg.dispatchEvent(new Event("click"));
    }

    updateNodeDescription(node, description) {
        node.updateDescription(description);
    }

    moveToPreviousNode() {
        if (this.currentFocusedNode.previousNode !== undefined) {
            this.clickNode(this.currentFocusedNode.previousNode);
        }
    }

    moveToNextNode() {
        if (this.currentFocusedNode.nextNode !== undefined) {
            this.clickNode(this.currentFocusedNode.nextNode);
        }
    }

    moveToParentNode() {
        if (this.currentFocusedNode.parentNode !== undefined) {
            this.clickNode(this.currentFocusedNode.parentNode);
        }
    }

    moveToFirstChildNode() {
        if (this.currentFocusedNode.childNodes[0] !== undefined) {
            this.clickNode(this.currentFocusedNode.childNodes[0]);
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

function createExperimentTree(that, eventListener, experiment) {
    let experimentRootNode,
    groupNode,
    previousGroupNode,
    surveyNode,
    previousSurveyNode,
    stepNode,
    previousStepNode,
    questionNode,
    previousQuestionNode,
    nodeProperties = {},
    id;

    nodeProperties.type = Config.TYPE_EXPERIMENT;
    nodeProperties.description = experiment.name;
    nodeProperties.parentNode = undefined;
    nodeProperties.previousNode = undefined;
    nodeProperties.nextNode = undefined;
    experimentRootNode = that.createNode(id, eventListener, nodeProperties);
    for (let group of experiment.groups) {
        id = group.id;
        nodeProperties.type = Config.TYPE_EXPERIMENT_GROUP;
        nodeProperties.description = group.name;
        nodeProperties.parentNode = experimentRootNode;
        nodeProperties.previousNode = previousGroupNode;
        nodeProperties.nextNode = undefined;
        groupNode = that.createNode(id, eventListener, nodeProperties);
        experimentRootNode.childNodes.push(groupNode);
        if (previousGroupNode !== undefined) {
            previousGroupNode.nextNode = groupNode;
        }
        previousGroupNode = groupNode;
        for (let survey of group.surveys) {
            // TODO: Create Survey Timeline
            id = survey.id;
            nodeProperties.type = Config.TYPE_SURVEY;
            nodeProperties.description = survey.name;
            nodeProperties.parentNode = groupNode;
            nodeProperties.previousNode = previousSurveyNode;
            nodeProperties.nextNode = undefined;
            surveyNode = that.createNode(id, eventListener, nodeProperties);
            groupNode.childNodes.push(surveyNode);
            if (previousSurveyNode !== undefined) {
                previousSurveyNode.nextNode = surveyNode;
            }
            previousSurveyNode = surveyNode;
            for (let step of survey.steps) {
                id = step.id;
                nodeProperties.description = step.name;
                nodeProperties.parentNode = surveyNode;
                nodeProperties.previousNode = previousStepNode;
                nodeProperties.nextNode = undefined;
                if (step.type === Config.STEP_TYPE_INSTRUCTION) {
                    nodeProperties.type = Config.TYPE_INSTRUCTION;
                }
                else if (step.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
                    nodeProperties.type = Config.TYPE_BREATHING_EXERCISE;
                }
                else if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    nodeProperties.type = Config.TYPE_QUESTIONNAIRE;
                }
                else {
                    throw "TreeView: No Node for step type \"" + step.type + "\" is defined.";
                }
                stepNode = that.createNode(id, eventListener, nodeProperties);
                surveyNode.childNodes.push(stepNode);
                if (previousStepNode !== undefined) {
                    previousStepNode.nextNode = stepNode;
                }
                previousStepNode = stepNode;
                if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    for (let question of step.questions) {
                        id = question.id;
                        nodeProperties.type = Config.TYPE_QUESTION;
                        nodeProperties.description = question.name;
                        nodeProperties.parentNode = stepNode;
                        nodeProperties.previousNode = previousQuestionNode;
                        nodeProperties.nextNode = undefined;
                        questionNode = that.createNode(id, eventListener, nodeProperties);
                        stepNode.childNodes.push(questionNode);
                        if (previousQuestionNode !== undefined) {
                            previousQuestionNode.nextNode = questionNode;
                        }
                        previousQuestionNode = questionNode;
                    }
                }
                else {
                    // The other step types haven't got child nodes
                }
            }
        }
    }
    return experimentRootNode;
}

function updateNodeLinks(node) {
    if (node.previousNode !== undefined) {
        node.previousNode.nextNode = node.nextNode;
    }
    if (node.nextNode !== undefined) {
        node.nextNode.previousNode = node.previousNode;
    }
}

function getNextFocusedNode(node) {
    let nextFocusedNode;

    if (node.nextNode !== undefined) {
        nextFocusedNode = node.nextNode;
    }
    else if (node.previousNode !== undefined) {
        nextFocusedNode = node.previousNode;
    }
    else {
        nextFocusedNode = node.parentNode;
    }
    return nextFocusedNode;
}

function removeNodeFromParentsList(node) {
    let indexInParentList;

    indexInParentList = node.parentNode.childNodes.indexOf(node);
    if (indexInParentList !== -1) {
        node.parentNode.childNodes.splice(indexInParentList, 1);
    }
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

function updateNextNodePositions(node, isInsertion) {
    if (node === undefined) {
        return;
    }
    if (isInsertion) {
        node.updatePosition(node.center.x + Config.NODE_DISTANCE_HORIZONTAL, node.center.y, true);
    }
    else {
        node.updatePosition(node.center.x - Config.NODE_DISTANCE_HORIZONTAL, node.center.y, true);
    }
    updateNextNodePositions(node.nextNode, isInsertion);
}

function updatePrevNodePositions(node) {
    if (node === undefined) {
        return;
    }
    node.updatePosition(node.center.x - Config.NODE_DISTANCE_HORIZONTAL, node.center.y, true);
    updatePrevNodePositions(node.previousNode);
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