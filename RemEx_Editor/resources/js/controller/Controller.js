/* eslint-env broswer */

import Config from "../utils/Config.js";
import NodeView from "../views/NodeView.js";
import TreeView from "../views/TreeView.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO: Input checks:
// - Checking if bad characters like ", {}, etc. are automatically escaped
// - Defining max characters for several input fields
// - Input fields that allow only one type or type check after input
// - Format checks inside the views input fields (Delete the ones without usage in the model)

// ENHANCEMENT: Calculate the optimal duration for a survey depending on its steps

class Controller {

    init() {
        let treeViewContainerElement,
        experiment;

        // TODO: Get experiment from local storage
        experiment = null;

        // Init TreeView
        treeViewContainerElement = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID);
        TreeView.init(treeViewContainerElement);
        
        // TODO: Init InputView
        
        // TODO: Init InfoView

        createInitialNodes(experiment);
    }
    
}

function createInitialNodes(experiment) {
    let node;
    if (experiment === null) {
        node = createNode(Config.NODE_TYPE_NEW_EXPERIMENT);
        TreeView.insertExperimentNode(node);
    }
}

function createNode(type) {
    let node;
    if (type === Config.NODE_TYPE_NEW_EXPERIMENT) {
        node = new NodeView(null, null, type, Config.NODE_TYPE_NEW_EXPERIMENT_DESCRIPTION);
    }
    node.addEventListener(Config.EVENT_NODE_MOUSE_ENTER, onNodeMouseEnter);
    node.addEventListener(Config.EVENT_NODE_MOUSE_LEAVE, onNodeMouseLeave);
    node.addEventListener(Config.EVENT_NODE_CLICKED, onNodeClicked);
    node.addEventListener(Config.EVENT_NODE_START_DRAG, onNodeStartDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DRAG, onNodeDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DROP, onNodeDrop);
    return node;
}

function onNodeMouseEnter(event) {
    // InputView -> show inputFields
    // InfoView -> show Info
}

function onNodeMouseLeave(event) {
    // InputView -> show focused inputFields
    // InfoView -> show focused Info
}

function onNodeClicked(event) {
    // TreeView -> Defocus all other nodes in the same row
    // If type new -> InputView -> show editable inputFields
    // else -> TreeView -> create/show Subnodes
}

function onNodeStartDrag(event) {
    // TreeView -> Make all other items unfocusable
    // TreeView -> Bring this node to front
}

function onNodeDrag(event) {
    // TreeView -> create empty spaces inside the current row
}

function onNodeDrop(event) {
    // TreeView -> check for valid dropzone -> if valid (updatePosition(x, y, true))
    // -> if not valid (returnToLastStaticPosition)
    // -> Make all other items focusable
}

export default new Controller();