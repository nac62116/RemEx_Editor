import TreeView from "../views/TreeView.js";
import WhereAmIView from "../views/WhereAmIView.js";
import InputView from "../views/InputView.js";
import ModelManager from "./ModelManager.js";
import SvgFactory from "../utils/SvgFactory.js";
import Config from "../utils/Config.js";
import RootNode from "../views/nodeView/RootNode.js";
import TimelineNode from "../views/nodeView/TimelineNode.js";
import DeflateableNode from "../views/nodeView/DeflateableNode.js";
import StandardNode from "../views/nodeView/StandardNode.js";
import Storage from "../utils/Storage.js";
import MoveableNode from "../views/nodeView/MoveableNode.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO:
// -> Up and download experiment.json buttons, Export button answer.name <-> answer.code table 
// -> Node icons
// -> Code cleaning
// -> Create .exe file for install
// -> InfoView
// (-> Colors and style)

// ENHANCEMENT:
// - Copy paste option
// - Calculate the optimal duration for a survey depending on its
// - Fullscreen Buttons
// - Survey time randomization
// - Show survey time windows (survey.startTimeInMin |-------| survey.startTimeInMin + survey.maxDurationInMin + survey.notificationDurationInMin)

class Controller {

    init() {
        let experiment,
        treeViewContainer = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID),
        treeViewElement = SvgFactory.createTreeViewElement(),
        whereAmIViewContainer = document.querySelector("#" + Config.WHERE_AM_I_VIEW_CONTAINER_ID),
        whereAmIViewElement = SvgFactory.createWhereAmIViewElement(),
        inputViewContainer = document.querySelector("#" + Config.INPUT_VIEW_CONTAINER_ID),
        newNode;
        this.nodeEventListener = [
            {
                eventType: Config.EVENT_NODE_MOUSE_ENTER,
                callback: onNodeMouseEnter.bind(this),
            },
            {
                eventType: Config.EVENT_NODE_MOUSE_LEAVE,
                callback: onNodeMouseLeave.bind(this),
            },
            {
                eventType: Config.EVENT_NODE_CLICKED,
                callback: onNodeClicked.bind(this),
            },
            {
                eventType: Config.EVENT_ADD_NEXT_NODE,
                callback: onAddNextNode.bind(this),
            },
            {
                eventType: Config.EVENT_ADD_PREV_NODE,
                callback: onAddPreviousNode.bind(this),
            },
            {
                eventType: Config.EVENT_ADD_CHILD_NODE,
                callback: onAddChildNode.bind(this),
            },
            {
                eventType: Config.EVENT_MOVE_NODE_RIGHT,
                callback: onMoveNodeRight.bind(this),
            },
            {
                eventType: Config.EVENT_MOVE_NODE_LEFT,
                callback: onMoveNodeLeft.bind(this),
            },
        ];
        this.inputViewEventListener = [
            {
                eventType: Config.EVENT_INPUT_CHANGED,
                callback: onInputChanged.bind(this),
            },
            {
                eventType: Config.EVENT_REMOVE_NODE,
                callback: onRemoveNode.bind(this),
            },
            {
                eventType: Config.EVENT_ADD_NEXT_NODE,
                callback: onAddNextNode.bind(this),
            },
        ];
        this.timelineEventListener = [
            {
                eventType: Config.EVENT_TIMELINE_CLICKED,
                callback: onTimelineClicked.bind(this),
            },
        ];
        this.currentSelection = [];
        treeViewContainer.appendChild(treeViewElement);
        TreeView.init(treeViewContainer);

        // TODO: Remove this
        ModelManager.removeExperiment();

        experiment = ModelManager.initExperiment();
        newNode = createNode(this, undefined, experiment, undefined, undefined);
        newNode.updatePosition(TreeView.getCenter().x, TreeView.getCenter().y, true);
        
        whereAmIViewContainer.appendChild(whereAmIViewElement);
        WhereAmIView.init(whereAmIViewContainer);

        InputView.init(inputViewContainer);
        InputView.addEventListener(Config.EVENT_INPUT_CHANGED, onInputChanged.bind(this));
        InputView.addEventListener(Config.EVENT_ADD_NEXT_NODE, onAddNextNode.bind(this));
        InputView.addEventListener(Config.EVENT_ADD_PREV_NODE, onAddPreviousNode.bind(this));
        InputView.addEventListener(Config.EVENT_ADD_CHILD_NODE, onAddChildNode.bind(this));
        InputView.addEventListener(Config.EVENT_REMOVE_NODE, onRemoveNode.bind(this));
        // InfoViewManager.initInfoView();
        document.addEventListener("keyup", onKeyUp.bind(this));
    }
}

