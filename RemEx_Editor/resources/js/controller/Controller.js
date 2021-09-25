import TreeView from "../views/TreeView.js";
import InputViewManager from "./InputViewManager.js";
import ModelManager from "./ModelManager.js";
import IdManager from "./IdManager.js";
import SvgFactory from "../utils/SvgFactory.js";
import Config from "../utils/Config.js";
import RootNode from "../views/nodeView/RootNode.js";
import TimelineNode from "../views/nodeView/TimelineNode.js";
import DeflateableNode from "../views/nodeView/DeflateableNode.js";

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
        let experiment,
        treeViewContainer = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID),
        treeViewElement = SvgFactory.createTreeViewElement(),
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
        newNode = createNode(this, undefined, experiment);
        newNode.updatePosition(TreeView.getCenter().x, TreeView.getCenter().y, true);

        InputViewManager.initInputViews(this.inputViewEventListener);
        // InfoViewManager.initInfoView();
        document.addEventListener("keyup", onKeyUp.bind(this));
    }
}

function createNode(that, parentNode, data) {
    let id = data.id,
    elements,
    description,
    node;
    if (parentNode === undefined) {
        elements = SvgFactory.createRootNodeElements();
        description = data.name;
        node = new RootNode(elements, id, Config.TYPE_EXPERIMENT, description);
    }
    else if (parentNode.type === Config.TYPE_EXPERIMENT) {
        elements = SvgFactory.createTimelineNodeElements();
        description = data.name;
        node = new TimelineNode(elements, id, Config.TYPE_EXPERIMENT_GROUP, description, parentNode, that.timelineEventListener, TreeView.getWidth());
    }
    else if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
        // TODO: Expandable node
        elements = SvgFactory.createDeflateableNodeElements(false, true);
        description = data.name;
        node = new DeflateableNode(elements, id, Config.TYPE_SURVEY, description, parentNode);
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

function onNodeMouseEnter(/*event*/) {
    /*let hoveredNode = event.data.target,
    experiment = Storage.load(),
    inputData;

    // inputData = ModelManager.getDataFromNodeId(hoveredNode, experiment);
    // InputViewManager.showInputView(hoveredNode, inputData, false);
    // InfoView -> show Info */
}

function onNodeMouseLeave(/*event*/) {
    //let hoveredNode = event.data.target;
    // InputViewManager -> Enable input
    // InputViewManager.showFocusedInputView();
    // InputViewManager.selectInputField();
    // InfoView -> show last focused info
}

function onNodeClicked(event) {
    let clickedNode = event.data.target,
    // experiment = Storage.load(),
    // inputData,
    movingVector = {
        x: undefined,
        y: undefined,
    };

    this.currentSelection = [];
    updateCurrentSelection(this, clickedNode);
    if (clickedNode !== TreeView.currentFocusedNode) {
        if (clickedNode instanceof TimelineNode) {
            clickedNode.updateTimelineLength();
        }
        if (TreeView.currentFocusedNode !== undefined) {
            if (!TreeView.currentFocusedNode.childNodes.includes(clickedNode)) {
                for (let childNode of TreeView.currentFocusedNode.childNodes) {
                    childNode.hide();
                }
            }
            TreeView.currentFocusedNode.defocus(this.currentSelection);
            TreeView.currentFocusedNode.deemphasize();
        }
        TreeView.currentFocusedNode = clickedNode;
        clickedNode.emphasize();
        clickedNode.focus();

        if (clickedNode.parentNode !== undefined) {
            if (clickedNode.parentNode.parentNode !== undefined) {
                for (let childNode of clickedNode.parentNode.parentNode.childNodes) {
                    if (childNode !== clickedNode.parentNode) {
                        childNode.hide();
                    }
                }
            }
        }
        for (let childNode of clickedNode.childNodes) {
            childNode.show();
            hideChildrenBeginningFromNode(childNode);
        }
        showNeighboursBeginningFromNode(clickedNode);
        
        movingVector.x = TreeView.getCenter().x - clickedNode.center.x;
        movingVector.y = TreeView.getCenter().y - clickedNode.center.y;
        moveTree(clickedNode, movingVector);

        // InputViewManager -> Enable input
        // inputData = ModelManager.getDataFromNodeId(clickedNode.id, experiment);
        // InputViewManager.showInputView(clickedNode, inputData, true);
        // InputViewManager.selectInputField();
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

function moveTree(node, movingVector) {
    let rootNode = getRootNode(node);
    rootNode.updatePosition(rootNode.center.x + movingVector.x, rootNode.center.y + movingVector.y, true);
    moveChildNodes(rootNode, movingVector);
}

function getRootNode(node) {
    if (node.parentNode === undefined) {
        return node;
    }
    return getRootNode(node.parentNode);
}

function moveChildNodes(node, movingVector) {
    if (node.childNodes === undefined || node.childNodes.length === 0) {
        return;
    }
    for (let childNode of node.childNodes) {
        childNode.updatePosition(childNode.center.x + movingVector.x, childNode.center.y + movingVector.y, true);
        moveChildNodes(childNode, movingVector);
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

    // TreeView -> check for valid dropzone -> if valid (updatePosition(x, y, true))
    // -> if not valid (returnToLastStaticPosition)
    // -> Make all other items focusable
}

function onAddNextNode(event) {
    let clickedNode = event.data.target,
    inputData = ModelManager.extendExperiment(clickedNode.parentNode, undefined),
    position = {
        x: clickedNode.center.x + Config.NODE_DISTANCE_HORIZONTAL,
        y: clickedNode.center.y,
    },
    newNode;
    newNode = createNode(this, clickedNode.parentNode, inputData);
    newNode.updatePosition(position.x, position.y, true);
    if (clickedNode.nextNode !== undefined) {
        clickedNode.nextNode.previousNode = newNode;
        newNode.nextNode = clickedNode.nextNode;
    }
    clickedNode.nextNode = newNode;
    newNode.previousNode = clickedNode;
    moveNextNodes(newNode);
}

function onAddPreviousNode(event) {
    let clickedNode = event.data.target,
    inputData = ModelManager.extendExperiment(clickedNode.parentNode, undefined),
    position = {
        x: clickedNode.center.x - Config.NODE_DISTANCE_HORIZONTAL,
        y: clickedNode.center.y,
    },
    newNode;

    newNode = createNode(this, clickedNode.parentNode, inputData);
    newNode.updatePosition(position.x, position.y, true);
    if (clickedNode.previousNode !== undefined) {
        clickedNode.previousNode.nextNode = newNode;
        newNode.previousNode = clickedNode.previousNode;
    }
    clickedNode.previousNode = newNode;
    newNode.nextNode = clickedNode;
    movePreviousNodes(newNode);
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
    inputData = ModelManager.extendExperiment(clickedNode, undefined),
    position = {},
    newNode;
    
    newNode = createNode(this, clickedNode, inputData);
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
    inputData = ModelManager.extendExperiment(correspondingNode, properties),
    newNode,
    timeInMin,
    timeSortedChildNodes;

    newNode = createNode(this, correspondingNode, inputData);
    newNode.updatePosition(clickedPosition.x, clickedPosition.y, true);

    timeInMin = event.data.timeInMin;
    correspondingNode.updateTimeNodeMap(timeInMin, newNode);
    timeSortedChildNodes = correspondingNode.getTimeSortedChildNodes();
    for (let i = 0; i < timeSortedChildNodes.length; i++) {
        if (i !== timeSortedChildNodes.length - 1) {
            properties.id = timeSortedChildNodes[i].id;
            properties.nextSurveyId = timeSortedChildNodes[i + 1].id;
            ModelManager.updateExperiment(properties);
        }
        if (i === 0) {
            timeSortedChildNodes[i].nextNode = timeSortedChildNodes[i + 1];
        }
        else if (i === timeSortedChildNodes.length - 1) {
            timeSortedChildNodes[i].previousNode = timeSortedChildNodes[i - 1];
        }
        else {
            timeSortedChildNodes[i].nextNode = timeSortedChildNodes[i + 1];
            timeSortedChildNodes[i].previousNode = timeSortedChildNodes[i - 1];
        }
    }
    correspondingNode.updateTimelineLength();
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

    inputData = ModelManager.getDataFromNodeId(correspondingNode);
    InputViewManager.updateFocusedInputView(inputData);
}

// Whole page events

function onKeyUp(event) {
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
                TreeView.currentFocusedNode.childNodes[0].click();
            }
        }
        else {
            // No event for other keys
        }
    }
}

export default new Controller();