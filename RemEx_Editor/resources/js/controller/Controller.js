/* eslint-env broswer */

import Config from "../utils/Config.js";
import ExperimentInputView from "../views/InputView/ExperimentInputView.js";
import NodeView from "../views/NodeView.js";
import TreeView from "../views/TreeView.js";
import Storage from "../utils/Storage.js";
import Experiment from "../model/Experiment.js";
import ExperimentGroup from "../model/ExperimentGroup.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO: Input checks:
// - Defining max characters for several input fields
// - Input fields that allow only one type or type check after input
// - Format checks inside the views input fields (Delete the ones without usage in the model)

// ENHANCEMENT: Calculate the optimal duration for a survey depending on its steps

class Controller {

    init() {
        let experiment, experimentRootNode;

        // Init TreeView
        TreeView.init();
        
        // TODO: Init InputViews
        this.focusedInputView = undefined;
        this.focusedInputViewData = undefined;
        this.inputViews = [];
        ExperimentInputView.init();
        ExperimentInputView.addEventListener(Config.EVENT_INPUT_CHANGED, onInputChanged.bind(this));
        this.inputViews.push(ExperimentInputView);

        // TODO: Init InfoView

        // TODO: Remove this
        Storage.clear();

        experiment = Storage.load();
        if (experiment === undefined) {
            experiment = createNewExperiment();
        }
        else {
            // Experiment is already created
        }
        experimentRootNode = createInitialExperimentTree(this, experiment);
        TreeView.setInitialTree(experimentRootNode);
    }
    
}

function createNewExperiment() {
    let experiment;

    experiment = new Experiment();
    experiment.name = Config.NEW_EXPERIMENT_DESCRIPTION;
    Storage.save(experiment);

    return experiment;
}

function createNewExperimentGroup(that, experiment) {
    let group = new ExperimentGroup(),
    groupNode,
    nodeProperties = {};

    group.name = Config.NEW_EXPERIMENT_GROUP_DESCRIPTION;
    experiment.groups.push(group);
    Storage.save(experiment);

    nodeProperties.id = null;
    nodeProperties.type = Config.NODE_TYPE_EXPERIMENT_GROUP;
    nodeProperties.description = group.name;
    groupNode = createNode(that, nodeProperties);

    return groupNode;
}

function createInitialExperimentTree(that, experiment) {
    let experimentRootNode,
    groupNode,
    surveyNode,
    stepNode,
    questionNode,
    nodeProperties = {};

    nodeProperties.id = null;
    nodeProperties.type = Config.NODE_TYPE_EXPERIMENT;
    nodeProperties.description = experiment.name;
    experimentRootNode = createNode(that, nodeProperties);
    for (let group of experiment.groups) {
        nodeProperties.type = Config.NODE_TYPE_EXPERIMENT_GROUP;
        nodeProperties.description = group.name;
        groupNode = createNode(that, nodeProperties);
        experimentRootNode.childNodes.push(groupNode);
        for (let survey of group.surveys) {
            // TODO: Create Survey Timeline
            nodeProperties.id = null;
            nodeProperties.type = Config.NODE_TYPE_SURVEY;
            nodeProperties.description = survey.name;
            surveyNode = createNode(that, nodeProperties);
            groupNode.childNodes.push(surveyNode);
            for (let step of survey.steps) {
                nodeProperties.id = step.id;
                nodeProperties.description = step.name;
                if (step.type === Config.STEP_TYPE_INSTRUCTION) {
                    nodeProperties.type = Config.NODE_TYPE_INSTRUCTION;
                }
                else if (step.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
                    nodeProperties.type = Config.NODE_TYPE_BREATHING_EXERCISE;
                }
                else if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    nodeProperties.type = Config.NODE_TYPE_QUESTIONNAIRE;
                }
                else {
                    throw "TreeView: No Node for step type \"" + step.type + "\" is defined.";
                }
                stepNode = createNode(that, nodeProperties);
                surveyNode.childNodes.push(stepNode);
                if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    for (let question of step.questions) {
                        nodeProperties.id = question.id;
                        nodeProperties.type = Config.NODE_TYPE_QUESTION;
                        nodeProperties.description = question.name;
                        questionNode = createNode(that, nodeProperties);
                        stepNode.childNodes.push(questionNode);
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

function createNode(that, nodeProperties) {
    let node;
    if (nodeProperties.description.length >= Config.NODE_DESCRIPTION_MAX_LENGTH) {
        nodeProperties.description = nodeProperties.description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
    }
    node = new NodeView(nodeProperties.id, nodeProperties.type, nodeProperties.description);
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
    inputData = getInputData(node.type, node.id);
    // Node actions
    node.emphasize();
    // InputView actions
    showInputView(this, node, inputData, false);
    // InfoView -> show Info
}

function onNodeMouseLeave(event) {
    let node = event.data.target;
    // Node actions
    node.deemphasize();
    // InputView actions
    for (let inputView of this.inputViews) {
        inputView.hide();
    }
    if (this.focusedInputView !== undefined) {
        this.focusedInputView.show(this.focusedInputViewData);
    }
    // InfoView -> show last focused info
}

function onNodeClicked(event) {
    let node = event.data.target,
    inputData = getInputData(node.type, node.id),
    experiment,
    newNode;
    // TreeView actions
    TreeView.moveTo(node);
    if (node.childNodes.length === 0) {
        experiment = Storage.load();
        if (node.type === Config.NODE_TYPE_EXPERIMENT) {
            newNode = createNewExperimentGroup(this, experiment);
            TreeView.insertExperimentGroupNode(newNode, null, null);
        }
        node.childNodes.push(newNode);
    }
    // InputView actions
    for (let inputView of this.inputViews) {
        inputView.hide();
    }
    showInputView(this, node, inputData, true);
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

// Node events helper functions

function getInputData(type, id) {
    let data = {},
    experiment = Storage.load();
    if (type === Config.NODE_TYPE_EXPERIMENT) {
        data.experimentName = experiment.name;
        return data;
    }
    else {
        // Get input data from current experiment
    }
}

function showInputView(that, node, inputData, focus) {
    if (node.type === Config.NODE_TYPE_EXPERIMENT) {
        ExperimentInputView.show(inputData);
        ExperimentInputView.correspondingNode = node;
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
    if (event.data.node.type === Config.NODE_TYPE_EXPERIMENT) {
        experiment.name = event.data.experimentName;
        description = event.data.experimentName;
    }
    Storage.save(experiment);
    this.focusedInputViewData = event.data;
    if (description.length > Config.NODE_DESCRIPTION_MAX_LENGTH) {
        description = description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
    }
    event.data.node.updateDescription(description);
}

export default new Controller();