function createNode(that, parentNode, data, stepType, questionType) {
    let id = data.id,
    elements,
    description = data.name,
    node;

    if (parentNode === undefined) {
        elements = SvgFactory.createRootNodeElements();
        node = new RootNode(elements, id, Config.TYPE_EXPERIMENT, description);
    }
    else if (parentNode.type === Config.TYPE_EXPERIMENT) {
        elements = SvgFactory.createTimelineNodeElements();
        node = new TimelineNode(elements, id, Config.TYPE_EXPERIMENT_GROUP, description, parentNode, that.timelineEventListener, TreeView.getWidth());
    }
    else if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
        elements = SvgFactory.createDeflateableNodeElements(false, true);
        node = new DeflateableNode(elements, id, Config.TYPE_SURVEY, description, parentNode);
    }
    else if (parentNode.type === Config.TYPE_SURVEY) {
        if (stepType === Config.STEP_TYPE_INSTRUCTION || stepType === Config.STEP_TYPE_BREATHING_EXERCISE) {
            elements = SvgFactory.createMoveableNodeElements(true, false);
            node = new MoveableNode(elements, id, stepType, description, parentNode);
        }
        else if (stepType === Config.STEP_TYPE_QUESTIONNAIRE) {
            elements = SvgFactory.createMoveableNodeElements(true, true);
            node = new MoveableNode(elements, id, Config.STEP_TYPE_QUESTIONNAIRE, description, parentNode);
        }
        else {
            throw "The step type " + stepType + " is not defined.";
        }
    }
    else if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        if (questionType === Config.QUESTION_TYPE_CHOICE) {
            elements = SvgFactory.createMoveableNodeElements(true, true);
            node = new MoveableNode(elements, id, Config.QUESTION_TYPE_CHOICE, description, parentNode);
        }
        else if (questionType !== Config.QUESTION_TYPE_CHOICE && questionType !== undefined) {
            elements = SvgFactory.createMoveableNodeElements(true, false);
            node = new MoveableNode(elements, id, questionType, description, parentNode);
        }
        else {
            throw "The question type " + questionType + " is not defined.";
        }
    }
    else if (parentNode.type === Config.QUESTION_TYPE_CHOICE) {
        description = data.text;
        elements = SvgFactory.createStandardNodeElements(true, false);
        node = new StandardNode(elements, id, Config.TYPE_ANSWER, description, parentNode);
    }
    else {
        throw "The node type " + parentNode.type + " is not defined.";
    }
    for (let listener of that.nodeEventListener) {
        node.addEventListener(listener.eventType, listener.callback);
    }
    node.parentNode = parentNode;
    if (parentNode !== undefined) {
        parentNode.childNodes.push(node);
    }
    TreeView.insertNode(node);
    return node;
}

// Node events

function onNodeMouseEnter(event) {
    let hoveredNode = event.data.target;

    hoveredNode.emphasize(this.currentSelection);
    // InfoView
}

function onNodeMouseLeave(event) {
    let hoveredNode = event.data.target;

    hoveredNode.deemphasize(this.currentSelection);
    // InfoView
}

function onNodeClicked(event) {
    let clickedNode = event.data.target,
    previousFocusedNode = TreeView.currentFocusedNode,
    parentNode = clickedNode.parentNode,
    experiment = Storage.load(),
    inputData = ModelManager.getDataFromNodeId(clickedNode.id, experiment),
    movingVector = {
        x: undefined,
        y: undefined,
    },
    ongoingInstructionsForInputView = [],
    firstNodeOfRow,
    questionsForInputView = [],
    promise;

    if (clickedNode !== previousFocusedNode) {
        this.currentSelection = [];
        updateCurrentSelection(this, clickedNode);
        TreeView.currentFocusedNode = clickedNode;

        clickedNode.emphasize(this.currentSelection);
        clickedNode.focus();
        //clickedNode.show();
        for (let childNode of clickedNode.childNodes) {
            childNode.show();
            hideChildrenBeginningFromNode(childNode);
        }
        hideNextNodesAndChildrenBeginningFromNode(clickedNode);
        hidePreviousNodesAndChildrenBeginningFromNode(clickedNode);
        while (parentNode !== undefined) {
            hideNextNodesAndChildrenBeginningFromNode(parentNode);
            hidePreviousNodesAndChildrenBeginningFromNode(parentNode);
            parentNode = parentNode.parentNode;
        }
        showNeighboursBeginningFromNode(clickedNode);
        
        if (previousFocusedNode !== undefined) {
            previousFocusedNode.defocus(this.currentSelection);
            previousFocusedNode.deemphasize(this.currentSelection);
        }
        
        if (clickedNode instanceof TimelineNode && clickedNode.childNodes.length === 0) {
            clickedNode.updateTimelineLength();
        }

        movingVector.x = TreeView.getCenter().x - clickedNode.center.x;
        movingVector.y = TreeView.getCenter().y - clickedNode.center.y;
        if (previousFocusedNode !== undefined) {
            if (clickedNode instanceof RootNode) {
                moveTreeVertical(clickedNode, movingVector.y, Config.MOVING_MODE_TREE);
                moveTreeHorizontal(clickedNode, movingVector.x, Config.MOVING_MODE_TREE);
            }
            else if (clickedNode.parentNode instanceof TimelineNode) {
                moveTreeVertical(clickedNode, movingVector.y, Config.MOVING_MODE_TREE);
            }
            else if (clickedNode.parentNode === previousFocusedNode.parentNode) {
                moveTreeHorizontal(clickedNode, movingVector.x, Config.MOVING_MODE_ROW);
            }
            else {
                moveTreeVertical(clickedNode, movingVector.y, Config.MOVING_MODE_TREE);
                moveTreeHorizontal(clickedNode, movingVector.x, Config.MOVING_MODE_ROW);
            }
        }
        else {
            moveTreeVertical(clickedNode, movingVector.y, Config.MOVING_MODE_TREE);
            moveTreeHorizontal(clickedNode, movingVector.x, Config.MOVING_MODE_TREE);
        }

        WhereAmIView.update(this.currentSelection);

        if (clickedNode.parentNode !== undefined) {
            if (clickedNode.parentNode.type === Config.TYPE_SURVEY) {
                ongoingInstructionsForInputView = getOngoingInstructionsForInputView(clickedNode, ongoingInstructionsForInputView);
            }
            if (clickedNode.parentNode.type === Config.QUESTION_TYPE_CHOICE) {
                firstNodeOfRow = getFirstNodeOfRow(clickedNode.parentNode);
                questionsForInputView = getQuestionsForInputView(firstNodeOfRow, questionsForInputView);
            }
        }
        if (clickedNode.type === Config.STEP_TYPE_INSTRUCTION) {
            if (inputData.imageFileName !== null) {
                promise = ModelManager.getResource(inputData.imageFileName);
            }
            if (inputData.videoFileName !== null) {
                promise = ModelManager.getResource(inputData.videoFileName);
            }
            if (promise !== undefined) {
                promise.then(function(result) {
                    if (typeof(result) === "string") {
                        console.log(result);
                    }
                    else {
                        InputView.show(clickedNode, inputData, ongoingInstructionsForInputView, questionsForInputView, result);
                    }
                });
            }
            else {
                InputView.show(clickedNode, inputData, ongoingInstructionsForInputView, questionsForInputView, undefined);
            }
        }
        else {
            InputView.show(clickedNode, inputData, ongoingInstructionsForInputView, questionsForInputView, undefined);
        }
        InputView.selectFirstInput();
    }
}

