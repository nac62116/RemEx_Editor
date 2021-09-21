import TreeView from "../views/treeView/TreeView.js";
import TimelineView from "../views/treeView/TimelineView.js";
import InputViewManager from "./InputViewManager.js";
import ModelManager from "./ModelManager.js";
import IdManager from "./IdManager.js";
import Config from "../utils/Config.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO:
// -> Finish Tree and InputView
// -> WhereAmIView
// -> InfoView
// -> Up and download experiment.json
// -> Input checks:
// --- Defining max characters for several input fields
// --- Input fields that allow only one type or type check after input
// --- Format checks inside the views input fields (Delete the ones without usage in the model)
// -> Copy paste option
// -> Code cleaning
// (-> Tree spacing)
// (-> Colors and style)

// ENHANCEMENT: 
// - Calculate the optimal duration for a survey depending on its 

class Controller {

    init() {
        let experiment;
        
        this.nodeViewEventListener = [
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
                eventType: Config.EVENT_ADD_NODE,
                callback: onAddNode.bind(this),
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

        experiment = ModelManager.initExperiment();
        TreeView.init(this.nodeViewEventListener, experiment);
        TimelineView.init(undefined);
        InputViewManager.initInputViews(this.inputViewEventListener);
        // InfoViewManager.initInfoView();
        document.addEventListener("keyup", onKeyUp.bind(this));
    }
}

// Node events

function onNodeMouseEnter(event) {
    let hoveredNode = event.data.target,
    inputData = ModelManager.getDataFromNode(hoveredNode);
    
    TreeView.emphasizeNode(hoveredNode);
    InputViewManager.showInputView(hoveredNode, inputData, false);
    // InfoView -> show Info
}

function onNodeMouseLeave(event) {
    let hoveredNode = event.data.target;
    // InputViewManager -> Enable input
    TreeView.deemphasizeNode(hoveredNode);
    InputViewManager.showFocusedInputView();
    InputViewManager.selectInputField();
    // InfoView -> show last focused info
}

function onNodeClicked(event) {
    let clickedNode = event.data.target,
    inputData = ModelManager.getDataFromNode(clickedNode),
    newNode,
    newNodeProperties = {},
    newModelProperties = {},
    timelinePosition = {},
    id;
    
    if (clickedNode.childNodes.length === 0) {
        if (clickedNode.type === Config.TYPE_EXPERIMENT) {
            
            id = getNewId(Config.TYPE_EXPERIMENT_GROUP);
            
            newModelProperties = getNewModelProperties(Config.TYPE_EXPERIMENT_GROUP);
            ModelManager.extendExperiment(id, Config.TYPE_EXPERIMENT_GROUP, newModelProperties);
            
            newNodeProperties = getNewNodeProperties(Config.TYPE_EXPERIMENT_GROUP, clickedNode, undefined, undefined);
            newNode = TreeView.createNode(id, this.nodeViewEventListener, newNodeProperties);
            TreeView.insertNode(newNode, undefined);
            TimelineView.hide();
        }
        else if (clickedNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            TimelineView.init(clickedNode);
            TreeView.insertTimeline(TimelineView.timelineElement);
            timelinePosition.x = clickedNode.center.x;
            timelinePosition.y = clickedNode.center.y + Config.TREE_VIEW_ROW_DISTANCE;
            TimelineView.updatePosition(timelinePosition.x, timelinePosition.y);
            TimelineView.rescale();
            TimelineView.show();
        }
        else {
            throw "TypeError: The node type \"" + clickedNode.type + "\" is not defined.";
        }
    }
    else {
        if (clickedNode.type === Config.TYPE_EXPERIMENT) {
            TimelineView.hide();
        }
        // In the case of clickedNode.type === Config.TYPE_EXPERIMENT_GROUP, the TimelineView has to be updated and the childNodes inserted.
        else if (clickedNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            TimelineView.init(clickedNode);
            TreeView.insertTimeline(TimelineView.timelineElement);
            timelinePosition.x = clickedNode.center.x;
            timelinePosition.y = clickedNode.center.y + Config.TREE_VIEW_ROW_DISTANCE;
            TimelineView.updatePosition(timelinePosition.x, timelinePosition.y);
            for (let surveyNode of clickedNode.childNodes) {
                TimelineView.insertSurveyNode(surveyNode);
            }
            TimelineView.rescale();
            TimelineView.show();
        }
        else {
            // No need to create a new childNode as the clicked node already got one or more
        }
    }
    TreeView.focusNode(clickedNode);
    TreeView.emphasizeNode(clickedNode);
    // InputViewManager -> Enable input
    InputViewManager.showInputView(clickedNode, inputData, true);
    InputViewManager.selectInputField();
}

function onNodeStartDrag() {
    // TreeView -> Make all other items unfocusable
    // TreeView -> Bring this node to front
}

function onNodeDrag() {
    // TreeView -> create empty spaces inside the current row
}

function onNodeDrop() {

    // TreeView -> check for valid dropzone -> if valid (updatePosition(x, y, true))
    // -> if not valid (returnToLastStaticPosition)
    // -> Make all other items focusable
}

function onAddNode(event) {
    let clickedNode = event.data.target,
    insertionType = event.data.insertionType,
    id = getNewId(clickedNode.type),
    newModelProperties = getNewModelProperties(clickedNode.type),
    newNode,
    newNodeProperties;

    if (insertionType === Config.INSERT_AFTER) {
        newNodeProperties = getNewNodeProperties(clickedNode.type, clickedNode.parentNode, clickedNode, clickedNode.nextNode);
    }
    else if (insertionType === Config.INSERT_BEFORE) {
        newNodeProperties = getNewNodeProperties(clickedNode.type, clickedNode.parentNode, clickedNode.previousNode, clickedNode);
    }
    else {
        throw "TypeError: The insertion type \"" + insertionType + "\" is not defined.";
    }
    ModelManager.extendExperiment(id, clickedNode.type, newModelProperties);
    newNode = TreeView.createNode(id, this.nodeViewEventListener, newNodeProperties);

    TreeView.insertNode(newNode, insertionType);
    TreeView.clickNode(newNode);
}

// Node event helper functions

function getNewId(type) {
    let id;

    if (type === Config.TYPE_EXPERIMENT_GROUP ||
        type === Config.TYPE_SURVEY ||
        type === Config.TYPE_BREATHING_EXERCISE ||
        type === Config.TYPE_QUESTIONNAIRE ||
        type === Config.TYPE_INSTRUCTION ||
        type === Config.TYPE_QUESTION) {

        id = IdManager.getUnusedId(type);
    }
    else {
        // No need for an id
    }
    return id;
}

function getNewModelProperties(type) {
    let modelProperties = {};

    if (type === Config.TYPE_EXPERIMENT) {
        modelProperties.name = Config.NEW_EXPERIMENT_NAME;
    }
    else if (type === Config.TYPE_EXPERIMENT_GROUP) {
        modelProperties.name = Config.NEW_EXPERIMENT_GROUP_NAME;
    }
    else if (type === Config.TYPE_SURVEY) {
        modelProperties.name = Config.NEW_SURVEY_NAME;
        modelProperties.isRelative = false;
        modelProperties.relativeStartTimeInMin = null;
        modelProperties.maxDurationInMin = Config.NEW_SURVEY_MAX_DURATION_IN_MIN;
        modelProperties.notificationDurationInMin = Config.NEW_SURVEY_NOTIFICATION_DURATION_IN_MIN;
    }
    // TODO
    else {
        throw "TypeError: The node type \"" + type + "\" is not defined.";
    }
    return modelProperties;
}

function getNewNodeProperties(type, parentNode, previousNode, nextNode) {
    let nodeProperties = {};

    nodeProperties.type = type;
    nodeProperties.parentNode = parentNode;
    nodeProperties.previousNode = previousNode;
    nodeProperties.nextNode = nextNode;
    if (type === Config.TYPE_EXPERIMENT) {
        nodeProperties.description = Config.NEW_EXPERIMENT_NAME;
    }
    else if (type === Config.TYPE_EXPERIMENT_GROUP) {
        nodeProperties.description = Config.NEW_EXPERIMENT_GROUP_NAME;
    }
    // TODO
    else {
        throw "TypeError: The node type \"" + type + "\" is not defined.";
    }

    return nodeProperties;
}

// TimelineView event callbacks

function onTimelineClicked(event) {
    let clickedTime = event.data.time,
    id = getNewId(Config.TYPE_SURVEY),
    nextNode = TimelineView.getNextSurveyNode(clickedTime),
    previousNode = TimelineView.getPreviousSurveyNode(clickedTime),
    parentNode = TimelineView.getParentNode(),
    newNodeProperties = getNewNodeProperties(Config.TYPE_SURVEY, parentNode, previousNode, nextNode),
    newModelProperties = getNewModelProperties(Config.TYPE_SURVEY),
    newNode;

    newModelProperties.absoluteStartAtHour = clickedTime.hour;
    newModelProperties.absoluteStartAtMinute = clickedTime.minute;
    newModelProperties.absoluteStartDaysOffset = clickedTime.day - 1;
    ModelManager.extendExperiment(id, Config.TYPE_SURVEY, newModelProperties);
    newNodeProperties.description = Config.TIMELINE_LABEL_DESCRIPTIONS_PREFIX + " " + clickedTime.day + " " + clickedTime.hour + ":" + clickedTime.minute + " " + Config.TIMELINE_LABEL_DESCRIPTIONS_SUFFIX;
    newNode = TreeView.createNode(id, this.nodeViewEventListener, newNodeProperties);

    TreeView.insertNode(newNode, Config.INSERT_SURVEY);
    TimelineView.insertSurveyNode(newNode);
    TimelineView.rescale();
    TreeView.clickNode(newNode);
    // TimelineView calculate insertPosition and description
    // TreeView create node with type survey and insert it.
}

// InputView event callbacks

function onRemoveNode(event) {
    let nodeToRemove = event.data.correspondingNode,
    nextFocusedNode;

    IdManager.removeId(nodeToRemove.id, nodeToRemove.type);
    ModelManager.shortenExperiment(nodeToRemove.id, nodeToRemove.type);
    nextFocusedNode = TreeView.removeNode(nodeToRemove);
    TreeView.clickNode(nextFocusedNode);
}

function onInputChanged(event) {
    let correspondingNode = event.data.correspondingNode,
    id = correspondingNode.id,
    type = correspondingNode.type,
    newModelProperties = event.data.newProperties,
    newDescription = ModelManager.updateExperiment(id, type, newModelProperties),
    inputData;

    TreeView.updateNodeDescription(correspondingNode, newDescription);

    inputData = ModelManager.getDataFromNode(correspondingNode);
    InputViewManager.updateFocusedInputView(inputData);
}

// Whole page events

function onKeyUp(event) {
    if (event.key === "ArrowLeft") {
        TreeView.moveToPreviousNode();
    }
    else if (event.key === "ArrowRight") {
        TreeView.moveToNextNode();
    }
    else if (event.key === "ArrowUp") {
        TreeView.moveToParentNode();
    }
    else if (event.key === "ArrowDown") {
        TreeView.moveToFirstChildNode();
    }
    else {
        // No event for other keys
    }
}

export default new Controller();