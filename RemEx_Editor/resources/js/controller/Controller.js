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

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO:
// -> IMPORTANT: Fix model update issues
// -> Finish Tree and InputView
// -> InfoView
// -> Up and download experiment.json
// -> Input checks:
// --- Defining max characters for several input fields
// --- Input fields that allow only one type or type check after input
// --- Format checks inside the views input fields (Delete the ones without usage in the model)
// -> Copy paste option
// -> Code cleaning
// (-> Colors and style)

// ENHANCEMENT: 
// - Calculate the optimal duration for a survey depending on its
// - Fullscreen Buttons
// - Survey time randomization

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
                eventType: Config.EVENT_NODE_START_DRAG,
                callback: onNodeStartDrag.bind(this),
            },
            {
                eventType: Config.EVENT_NODE_ON_DRAG,
                callback: onNodeDrag.bind(this),
            },
            {
                eventType: Config.EVENT_NODE_ON_DROP,
                callback: onNodeDrop.bind(this),
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
        experiment = ModelManager.initExperiment();
        newNode = createNode(this, undefined, experiment, undefined, undefined);
        newNode.updatePosition(TreeView.getCenter().x, TreeView.getCenter().y, true);
        
        whereAmIViewContainer.appendChild(whereAmIViewElement);
        WhereAmIView.init(whereAmIViewContainer);

        InputView.init(inputViewContainer);
        InputView.addEventListener(Config.EVENT_INPUT_CHANGED, onInputChanged.bind(this));
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
            elements = SvgFactory.createStandardNodeElements(true, false);
            node = new StandardNode(elements, id, stepType, description, parentNode);
        }
        else if (stepType === Config.STEP_TYPE_QUESTIONNAIRE) {
            elements = SvgFactory.createStandardNodeElements(true, true);
            node = new StandardNode(elements, id, Config.STEP_TYPE_QUESTIONNAIRE, description, parentNode);
        }
        else {
            throw "The step type " + stepType + " is not defined.";
        }
    }
    else if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        if (questionType === Config.QUESTION_TYPE_CHOICE) {
            elements = SvgFactory.createStandardNodeElements(true, true);
            node = new StandardNode(elements, id, Config.QUESTION_TYPE_CHOICE, description, parentNode);
        }
        else if (questionType !== Config.QUESTION_TYPE_CHOICE && questionType !== undefined) {
            elements = SvgFactory.createStandardNodeElements(true, false);
            node = new StandardNode(elements, id, questionType, description, parentNode);
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
    let hoveredNode = event.data.target,
    experiment = Storage.load(),
    modelData = ModelManager.getDataFromNodeId(hoveredNode.id, experiment);

    hoveredNode.emphasize(this.currentSelection);
    if (hoveredNode !== TreeView.currentFocusedNode) {
        InputView.show(hoveredNode, modelData);
    }
    /* inputData = ModelManager.getDataFromNodeId(hoveredNode, experiment);
    // InputViewManager.showInputView(hoveredNode, inputData, false);
    // InfoView -> show Info */
}

function onNodeMouseLeave(event) {
    let hoveredNode = event.data.target,
    experiment = Storage.load(),
    modelData;

    hoveredNode.deemphasize(this.currentSelection);
    if (TreeView.currentFocusedNode !== undefined) {
        modelData = ModelManager.getDataFromNodeId(TreeView.currentFocusedNode.id, experiment);
        InputView.show(TreeView.currentFocusedNode, modelData);
        InputView.selectFirstInput();
    }
    else {
        InputView.hide();
    }
    // InputView.show(inputData, hoveredNode)
    // -> inputData for input fields
    // -> hoveredNode for type, which should be placed right under the header
    // InfoView
}