function updateCurrentSelection(that, node) {
    if (node === undefined) {
        return;
    }
    that.currentSelection.push(node);
    updateCurrentSelection(that, node.parentNode);
}

function hideChildrenBeginningFromNode(node) {
    if (node.childNodes === undefined || node.childNodes.length === 0) {
        return;
    }
    for (let childNode of node.childNodes) {
        childNode.hide();
        hideChildrenBeginningFromNode(childNode);
    }
}

function hideNextNodesAndChildrenBeginningFromNode(node) {
    if (node.nextNode === undefined) {
        return;
    }
    node.nextNode.hide();
    hideChildrenBeginningFromNode(node.nextNode);
    hideNextNodesAndChildrenBeginningFromNode(node.nextNode);
}

function hidePreviousNodesAndChildrenBeginningFromNode(node) {
    if (node.previousNode === undefined) {
        return;
    }
    node.previousNode.hide();
    hideChildrenBeginningFromNode(node.previousNode);
    hidePreviousNodesAndChildrenBeginningFromNode(node.previousNode);
}

function showNeighboursBeginningFromNode(node) {
    showRightNeighbours(node);
    showLeftNeighbours(node);
}

function showRightNeighbours(node) {
    if (node.nextNode === undefined) {
        return;
    }
    node.nextNode.show();
    showRightNeighbours(node.nextNode);
}

function showLeftNeighbours(node) {
    if (node.previousNode === undefined) {
        return;
    }
    node.previousNode.show();
    showLeftNeighbours(node.previousNode);
}

function moveTreeVertical(clickedNode, movingVectorY, movingMode) {
    let startNode;

    if (movingMode === Config.MOVING_MODE_TREE) {
        startNode = getRootNode(clickedNode);
        startNode.updatePosition(startNode.center.x, startNode.center.y + movingVectorY, true);
    }
    else if (movingMode === Config.MOVING_MODE_ROW) {
        startNode = clickedNode.parentNode;
    }
    else {
        throw "Moving mode " + movingMode + " is not defined.";
    }
    moveChildNodesVertical(startNode, movingVectorY);
}

function moveTreeHorizontal(clickedNode, movingVectorX, movingMode) {
    let startNode;

    if (movingMode === Config.MOVING_MODE_TREE) {
        startNode = getRootNode(clickedNode);
        startNode.updatePosition(startNode.center.x + movingVectorX, startNode.center.y, true);
    }
    else if (movingMode === Config.MOVING_MODE_ROW) {
        startNode = clickedNode.parentNode;
    }
    else {
        throw "Moving mode " + movingMode + " is not defined.";
    }
    moveChildNodesHorizontal(startNode, movingVectorX);
}

function getRootNode(node) {
    if (node.parentNode === undefined) {
        return node;
    }
    return getRootNode(node.parentNode);
}

function moveChildNodesVertical(node, movingVectorY) {
    if (node.childNodes === undefined || node.childNodes.length === 0) {
        return;
    }
    for (let childNode of node.childNodes) {
        childNode.updatePosition(childNode.center.x, childNode.center.y + movingVectorY, true);
        moveChildNodesVertical(childNode, movingVectorY);
    }
}

function moveChildNodesHorizontal(node, movingVectorX) {
    if (node.childNodes === undefined || node.childNodes.length === 0) {
        return;
    }
    for (let childNode of node.childNodes) {
        childNode.updatePosition(childNode.center.x + movingVectorX, childNode.center.y, true);
        moveChildNodesHorizontal(childNode, movingVectorX);
    }
}

function getOngoingInstructionsForInputView(node, ongoingInstructionsForInputView) {
    let ongoingInstruction,
    modelData,
    experiment = Storage.load();

    if (node.previousNode === undefined) {
        return ongoingInstructionsForInputView;
    }
    modelData = ModelManager.getDataFromNodeId(node.previousNode.id, experiment);
    if (modelData.type === Config.STEP_TYPE_INSTRUCTION 
        && modelData.durationInMin !== null 
        && modelData.durationInMin !== 0) {
        ongoingInstruction = {
            label: modelData.name,
            value: modelData.id,
        };
        ongoingInstructionsForInputView.splice(0, 0, ongoingInstruction);
    }
    return getOngoingInstructionsForInputView(node.previousNode, ongoingInstructionsForInputView);
}

function getQuestionsForInputView(node, questionsForInputView) {
    let question,
    modelData,
    experiment = Storage.load();

    if (node === undefined) {
        return questionsForInputView;
    }
    modelData = ModelManager.getDataFromNodeId(node.id, experiment);
    question = {
        label: modelData.name,
        value: modelData.id,
    };
    questionsForInputView.push(question);
    return getQuestionsForInputView(node.nextNode, questionsForInputView);
}

function onAddNextNode(event) {
    let clickedNode = event.data.target,
    inputData,
    position = {
        x: clickedNode.center.x + Config.NODE_DISTANCE_HORIZONTAL,
        y: clickedNode.center.y,
    },
    newNode,
    stepType,
    questionType,
    firstNodeOfRow;

    if (event.data.stepType === undefined && clickedNode.parentNode.type === Config.TYPE_SURVEY) {
        stepType = Config.STEP_TYPE_INSTRUCTION;
    }
    else {
        stepType = event.data.stepType;
    }
    if (event.data.questionType === undefined && clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        questionType = Config.QUESTION_TYPE_TEXT;
    }
    else {
        questionType = event.data.questionType;
    }
    inputData = ModelManager.extendExperiment(clickedNode.parentNode, undefined, stepType, questionType);
    newNode = createNode(this, clickedNode.parentNode, inputData, stepType, questionType);
    newNode.updatePosition(position.x, position.y, true);
    if (clickedNode.nextNode !== undefined) {
        clickedNode.nextNode.previousNode = newNode;
        newNode.nextNode = clickedNode.nextNode;
    }
    clickedNode.nextNode = newNode;
    newNode.previousNode = clickedNode;
    if (clickedNode.parentNode.type === Config.TYPE_SURVEY) {
        firstNodeOfRow = getFirstNodeOfRow(clickedNode);
        updateStepLinks(firstNodeOfRow);
    }
    if (clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        firstNodeOfRow = getFirstNodeOfRow(clickedNode);
        updateQuestionLinks(firstNodeOfRow);
    }
    moveNextNodes(newNode, false);
    newNode.click();
}

