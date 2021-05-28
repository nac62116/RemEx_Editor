/* eslint-env broswer */

import Config from "../utils/Config.js";
import ExperimentInputView from "../views/InputView/ExperimentInputView.js";
import NodeView from "../views/NodeView.js";
import TreeView from "../views/TreeView.js";
import Storage from "../utils/Storage.js";
import Experiment from "../model/Experiment.js";

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

        // Init TreeView
        TreeView.init();
        
        // TODO: Init InputViews
        this.focusedInputView = undefined;
        this.focusedInputViewData = undefined;
        this.inputViews = [];
        ExperimentInputView.init();
        ExperimentInputView.addEventListener(Config.EVENT_INPUT_CHANGED, onInputChanged.bind(this));
        this.inputViews.push(ExperimentInputView);

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

        createInitialExperiment(this);
    }
    
}

function createInitialExperiment(that) {
    let node,
    nodeProperties = {},
    experiment;

    // TODO: Remove this
    Storage.clear();

    experiment = Storage.load();

    if (experiment === undefined) {
        experiment = new Experiment();
        experiment.name = Config.NEW_EXPERIMENT_DESCRIPTION;
        Storage.save(experiment);
        nodeProperties.id = null;
        nodeProperties.parentOutputPoint = null;
        nodeProperties.type = Config.TYPE_EXPERIMENT;
        nodeProperties.description = Config.NEW_EXPERIMENT_DESCRIPTION;
        node = createNode(that, nodeProperties);
        TreeView.insertNode(node);
    }
    else {
        // TODO: Create all nodes from the current experiment
    }
}

function createNode(that, nodeProperties) {
    let node;
    node = new NodeView(nodeProperties.id, nodeProperties.parentOutputPoint, nodeProperties.type, nodeProperties.description);
    node.addEventListener(Config.EVENT_NODE_MOUSE_ENTER, onNodeMouseEnter.bind(that));
    node.addEventListener(Config.EVENT_NODE_MOUSE_LEAVE, onNodeMouseLeave.bind(that));
    node.addEventListener(Config.EVENT_NODE_CLICKED, onNodeClicked.bind(that));
    node.addEventListener(Config.EVENT_NODE_START_DRAG, onNodeStartDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DRAG, onNodeDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DROP, onNodeDrop);
    return node;
}

// Node events

function onNodeMouseEnter(event) {
    let node = event.data.target,
    inputData = getInputData(node.getType(), node.getId());
    node.emphasize();
    showInputView(this, node.getType(), inputData, false);
    // InfoView -> show Info
}

function onNodeMouseLeave(event) {
    let node = event.data.target;

    node.deemphasize();
    for (let inputView of this.inputViews) {
        inputView.hide();
    }
    if (this.focusedInputView !== undefined) {
        this.focusedInputView.show(this.focusedInputViewData);
    }
    //InputView.hide();
    //InputView.showLastFocus();
    // InfoView -> show last focused info
}

function onNodeClicked(event) {
    let node = event.data.target,
    inputData = getInputData(node.getType(), node.getId());

    for (let inputView of this.inputViews) {
        inputView.hide();
    }
    showInputView(this, node.getType(), inputData, true);

    TreeView.defocusNodes(node.getType());
    node.focus();
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

// Node events helper functions

function getInputData(type, id) {
    let data = {},
    experiment = Storage.load();;
    if (type === Config.TYPE_EXPERIMENT) {
        data.experimentName = experiment.name;
        return data;
    }
    else {
        // Get input data from current experiment
    }
}

function showInputView(that, type, inputData, focus) {
    if (type === Config.TYPE_EXPERIMENT) {
        ExperimentInputView.show(inputData);
        if (focus) {
            that.focusedInputView = ExperimentInputView;
            that.focusedInputViewData = inputData;
        }
    }
}

// InputView events

function onRemoveButtonClicked(event) {
    
}

function onInputChanged(event) {
    let experiment = Storage.load(),
    description;
    if (event.data.type === Config.TYPE_EXPERIMENT) {
        experiment.name = event.data.experimentName;
        description = event.data.experimentName;
    }
    Storage.save(experiment);
    this.focusedInputViewData = event.data;
    TreeView.updateNodeDescription(event.data.type, event.data.id, description);
}

export default new Controller();