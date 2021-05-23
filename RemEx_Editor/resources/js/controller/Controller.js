/* eslint-env broswer */

import Config from "../utils/Config.js";
import InputView from "../views/InputView.js";
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
        inputViewContainerElement,
        experiment;

        // TODO: Get experiment from local storage / Update local storage experiment with each input
        // Handle the image and video file sizes
        experiment = null;

        // Init TreeView
        treeViewContainerElement = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID);
        TreeView.init(treeViewContainerElement);
        
        // TODO: Init InputView
        inputViewContainerElement = document.querySelector("#" + Config.INPUT_VIEW_CONTAINER_ID);
        InputView.init(inputViewContainerElement);

        /* Test section:
        let newExperimentNode = new NodeView(null, null, Config.NODE_TYPE_NEW_EXPERIMENT, Config.NODE_TYPE_NEW_EXPERIMENT_DESCRIPTION);
        addListener(newExperimentNode);
        TreeView.insertNode(newExperimentNode);
        let newStepNode = new NodeView(null, newExperimentNode.getBottom(), Config.NODE_TYPE_NEW_STEP, Config.NODE_TYPE_NEW_STEP_DESCRIPTION);
        addListener(newStepNode);
        TreeView.insertNode(newStepNode);
        let newQuestionNode = new NodeView(null, newStepNode.getBottom(), Config.NODE_TYPE_QUESTION, Config.NODE_TYPE_NEW_QUESTION_DESCRIPTION);
        addListener(newQuestionNode);
        TreeView.insertNode(newQuestionNode);
        */

        // TODO: Init InfoView

        createInitialExperiment(experiment);
    }
    
}

// Test section:
function addListener(node) {
    node.addEventListener(Config.EVENT_NODE_MOUSE_ENTER, onNodeMouseEnter);
    node.addEventListener(Config.EVENT_NODE_MOUSE_LEAVE, onNodeMouseLeave);
    node.addEventListener(Config.EVENT_NODE_CLICKED, onNodeClicked);
    node.addEventListener(Config.EVENT_NODE_START_DRAG, onNodeStartDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DRAG, onNodeDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DROP, onNodeDrop);
}
//

function createInitialExperiment(experiment) {
    let node;
    if (experiment === null) {
        node = createNode(Config.NODE_TYPE_NEW_EXPERIMENT);
        TreeView.insertNode(node);
    }
    else {
        // TODO: Create all nodes from the current experiment
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

// Node events

function onNodeMouseEnter(event) {
    event.data.target.emphasize();
    InputView.show(event.data.target.getType(), null);
    // InputView -> show inputFields
    // InfoView -> show Info
}

function onNodeMouseLeave(event) {
    event.data.target.deemphasize();
    InputView.hide();
    // InputView -> show deepest focused node
    // InfoView -> show deepest focused info
}

function onNodeClicked(event) {
    TreeView.defocusNodes(event.data.target.getType());
    event.data.target.focus();
    // TreeView -> center the clicked node and move all other nodes of the same row in x and y direction and nodes of different rows just in y direction
    // TreeView -> remove all subnodes by type
    // If type new -> InputView -> show editable inputFields
    // else -> Controller -> create subnodes with model and target.getId() -> TreeView -> insert those Subnodes
}

function onNodeStartDrag(event) {
    // TreeView -> Make all other items unfocusable
    // TreeView -> Bring this node to front
}

function onNodeDrag(event) {
    // TreeView -> create empty spaces inside the current row
}

function onNodeDrop(event) {
    // Test section:
    event.data.target.returnToLastStaticPosition();
    //

    // TreeView -> check for valid dropzone -> if valid (updatePosition(x, y, true))
    // -> if not valid (returnToLastStaticPosition)
    // -> Make all other items focusable
}

// InputView events

function onEditButtonClicked(event) {

}

function onRemoveButtonClicked(event) {
    
}

function onCreateButtonClicked(event) {
    
}

export default new Controller();