function onAddPreviousNode(event) {
    let clickedNode = event.data.target,
    inputData,
    position = {
        x: clickedNode.center.x - Config.NODE_DISTANCE_HORIZONTAL,
        y: clickedNode.center.y,
    },
    newNode,
    stepType,
    questionType,
    firstNodeOfRow;

    if (event.data.stepType === undefined && clickedNode.parentNode.type === Config.TYPE_SURVEY) {
        stepType = Config.STEP_TYPE_INSTRUCTION;
    }
    else {
        stepType = event.data.stepType;
    }
    if (event.data.questionType === undefined && clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        questionType = Config.QUESTION_TYPE_TEXT;
    }
    else {
        questionType = event.data.questionType;
    }
    inputData = ModelManager.extendExperiment(clickedNode.parentNode, undefined, stepType, questionType);
    newNode = createNode(this, clickedNode.parentNode, inputData, stepType, questionType);
    newNode.updatePosition(position.x, position.y, true);
    if (clickedNode.previousNode !== undefined) {
        clickedNode.previousNode.nextNode = newNode;
        newNode.previousNode = clickedNode.previousNode;
    }
    clickedNode.previousNode = newNode;
    newNode.nextNode = clickedNode;
    if (clickedNode.parentNode.type === Config.TYPE_SURVEY) {
        firstNodeOfRow = getFirstNodeOfRow(clickedNode);
        updateStepLinks(firstNodeOfRow);
    }
    if (clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        firstNodeOfRow = getFirstNodeOfRow(clickedNode);
        updateQuestionLinks(firstNodeOfRow);
    }
    movePreviousNodes(newNode, false);
    newNode.click();
}

function updateStepLinks(node) {
    let properties = {};
    if (node.nextNode === undefined) {
        return;
    }
    properties.id = node.id;
    properties.nextStepId = node.nextNode.id;
    ModelManager.updateExperiment(properties);
    updateStepLinks(node.nextNode);
}

function updateQuestionLinks(node) {
    let properties = {};
    if (node.nextNode === undefined) {
        return;
    }
    if (node.type !== Config.QUESTION_TYPE_CHOICE) {
        properties.id = node.id;
        properties.nextQuestionId = node.nextNode.id;
        ModelManager.updateExperiment(properties);
    }
    updateQuestionLinks(node.nextNode);
}

function getFirstNodeOfRow(node) {
    if (node.previousNode === undefined) {
        return node;
    }
    return getFirstNodeOfRow(node.previousNode);
}

function movePreviousNodes(node, moveTowardsNode) {
    if (node.previousNode === undefined) {
        return;
    }
    if (moveTowardsNode) {
        node.previousNode.updatePosition(node.previousNode.center.x + Config.NODE_DISTANCE_HORIZONTAL, node.previousNode.center.y, true);
        if (node.nextNode instanceof TimelineNode) {
            for (let childNode of node.previousNode.childNodes) {
                childNode.updatePosition(childNode.center.x + Config.NODE_DISTANCE_HORIZONTAL, childNode.center.y, true);
            }
        }
    }
    else {
        node.previousNode.updatePosition(node.previousNode.center.x - Config.NODE_DISTANCE_HORIZONTAL, node.previousNode.center.y, true);
        if (node.nextNode instanceof TimelineNode) {
            for (let childNode of node.previousNode.childNodes) {
                childNode.updatePosition(childNode.center.x - Config.NODE_DISTANCE_HORIZONTAL, childNode.center.y, true);
            }
        }
    }
    movePreviousNodes(node.previousNode, moveTowardsNode);
}

function moveNextNodes(node, moveTowardsNode) {
    if (node.nextNode === undefined) {
        return;
    }
    if (moveTowardsNode) {
        node.nextNode.updatePosition(node.nextNode.center.x - Config.NODE_DISTANCE_HORIZONTAL, node.nextNode.center.y, true);
        if (node.nextNode instanceof TimelineNode) {
            for (let childNode of node.nextNode.childNodes) {
                childNode.updatePosition(childNode.center.x - Config.NODE_DISTANCE_HORIZONTAL, childNode.center.y, true);
            }
        }
    }
    else {
        node.nextNode.updatePosition(node.nextNode.center.x + Config.NODE_DISTANCE_HORIZONTAL, node.nextNode.center.y, true);
        if (node.nextNode instanceof TimelineNode) {
            for (let childNode of node.nextNode.childNodes) {
                childNode.updatePosition(childNode.center.x + Config.NODE_DISTANCE_HORIZONTAL, childNode.center.y, true);
            }
        }
    }
    moveNextNodes(node.nextNode, moveTowardsNode);
}

function onAddChildNode(event) {
    let clickedNode = event.data.target,
    inputData,
    position = {},
    newNode,
    stepType,
    questionType;

    if (clickedNode.parentNode !== undefined) {
        if (event.data.stepType === undefined && clickedNode.type === Config.TYPE_SURVEY) {
            stepType = Config.STEP_TYPE_INSTRUCTION;
        }
        else {
            stepType = event.data.stepType;
        }
        if (event.data.questionType === undefined && clickedNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            questionType = Config.QUESTION_TYPE_TEXT;
        }
        else {
            questionType = event.data.questionType;
        }
    }
    inputData = ModelManager.extendExperiment(clickedNode, undefined, stepType, questionType);
    newNode = createNode(this, clickedNode, inputData, stepType, questionType);
    position.x = clickedNode.center.x;
    position.y = clickedNode.center.y + Config.NODE_DISTANCE_VERTICAL;
    newNode.updatePosition(position.x, position.y, true);
    clickedNode.hideAddChildButton();
    newNode.click();
}