function onNodeClicked(event) {
    let clickedNode = event.data.target,
    previousFocusedNode = TreeView.currentFocusedNode,
    parentNode = clickedNode.parentNode,
    // experiment = Storage.load(),
    // inputData,
    movingVector = {
        x: undefined,
        y: undefined,
    };

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

function onNodeStartDrag() {
    // TreeView -> Make all other items unfocusable
    // TreeView -> Bring this node to front
}

function onNodeDrag() {
    // TreeView -> create empty spaces inside the current row
}

function onNodeDrop() {
    // TODO: update nextSurveyIds, nextQuestionIds from normal nodes and nextQuestionId from answer node
    // TreeView -> check for valid dropzone -> if valid (updatePosition(x, y, true))
    // -> if not valid (returnToLastStaticPosition)
    // -> Make all other items focusable
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

    if (clickedNode.parentNode.type === Config.TYPE_SURVEY) {
        stepType = Config.STEP_TYPE_BREATHING_EXERCISE;
    }
    if (clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        questionType = Config.QUESTION_TYPE_CHOICE;
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
    if (clickedNode.parentNode.type === Config.TYPE_QUESTIONNAIRE) {
        firstNodeOfRow = getFirstNodeOfRow(clickedNode);
        updateQuestionLinks(firstNodeOfRow);
    }
    moveNextNodes(newNode);
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

    if (clickedNode.parentNode.type === Config.TYPE_SURVEY) {
        stepType = Config.STEP_TYPE_INSTRUCTION;
    }
    if (clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        questionType = Config.QUESTION_TYPE_LIKERT;
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
    if (clickedNode.parentNode.type === Config.TYPE_QUESTIONNAIRE) {
        firstNodeOfRow = getFirstNodeOfRow(clickedNode);
        updateQuestionLinks(firstNodeOfRow);
    }
    movePreviousNodes(newNode);
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
    updateStepLinks(node.nextNode);
}

function getFirstNodeOfRow(node) {
    if (node.previousNode === undefined) {
        return node;
    }
    return getFirstNodeOfRow(node.previousNode);
}

function movePreviousNodes(node) {
    if (node.previousNode === undefined) {
        return;
    }
    node.previousNode.updatePosition(node.previousNode.center.x - Config.NODE_DISTANCE_HORIZONTAL, node.previousNode.center.y, true);
    movePreviousNodes(node.previousNode);
}

function moveNextNodes(node) {
    if (node.nextNode === undefined) {
        return;
    }
    node.nextNode.updatePosition(node.nextNode.center.x + Config.NODE_DISTANCE_HORIZONTAL, node.nextNode.center.y, true);
    moveNextNodes(node.nextNode);
}

function onAddChildNode(event) {
    let clickedNode = event.data.target,
    inputData,
    position = {},
    newNode,
    stepType,
    questionType;

    if (clickedNode.type === Config.TYPE_SURVEY) {
        stepType = Config.STEP_TYPE_QUESTIONNAIRE;
    }
    if (clickedNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        questionType = Config.QUESTION_TYPE_TEXT;
    }
    inputData = ModelManager.extendExperiment(clickedNode, undefined, stepType, questionType);
    newNode = createNode(this, clickedNode, inputData, stepType, questionType);
    position.x = clickedNode.center.x;
    position.y = clickedNode.center.y + Config.NODE_DISTANCE_VERTICAL;
    newNode.updatePosition(position.x, position.y, true);
    clickedNode.hideAddChildButton();
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
        updateNextSurveyIds(timeSortedChildNodes, properties);
        correspondingNode.updateTimelineLength();
    }
}

function updateNextSurveyIds(timeSortedChildNodes, properties) {
    for (let i = 0; i < timeSortedChildNodes.length; i++) {
        if (i !== timeSortedChildNodes.length - 1) {
            properties.id = timeSortedChildNodes[i].id;
            properties.nextSurveyId = timeSortedChildNodes[i + 1].id;
            ModelManager.updateExperiment(properties);
        }
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
    let nodeToRemove = event.data.correspondingNode;

    ModelManager.shortenExperiment(nodeToRemove.id, nodeToRemove.parentNode.id);
    // TODO: Update node linking
    // TODO: Update Timeline incl. nextSurveyIds
    // TODO: Update nextStepIds
    // TODO: Update nextQuestionIds
    // TODO: Get nextFocusedNode and update positions for the right nodes
    // TODO: remove() method in NodeView.js
}

function onInputChanged(event) {
    let correspondingNode = event.data.correspondingNode,
    experiment = Storage.load(),
    currentModelProperties = ModelManager.getDataFromNodeId(correspondingNode.id, experiment),
    newModelProperties = event.data.newModelProperties,
    timeInMin,
    timeSortedChildNodes;

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
        updateNextSurveyIds(timeSortedChildNodes, newModelProperties);
        correspondingNode.parentNode.updateTimelineLength();
    }
    ModelManager.updateExperiment(newModelProperties);

    WhereAmIView.update(this.currentSelection);

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