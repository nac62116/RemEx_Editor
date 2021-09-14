import TreeViewManager from "./TreeViewManager.js";
import InputViewManager from "./InputViewManager.js";
import ModelManager from "./ModelManager.js";
import IdManager from "./IdManager.js";
import Config from "../utils/Config.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO: Input checks:
// - Defining max characters for several input fields
// - Input fields that allow only one type or type check after input
// - Format checks inside the views input fields (Delete the ones without usage in the model)

// ENHANCEMENT: Calculate the optimal duration for a survey depending on its 

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

        experiment = ModelManager.initExperiment();
        TreeViewManager.initTreeView(this.nodeViewEventListener, experiment);
        InputViewManager.initInputView(this.inputViewEventListener);
        // InfoViewManager.initInfoView();
    }
}

// Node events

function onNodeMouseEnter(event) {
    let hoveredNode = event.data.target,
    inputData = ModelManager.getDataFromNode(hoveredNode);
    
    TreeViewManager.emphasizeNode(hoveredNode);
    InputViewManager.showInputView(hoveredNode, inputData, false);
    // InfoView -> show Info
}

function onNodeMouseLeave(event) {
    let hoveredNode = event.data.target;
    
    TreeViewManager.deemphasizeNode(hoveredNode);
    InputViewManager.showFocusedInputView();
    // InfoView -> show last focused info
}

function onNodeClicked(event) {
    let clickedNode = event.data.target,
    inputData = ModelManager.getDataFromNode(clickedNode),
    newNode,
    newNodeProperties = {},
    newModelProperties = {},
    id;
    
    TreeViewManager.focusNode(clickedNode);
    if (clickedNode.childNodes.length === 0) {
        if (clickedNode.type === Config.TYPE_EXPERIMENT) {

            id = getNewId(Config.TYPE_EXPERIMENT_GROUP);

            newModelProperties = getNewModelProperties(Config.TYPE_EXPERIMENT_GROUP);
            ModelManager.extendExperiment(id, Config.TYPE_EXPERIMENT_GROUP, newModelProperties);

            newNodeProperties = getNewNodeProperties(Config.TYPE_EXPERIMENT_GROUP, clickedNode, undefined, undefined);
            newNode = TreeViewManager.createNode(id, this.nodeViewEventListener, newNodeProperties);

            TreeViewManager.insertNode(newNode, undefined);
        }
        else if (clickedNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            // TODO 
        }
        else {
            throw "TypeError: The node type \"" + clickedNode.type + "\" is not defined.";
        }
    }
    else {
        // No need to create a new childNode as the clicked node already got one or more
    }
    InputViewManager.showInputView(clickedNode, inputData, true);
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
    ModelManager.extendExperiment(id, Config.TYPE_EXPERIMENT_GROUP, newModelProperties);
    newNode = TreeViewManager.createNode(id, this.nodeViewEventListener, newNodeProperties);

    TreeViewManager.insertNode(newNode, insertionType);
    TreeViewManager.clickNode(newNode);
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

// InputView event callbacks

function onRemoveNode(event) {
    let nodeToRemove = event.data.correspondingNode,
    nextFocusedNode;

    IdManager.removeId(nodeToRemove.id, nodeToRemove.type);
    ModelManager.shortenExperiment(nodeToRemove.id, nodeToRemove.type);
    nextFocusedNode = TreeViewManager.removeNode(nodeToRemove);
    TreeViewManager.clickNode(nextFocusedNode);
}

function onInputChanged(event) {
    let correspondingNode = event.data.correspondingNode,
    id = correspondingNode.id,
    type = correspondingNode.type,
    newModelProperties = event.data.newProperties,
    newDescription = ModelManager.updateExperiment(id, type, newModelProperties),
    inputData;

    TreeViewManager.updateDescription(correspondingNode, newDescription);

    inputData = ModelManager.getDataFromNode(correspondingNode);
    InputViewManager.updateFocusedInputView(inputData);
}

export default new Controller();