function onMoveNodeLeft(event) {
    let correspondingNode = event.data.target,
    tempPrevPrevNode,
    tempPrevNode,
    tempCorrNode,
    tempNextNode,
    tempPosition = {},
    firstNodeOfRow,
    movingVectorX = Config.NODE_DISTANCE_HORIZONTAL * -1;

    tempPosition.x = correspondingNode.center.x;
    tempPosition.y = correspondingNode.center.y;
    correspondingNode.updatePosition(correspondingNode.previousNode.center.x, correspondingNode.previousNode.center.y, true);
    correspondingNode.previousNode.updatePosition(tempPosition.x, tempPosition.y, true);

    tempPrevPrevNode = correspondingNode.previousNode.previousNode;
    tempPrevNode = correspondingNode.previousNode;
    tempCorrNode = correspondingNode;
    tempNextNode = correspondingNode.nextNode;

    if (tempPrevPrevNode !== undefined) {
        tempPrevPrevNode.nextNode = tempCorrNode;
    }
    tempCorrNode.previousNode = tempPrevPrevNode;
    tempCorrNode.nextNode = tempPrevNode;
    tempPrevNode.previousNode = tempCorrNode;
    tempPrevNode.nextNode = tempNextNode;
    if (tempNextNode !== undefined) {
        tempNextNode.previousNode = tempPrevNode;
    }

    firstNodeOfRow = getFirstNodeOfRow(correspondingNode);
    if (correspondingNode.parentNode.type === Config.TYPE_SURVEY) {
        updateStepLinks(firstNodeOfRow);
    }
    if (correspondingNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        updateQuestionLinks(firstNodeOfRow);
    }
    correspondingNode.nextNode.click();
    correspondingNode.click();
    if (correspondingNode.childNodes.length !== 0 && correspondingNode.childNodes !== undefined) {
        moveTreeHorizontal(correspondingNode.childNodes[0], movingVectorX, Config.MOVING_MODE_ROW);
    }
}

function onMoveNodeRight(event) {
    let correspondingNode = event.data.target,
    tempPrevNode,
    tempCorrNode,
    tempNextNode,
    tempNextNextNode,
    tempPosition = {},
    firstNodeOfRow,
    movingVectorX = Config.NODE_DISTANCE_HORIZONTAL;

    tempPosition.x = correspondingNode.center.x;
    tempPosition.y = correspondingNode.center.y;
    correspondingNode.updatePosition(correspondingNode.nextNode.center.x, correspondingNode.nextNode.center.y, true);
    correspondingNode.nextNode.updatePosition(tempPosition.x, tempPosition.y, true);

    tempPrevNode = correspondingNode.previousNode;
    tempCorrNode = correspondingNode;
    tempNextNode = correspondingNode.nextNode;
    tempNextNextNode = correspondingNode.nextNode.nextNode;
    if (tempPrevNode !== undefined) {
        tempPrevNode.nextNode = tempNextNode;
    }
    tempNextNode.previousNode = tempPrevNode;
    tempNextNode.nextNode = tempCorrNode;
    tempCorrNode.previousNode = tempNextNode;
    tempCorrNode.nextNode = tempNextNextNode;
    if (tempNextNextNode !== undefined) {
        tempNextNextNode.previousNode = tempCorrNode;
    }

    firstNodeOfRow = getFirstNodeOfRow(correspondingNode);
    if (correspondingNode.parentNode.type === Config.TYPE_SURVEY) {
        updateStepLinks(firstNodeOfRow);
    }
    if (correspondingNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        updateQuestionLinks(firstNodeOfRow);
    }
    correspondingNode.previousNode.click();
    correspondingNode.click();
    if (correspondingNode.childNodes.length !== 0 && correspondingNode.childNodes !== undefined) {
        moveTreeHorizontal(correspondingNode.childNodes[0], movingVectorX, Config.MOVING_MODE_ROW);
    }
}

// TimelineView event callbacks

function onTimelineClicked(event) {
    let correspondingNode = event.data.correspondingNode,
    clickedPosition = event.data.position,
    properties = {
        absoluteStartDaysOffset: event.data.absoluteStartDaysOffset,
        absoluteStartAtHour: event.data.absoluteStartAtHour,
        absoluteStartAtMinute: event.data.absoluteStartAtMinute,
    },
    inputData,
    newNode,
    timeInMin,
    timeSortedChildNodes;

    if (TreeView.currentFocusedNode instanceof TimelineNode || TreeView.currentFocusedNode.parentNode instanceof TimelineNode) {
        inputData = ModelManager.extendExperiment(correspondingNode, properties, undefined, undefined);
        newNode = createNode(this, correspondingNode, inputData, undefined, undefined);
        newNode.updatePosition(clickedPosition.x, clickedPosition.y, true);
        timeInMin = event.data.timeInMin;
        correspondingNode.updateNodeTimeMap(newNode, timeInMin);
        timeSortedChildNodes = correspondingNode.getTimeSortedChildNodes();
        updateNextSurveyIds(timeSortedChildNodes);
        correspondingNode.updateTimelineLength();
        newNode.click();
    }
}

