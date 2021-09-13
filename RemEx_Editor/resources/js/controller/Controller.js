import Config from "../utils/Config.js";
import Storage from "../utils/Storage.js";
import IdManager from "../utils/IdManager.js";
import ExperimentInputView from "../views/InputView/ExperimentInputView.js";
import ExperimentGroupInputView from "../views/InputView/ExperimentGroupInputView.js";
import NodeView from "../views/NodeView.js";
import TreeView from "../views/TreeView.js";
import Experiment from "../model/Experiment.js";
import ExperimentGroup from "../model/ExperimentGroup.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO: Input checks:
// - Defining max characters for several input fields
// - Input fields that allow only one type or type check after input
// - Format checks inside the views input fields (Delete the ones without usage in the model)

// ENHANCEMENT: Calculate the optimal duration for a survey depending on its 

class Controller {
    init() {
        let experiment,
        experimentRootNode;

        // Init TreeView
        TreeView.init();

        // TODO: Init InputViews
        this.focusedInputView = undefined;
        this.focusedInputViewData = undefined;
        this.inputViews = [];
        ExperimentInputView.init();
        ExperimentInputView.addEventListener(Config.EVENT_INPUT_CHANGED, onInputChanged.bind(this));
        ExperimentInputView.addEventListener(Config.EVENT_REMOVE_NODE, onRemoveNode.bind(this));
        this.inputViews.push(ExperimentInputView);
        ExperimentGroupInputView.init();
        ExperimentGroupInputView.addEventListener(Config.EVENT_INPUT_CHANGED, onInputChanged.bind(this));
        ExperimentGroupInputView.addEventListener(Config.EVENT_REMOVE_NODE, onRemoveNode.bind(this));
        this.inputViews.push(ExperimentGroupInputView);

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

function createNewExperimentGroup(that, experiment, parentNode, previousNode, nextNode) {
    let group = new ExperimentGroup(),
    id = IdManager.getUnusedId(Config.NODE_TYPE_EXPERIMENT_GROUP),
    groupNode,
    nodeProperties = {};

    group.id = id;
    group.name = Config.NEW_EXPERIMENT_GROUP_DESCRIPTION;
    experiment.groups.push(group);
    Storage.save(experiment);

    nodeProperties.id = id;
    nodeProperties.type = Config.NODE_TYPE_EXPERIMENT_GROUP;
    nodeProperties.description = group.name;
    nodeProperties.parentNode = parentNode;
    nodeProperties.previousNode = previousNode;
    nodeProperties.nextNode = nextNode;
    groupNode = createNode(that, nodeProperties);
    if (previousNode !== undefined) {
        previousNode.nextNode = groupNode;
    }
    if (nextNode !== undefined) {
        nextNode.previousNode = groupNode;
    }

    return groupNode;
}

function createInitialExperimentTree(that, experiment) {
    let experimentRootNode,
    groupNode,
    previousGroupNode,
    surveyNode,
    previousSurveyNode,
    stepNode,
    previousStepNode,
    questionNode,
    previousQuestionNode,
    nodeProperties = {};

    nodeProperties.id = null;
    nodeProperties.type = Config.NODE_TYPE_EXPERIMENT;
    nodeProperties.description = experiment.name;
    nodeProperties.parentNode = null;
    nodeProperties.previousNode = undefined;
    nodeProperties.nextNode = undefined;
    experimentRootNode = createNode(that, nodeProperties);
    for (let group of experiment.groups) {
        nodeProperties.id = group.id;
        nodeProperties.type = Config.NODE_TYPE_EXPERIMENT_GROUP;
        nodeProperties.description = group.name;
        nodeProperties.parentNode = experimentRootNode;
        nodeProperties.previousNode = previousGroupNode;
        nodeProperties.nextNode = undefined;
        groupNode = createNode(that, nodeProperties);
        experimentRootNode.childNodes.push(groupNode);
        if (previousGroupNode !== undefined) {
            previousGroupNode.nextNode = groupNode;
        }
        previousGroupNode = groupNode;
        for (let survey of group.surveys) {
            // TODO: Create Survey Timeline
            nodeProperties.id = survey.id;
            nodeProperties.type = Config.NODE_TYPE_SURVEY;
            nodeProperties.description = survey.name;
            nodeProperties.parentNode = groupNode;
            nodeProperties.previousNode = previousSurveyNode;
            nodeProperties.nextNode = undefined;
            surveyNode = createNode(that, nodeProperties);
            groupNode.childNodes.push(surveyNode);
            if (previousSurveyNode !== undefined) {
                previousSurveyNode.nextNode = surveyNode;
            }
            previousSurveyNode = surveyNode;
            for (let step of survey.steps) {
                nodeProperties.id = step.id;
                nodeProperties.description = step.name;
                nodeProperties.parentNode = surveyNode;
                nodeProperties.previousNode = previousStepNode;
                nodeProperties.nextNode = undefined;
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
                if (previousStepNode !== undefined) {
                    previousStepNode.nextNode = stepNode;
                }
                previousStepNode = stepNode;
                if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    for (let question of step.questions) {
                        nodeProperties.id = question.id;
                        nodeProperties.type = Config.NODE_TYPE_QUESTION;
                        nodeProperties.description = question.name;
                        nodeProperties.parentNode = stepNode;
                        nodeProperties.previousNode = previousQuestionNode;
                        nodeProperties.nextNode = undefined;
                        questionNode = createNode(that, nodeProperties);
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

function createNode(that, nodeProperties) {
    let node;
    if (nodeProperties.description.length >= Config.NODE_DESCRIPTION_MAX_LENGTH) {
        nodeProperties.description = nodeProperties.description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
    }
    node = new NodeView(nodeProperties.id, nodeProperties.type, nodeProperties.description, nodeProperties.parentNode, nodeProperties.previousNode, nodeProperties.nextNode);
    node.addEventListener(Config.EVENT_NODE_MOUSE_ENTER, onNodeMouseEnter.bind(that));
    node.addEventListener(Config.EVENT_NODE_MOUSE_LEAVE, onNodeMouseLeave.bind(that));
    node.addEventListener(Config.EVENT_NODE_CLICKED, onNodeClicked.bind(that));
    node.addEventListener(Config.EVENT_NODE_START_DRAG, onNodeStartDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DRAG, onNodeDrag);
    node.addEventListener(Config.EVENT_NODE_ON_DROP, onNodeDrop);
    node.addEventListener(Config.EVENT_ADD_NEXT_NODE, onAddNextNode.bind(that));
    node.addEventListener(Config.EVENT_ADD_PREV_NODE, onAddPrevNode.bind(that));
    return node;
}

// Node events

function onNodeMouseEnter(event) {
    let node = event.data.target,
    inputData = getInputData(node);
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
    inputData = getInputData(node),
    experiment,
    newNode;
    // TreeView actions
    TreeView.setFocusOn(node);
    if (node.childNodes.length === 0) {
        experiment = Storage.load();
        if (node.type === Config.NODE_TYPE_EXPERIMENT) {
            newNode = createNewExperimentGroup(this, experiment, node, undefined, undefined);
            TreeView.insertNode(newNode, null);
            node.childNodes.push(newNode);
        }
        // TODO
    }
    // InputView actions
    for (let inputView of this.inputViews) {
        inputView.hide();
    }
    showInputView(this, node, inputData, true);
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

// TODO Verlinkung und insertion stimmt nicht

function onAddNextNode(event) {
    let node = event.data.target,
    experiment = Storage.load(),
    newNode;

    if (node.type === Config.NODE_TYPE_EXPERIMENT_GROUP) {
        newNode = createNewExperimentGroup(this, experiment, node.parentNode, node, node.nextNode);
        node.nextNode = newNode;
        node.parentNode.childNodes.push(newNode);
        TreeView.insertNode(newNode, Config.TREE_VIEW_INSERT_AFTER);
        newNode.nodeSvg.dispatchEvent(new Event("click"));
    }
}

function onAddPrevNode(event) {
    let node = event.data.target,
    experiment = Storage.load(),
    newNode;

    if (node.type === Config.NODE_TYPE_EXPERIMENT_GROUP) {
        newNode = createNewExperimentGroup(this, experiment, node.parentNode, node.previousNode, node);
        node.previousNode = newNode;
        node.parentNode.childNodes.push(newNode);
        TreeView.insertNode(newNode, Config.TREE_VIEW_INSERT_BEFORE);
        newNode.nodeSvg.dispatchEvent(new Event("click"));
    }
}

// Node events helper functions

function getInputData(node) {
    let data = {},
    experiment = Storage.load();

    if (node.type === Config.NODE_TYPE_EXPERIMENT) {
        data.experimentName = experiment.name;
        return data;
    }
    else if (node.type === Config.NODE_TYPE_EXPERIMENT_GROUP) {
        for (let group of experiment.groups) {
            if (group.id === node.id) {
                data.experimentGroupName = group.name;
                return data;
            }
        }
    }
    else {
        // Get input data from current experiment
    }
    return undefined;
}

function showInputView(that, node, inputData, focus) {
    let inputView;

    if (node.type === Config.NODE_TYPE_EXPERIMENT) {
        inputView = ExperimentInputView;
    }
    else if (node.type === Config.NODE_TYPE_EXPERIMENT_GROUP) {
        inputView = ExperimentGroupInputView;
    }
    else {
        // No InputView defined for node.type
        return;
    }
    if (focus) {
        inputView.correspondingNode = node;
        that.focusedInputView = inputView;
        that.focusedInputViewData = inputData;
    }
    inputView.show(inputData);
}

// InputView event callbacks

function onRemoveNode(event) {
    let nodeToRemove = event.data.correspondingNode,
    experiment = Storage.load(),
    nextFocusedNode,
    indexOfParentList,
    indexOfExperimentList;

    // Updating the node links
    if (nodeToRemove.previousNode !== undefined) {
        nodeToRemove.previousNode.nextNode = nodeToRemove.nextNode;
    }
    if (nodeToRemove.nextNode !== undefined) {
        nodeToRemove.nextNode.previousNode = nodeToRemove.previousNode;
    }
    // Defining the node which is focused after removal
    if (nodeToRemove.nextNode !== undefined) {
        nextFocusedNode = nodeToRemove.nextNode;
    }
    else if (nodeToRemove.previousNode !== undefined) {
        nextFocusedNode = nodeToRemove.previousNode;
    }
    else {
        nextFocusedNode = nodeToRemove.parentNode;
    }
    // Removing node from parentNodes' child list
    indexOfParentList = nodeToRemove.parentNode.childNodes.indexOf(nodeToRemove);
    if (indexOfParentList !== -1) {
        nodeToRemove.parentNode.childNodes.splice(indexOfParentList, 1);
    }
    // Removing model entry
    if (nodeToRemove.type === Config.NODE_TYPE_EXPERIMENT_GROUP) {
        for (let group of experiment.groups) {
            if (group.id === nodeToRemove.id) {
                indexOfExperimentList = experiment.groups.indexOf(group);
                experiment.groups.splice(indexOfExperimentList, 1);
                break;
            }
        }
    }
    // TODO: else if (other types)
    Storage.save(experiment);
    IdManager.removeId(nodeToRemove.id, nodeToRemove.type);
    TreeView.removeNode(nodeToRemove);
    nextFocusedNode.nodeSvg.dispatchEvent(new Event("click"));
}

function onInputChanged(event) {
    let experiment = Storage.load(),
    description;
    if (event.data.node.type === Config.NODE_TYPE_EXPERIMENT) {
        description = event.data.experimentName;
        experiment.name = event.data.experimentName;
    }
    else if (event.data.node.type === Config.NODE_TYPE_EXPERIMENT_GROUP) {
        for (let group of experiment.groups) {
            if (group.id === event.data.node.id) {
                description = event.data.experimentGroupName;
                group.name = event.data.experimentGroupName;
                break;
            }
        }
    }
    else {
        // node.type is not defined
    }
    Storage.save(experiment);
    this.focusedInputViewData = event.data;
    if (description.length > Config.NODE_DESCRIPTION_MAX_LENGTH) {
        description = description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
    }
    else {
        // Description is short enough
    }
    event.data.node.updateDescription(description);
}

export default new Controller();