function updateNextSurveyIds(timeSortedChildNodes) {
    let properties = {};
    for (let i = 0; i < timeSortedChildNodes.length; i++) {
        properties.id = timeSortedChildNodes[i].id;
        if (i !== timeSortedChildNodes.length - 1) {
            properties.nextSurveyId = timeSortedChildNodes[i + 1].id;
        }
        else {
            properties.nextSurveyId = undefined;
        }
        ModelManager.updateExperiment(properties);
        if (i === 0) {
            timeSortedChildNodes[i].nextNode = timeSortedChildNodes[i + 1];
            timeSortedChildNodes[i].previousNode = undefined;
        }
        else if (i === timeSortedChildNodes.length - 1) {
            timeSortedChildNodes[i].previousNode = timeSortedChildNodes[i - 1];
            timeSortedChildNodes[i].nextNode = undefined;
        }
        else {
            timeSortedChildNodes[i].nextNode = timeSortedChildNodes[i + 1];
            timeSortedChildNodes[i].previousNode = timeSortedChildNodes[i - 1];
        }
    }
}

// InputView event callbacks

function onRemoveNode(event) {
    let nodeToRemove = event.data.correspondingNode,
    experiment = Storage.load(),
    inputData = ModelManager.getDataFromNodeId(nodeToRemove.id, experiment),
    firstNodeOfRow,
    timeSortedChildNodes,
    nextFocusedNode,
    childIds = [];

    getChildIds(nodeToRemove, childIds);
    ModelManager.shortenExperiment(nodeToRemove.id, nodeToRemove.parentNode.id, childIds);
    if (nodeToRemove.type === Config.STEP_TYPE_INSTRUCTION) {
        if (inputData.imageFileName !== null && inputData.imageFileName !== undefined) {
            ModelManager.removeResource(inputData.imageFileName);
        }
        if (inputData.videoFileName !== null && inputData.videoFileName !== undefined) {
            ModelManager.removeResource(inputData.videoFileName);
        }
    }
    removeChildResources(nodeToRemove, experiment);
    if (nodeToRemove.parentNode instanceof TimelineNode) {
        nodeToRemove.parentNode.shortenNodeTimeMap(nodeToRemove);
        timeSortedChildNodes = nodeToRemove.parentNode.getTimeSortedChildNodes();
        updateNextSurveyIds(timeSortedChildNodes);
        nodeToRemove.parentNode.updateTimelineLength();
        if (nodeToRemove.nextNode !== undefined) {
            nextFocusedNode = nodeToRemove.nextNode;
        }
        else if (nodeToRemove.previousNode !== undefined) {
            nextFocusedNode = nodeToRemove.previousNode;
        }
        else {
            nextFocusedNode = nodeToRemove.parentNode;
        }
    }
    else {
        if (nodeToRemove.nextNode !== undefined) {
            nodeToRemove.nextNode.previousNode = nodeToRemove.previousNode;
            nextFocusedNode = nodeToRemove.nextNode;
            moveNextNodes(nodeToRemove, true);
            firstNodeOfRow = getFirstNodeOfRow(nodeToRemove.nextNode);
        }
        if (nodeToRemove.previousNode !== undefined) {
            nodeToRemove.previousNode.nextNode = nodeToRemove.nextNode;
            nextFocusedNode = nodeToRemove.previousNode;
            if (nodeToRemove.nextNode === undefined) {
                movePreviousNodes(nodeToRemove, true);
            }
            firstNodeOfRow = getFirstNodeOfRow(nodeToRemove.previousNode);
        }
        if (nodeToRemove.nextNode === undefined && nodeToRemove.previousNode === undefined) {
            nodeToRemove.parentNode.showAddChildButton();
            nextFocusedNode = nodeToRemove.parentNode;
        }
        if (firstNodeOfRow !== undefined) {
            if (nodeToRemove.parentNode.type === Config.TYPE_SURVEY) {
                updateStepLinks(firstNodeOfRow);
            }
            if (nodeToRemove.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                updateQuestionLinks(firstNodeOfRow);
            }
        }
    }
    nodeToRemove.parentNode.childNodes.splice(nodeToRemove.parentNode.childNodes.indexOf(nodeToRemove), 1);
    TreeView.removeNode(nodeToRemove);
    nextFocusedNode.click();
}

function getChildIds(node, childIds) {
    if (node.childNodes.length === 0 || node.childNodes === undefined) {
        return;
    }
    for (let childNode of node.childNodes) {
        childIds.push(childNode.id);
        getChildIds(childNode, childIds);
    }
}

function removeChildResources(node, experiment) {
    let inputData;

    if (node.childNodes.length === 0 || node.childNodes === undefined) {
        return;
    }
    for (let childNode of node.childNodes) {
        inputData = ModelManager.getDataFromNodeId(childNode.id, experiment);
        if (childNode.type === Config.STEP_TYPE_INSTRUCTION) {
            if (inputData.imageFileName !== null && inputData.imageFileName !== undefined) {
                ModelManager.removeResource(inputData.imageFileName);
            }
            if (inputData.videoFileName !== null && inputData.videoFileName !== undefined) {
                ModelManager.removeResource(inputData.videoFileName);
            }
        }
        removeChildResources(childNode, experiment);
    }
}

function onInputChanged(event) {
    let correspondingNode = event.data.correspondingNode,
    experiment = Storage.load(),
    currentModelProperties = ModelManager.getDataFromNodeId(correspondingNode.id, experiment),
    newModelProperties = event.data.newModelProperties,
    timeInMin,
    timeSortedChildNodes,
    fileName;

    if (inputIsValid(this, correspondingNode, correspondingNode.parentNode, newModelProperties, experiment)) {
        newModelProperties.id = correspondingNode.id;
        if (newModelProperties.name !== undefined) {
            correspondingNode.updateDescription(newModelProperties.name);
        }
        if (newModelProperties.text !== undefined && correspondingNode.type === Config.TYPE_ANSWER) {
            correspondingNode.updateDescription(newModelProperties.text);
        }
        if (newModelProperties.absoluteStartDaysOffset !== undefined || newModelProperties.absoluteStartAtHour !== undefined) {
            if (newModelProperties.absoluteStartDaysOffset === undefined) {
                timeInMin = currentModelProperties.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + newModelProperties.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + newModelProperties.absoluteStartAtMinute * 1;
            }
            else {
                timeInMin = newModelProperties.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + currentModelProperties.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + currentModelProperties.absoluteStartAtMinute * 1;
            }
            correspondingNode.parentNode.updateNodeTimeMap(correspondingNode, timeInMin);
            timeSortedChildNodes = correspondingNode.parentNode.getTimeSortedChildNodes();
            updateNextSurveyIds(timeSortedChildNodes);
            correspondingNode.parentNode.updateTimelineLength();
        }
    
        if (correspondingNode.type === Config.STEP_TYPE_INSTRUCTION) {
            if (newModelProperties.imageFileName !== undefined) {
                fileName = newModelProperties.imageFileName;
            }
            if (newModelProperties.videoFileName !== undefined){
                fileName = newModelProperties.videoFileName;
            }
            if (fileName !== undefined && fileName !== null) {
                if (!ModelManager.addResource(fileName, event.data.base64String)) {
                    // TODO: Alert, that another file with the same file name already exists
                    // InputView: Set file inputs values to null and display them
                }
                else {
                    ModelManager.updateExperiment(newModelProperties);
                }
            }
            else {
                ModelManager.updateExperiment(newModelProperties);
            }
            if (fileName === null) {
                ModelManager.removeResource(event.data.previousFileName);
            }
        }
        else {
            ModelManager.updateExperiment(newModelProperties);
        }
    
        WhereAmIView.update(this.currentSelection);
    }
}

function inputIsValid(that, node, parentNode, newInput, experiment) {
    let nodeData = ModelManager.getDataFromNodeId(node.id, experiment),
    nextNodeData,
    parentData,
    newTimeInMin,
    timeInMin,
    timeWindow = {},
    rootNode = getRootNode(node),
    alert,
    invalidInput,
    isValid = true;

    if (parentNode !== undefined) {
        parentData = ModelManager.getDataFromNodeId(parentNode.id, experiment);
    }
    if (node.nextNode !== undefined) {
        nextNodeData = ModelManager.getDataFromNodeId(node.nextNode.id, experiment);
    }
    if (node.type === Config.TYPE_EXPERIMENT_GROUP) {
        if (newInput.name !== undefined) {
            for (let group of parentData.groups) {
                if (group.name === newInput.name && group !== nodeData) {
                    invalidInput = "name";
                    alert = Config.EXPERIMENT_GROUP_NAME_NOT_UNIQUE;
                    isValid = false;
                    break;
                }
            }
        }
    }
    else if (node.type === Config.TYPE_SURVEY) {
        if (newInput.name !== undefined) {
            for (let survey of parentData.surveys) {
                if (survey.name === newInput.name && survey !== nodeData) {
                    invalidInput = "name";
                    alert = Config.SURVEY_NAME_NOT_UNIQUE;
                    isValid = false;
                    break;
                }
            }
        }
        // TODO: Alert also shows when only hours got typed or when minutes with a 0 value as first character got typed
        if (newInput.absoluteStartDaysOffset !== undefined
            || newInput.absoluteStartAtHour !== undefined
            || newInput.absoluteStartAtMinute !== undefined) {

            if (newInput.absoluteStartDaysOffset !== undefined) {
                newTimeInMin = newInput.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nodeData.absoluteStartAtMinute;
            }
            if (newInput.absoluteStartAtHour !== undefined) {
                newTimeInMin = nodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + newInput.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nodeData.absoluteStartAtMinute;
            }
            if (newInput.absoluteStartAtMinute !== undefined) {
                newTimeInMin = nodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + newInput.absoluteStartAtMinute;
            }
            for (let survey of parentData.surveys) {
                if (survey !== nodeData) {
                    timeInMin = survey.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + survey.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + survey.absoluteStartAtMinute;
                    timeWindow.start = timeInMin - nodeData.maxDurationInMin - nodeData.notificationDurationInMin;
                    timeWindow.end = timeInMin + survey.maxDurationInMin + survey.notificationDurationInMin;
                    if (newTimeInMin >= timeWindow.start && newTimeInMin <= timeWindow.end) {
                        alert = Config.SURVEY_OVERLAPS;
                        if (newInput.absoluteStartDaysOffset !== undefined) {
                            invalidInput = "absolutesStartDaysOffset";
                        }
                        else {
                            invalidInput = "absoluteStartAtHour";
                        }
                        isValid = false;
                    }
                }
            }
        }
        if (nextNodeData !== undefined) {
            if (newInput.maxDurationInMin !== undefined || newInput.notificationDurationInMin !== undefined) {
                timeInMin = nextNodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nextNodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nextNodeData.absoluteStartAtMinute;
                newTimeInMin = nodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nodeData.absoluteStartAtMinute;
    
                if (newInput.maxDurationInMin !== undefined) {
                    if (newTimeInMin + nodeData.notificationDurationInMin + newInput.maxDurationInMin >= timeInMin) {
                        invalidInput = "maxDurationInMin";
                        alert = Config.SURVEY_OVERLAPS;
                        isValid = false;
                    }
                }
                else {
                    if (newTimeInMin + newInput.notificationDurationInMin + nodeData.maxDurationInMin >= timeInMin) {
                        invalidInput = "notificationDurationInMin";
                        alert = Config.SURVEY_OVERLAPS;
                        isValid = false;
                    }
                }
            }
        }
    }
    else if (node.type === Config.STEP_TYPE_INSTRUCTION) {
        if (newInput.header !== undefined) {
            if (newInput.header.length > Config.INSTRUCTION_HEADER_MAX_LENGTH) {
                invalidInput = "header";
                alert = Config.INPUT_TOO_LONG;
                isValid = false;
            }
        }
        if (newInput.text !== undefined) {
            if (nodeData.imageFileName !== null || nodeData.videoFileName !== null) {
                if (newInput.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                    invalidInput = "text";
                    alert = Config.INPUT_TOO_LONG;
                    isValid = false;
                }
            }
            else {
                if (newInput.text.length > Config.INSTRUCTION_TEXT_MAX_LENGTH) {
                    invalidInput = "text";
                    alert = Config.INPUT_TOO_LONG;
                    isValid = false;
                }
            }
        }
        if ((newInput.imageFileName !== undefined && newInput.imageFileName !== null)
            || (newInput.videoFileName !== undefined && newInput.videoFileName !== null)) {
                if (nodeData.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                    invalidInput = "text";
                    alert = Config.INPUT_TOO_LONG_WITH_RESOURCE;
                    isValid = false;
                }
        }
        if (newInput.waitingText !== undefined) {
            if (newInput.waitingText.length > Config.INSTRUCTION_WAITING_TEXT_MAX_LENGTH) {
                invalidInput = "waitingText";
                alert = Config.INPUT_TOO_LONG;
                isValid = false;
            }
        }
    }
    else if (node.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
        if (newInput.durationInMin !== undefined) {
            if (newInput.durationInMin > Config.BREATHING_EXERCISE_MAX_DURATION) {
                invalidInput = "durationInMin";
                alert = Config.BREATHING_EXERCISE_DURATION_TOO_LONG;
                isValid = false;
            }
        }
    }
    else if (node.parentNode !== undefined && node.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        if (newInput.name !== undefined) {
            for (let question of parentData.questions) {
                if (question.name === newInput.name && question !== nodeData) {
                    invalidInput = "name";
                    alert = Config.QUESTION_NAME_NOT_UNIQUE;
                    isValid = false;
                    break;
                }
            }
        }
        if (node.type === Config.QUESTION_TYPE_LIKERT) {
            if (newInput.scaleMinimumLabel !== undefined || newInput.scaleMaximumLabel !== undefined) {
                for (let key in newInput) {
                    if (Object.prototype.hasOwnProperty.call(newInput, key)) {
                        if (newInput[key].length > Config.LIKERT_QUESTION_SCALE_LABEL_TEXT_MAX_LENGTH) {
                            invalidInput = key;
                            alert = Config.INPUT_TOO_LONG;
                            isValid = false;
                        }
                    }
                }
            }
            if (newInput.initialValue !== undefined) {
                if (newInput.initialValue > nodeData.itemCount) {
                    invalidInput = "initialValue";
                    alert = Config.LIKERT_SCALE_INITIAL_VALUE_NOT_IN_RANGE;
                    isValid = false;
                }
            }
        }
        if (node.type === Config.QUESTION_TYPE_POINT_OF_TIME) {
            if (newInput.pointOfTimeTypes !== undefined) {
                if (newInput.pointOfTimeTypes.length === 0) {
                    invalidInput = Config.TYPE_QUESTION;
                    alert = Config.POINT_OF_TIME_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                    isValid = false;
                }
            }
        }
        if (node.type === Config.QUESTION_TYPE_TIME_INTERVAL) {
            if (newInput.timeIntervalTypes !== undefined) {
                if (newInput.timeIntervalTypes.length === 0) {
                    invalidInput = Config.TYPE_QUESTION;
                    alert = Config.TIME_INTERVAL_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                    isValid = false;
                }
            }
        }
    }
    else if (node.type === Config.TYPE_ANSWER) {
        if (newInput.code !== undefined) {
            for (let answer of parentData.answers && answer !== nodeData) {
                if (answer.code === newInput.code) {
                    invalidInput = "code";
                    alert = Config.ANSWER_CODE_NOT_UNIQUE;
                    isValid = false;
                    break;
                }
            }
        }
    }
    if (!isValid) {
        InputView.showAlert(alert);
        InputView.disableInputsExcept(invalidInput);
        disableNodeActions(that, rootNode);
        // TODO
        //TreeView.hideSaveLoadButtons();
    }
    else {
        InputView.hideAlert();
        InputView.enableInputs();
        enableNodeActions(that, rootNode);
        // TODO
        //TreeView.showSaveLoadButtons();
    }
    return isValid;
}

function disableNodeActions(that, node) {
    if (node === undefined) {
        return;
    }
    node.setIsClickable(false);
    for (let childNode of node.childNodes) {
        disableNodeActions(that, childNode);
    }
}

function enableNodeActions(that, node) {
    if (node === undefined) {
        return;
    }
    node.setIsClickable(true);
    for (let childNode of node.childNodes) {
        enableNodeActions(that, childNode);
    }
}

// Whole page events

function onKeyUp(event) {
    let childNode;
    if (TreeView.currentFocusedNode !== undefined) {
        if (event.key === "ArrowLeft") {
            if (TreeView.currentFocusedNode.previousNode !== undefined) {
                TreeView.currentFocusedNode.previousNode.click();
            }
        }
        else if (event.key === "ArrowRight") {
            if (TreeView.currentFocusedNode.nextNode !== undefined) {
                TreeView.currentFocusedNode.nextNode.click();
            }
        }
        else if (event.key === "ArrowUp") {
            if (TreeView.currentFocusedNode.parentNode !== undefined) {
                TreeView.currentFocusedNode.parentNode.click();
            }
        }
        else if (event.key === "ArrowDown") {
            if (TreeView.currentFocusedNode.childNodes[0] !== undefined) {
                childNode = getNearestChildNode(TreeView.currentFocusedNode);
                childNode.click();
            }
        }
        else {
            // No event for other keys
        }
    }
}

function getNearestChildNode(node) {
    let minDistance = Math.abs(node.childNodes[0].center.x - node.center.x),
    nearestChildNode = node.childNodes[0];

    for (let i = 1; i < node.childNodes.length; i++) {
        if (Math.abs(node.childNodes[i].center.x - node.center.x) < minDistance) {
            minDistance = Math.abs(node.childNodes[i].center.x - node.center.x);
            nearestChildNode = node.childNodes[i];
        }
    }
    return nearestChildNode;
}

export default new Controller();