import ModelManager from "../utils/ModelManager.js";
import TreeView from "../views/TreeView.js";
import WhereAmIView from "../views/WhereAmIView.js";
import InputView from "../views/InputView.js";
import RootNode from "../views/nodeView/RootNode.js";
import TimelineNode from "../views/nodeView/TimelineNode.js";
import DeflateableNode from "../views/nodeView/DeflateableNode.js";
import StandardNode from "../views/nodeView/StandardNode.js";
import MoveableNode from "../views/nodeView/MoveableNode.js";
import InputValidator from "../utils/InputValidator.js";
import SvgFactory from "../utils/SvgFactory.js";
import Config from "../utils/Config.js";
import Storage from "../utils/Storage.js";
import IdManager from "../utils/IdManager.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO:
// -> Finish load button (TreeView.insertSubTree(parentNode, dataModel)) -> if parentNode undefined -> root
// -> Test fully grown experiment on RemExApp
// -> change file .prefix to the type inside the base64 (InstructionActivity.java l. 110)
// -> Code cleaning
// -> Copy paste option?
// -> Create .exe file for install
// -> InfoView

// ENHANCEMENT:
// - Group node svg elements together in SvgFactory so that NodeView.updatePosition only needs to update the group element position
// - Optimize key movement (Shortcuts (e.g. Ctrl + ArrowRight -> addNextNode, Shift + ArrowLeft -> moveNodeLeft, Strg + S -> Save experiment, ...))
// - Show survey time windows (survey.startTimeInMin |-------| survey.startTimeInMin + survey.maxDurationInMin + survey.notificationDurationInMin)
// - Calculate the optimal duration for a survey depending on its content
// - Survey time randomization
// - Add new survey steps like distraction games, etc...
// - Add new question types

class Controller {

    init() {
        let importExportContainer = document.querySelector("#" + Config.IMPORT_EXPORT_CONTAINER_ID),
        treeViewContainer = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID),
        treeViewElement = SvgFactory.createTreeViewElement(),
        whereAmIViewContainer = document.querySelector("#" + Config.WHERE_AM_I_VIEW_CONTAINER_ID),
        whereAmIViewElement = SvgFactory.createWhereAmIViewElement(),
        inputViewContainer = document.querySelector("#" + Config.INPUT_VIEW_CONTAINER_ID),
        experiment,
        newNode,
        uploadButton,
        newButton;

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

        // Save/Load Buttons
        this.saveButton = importExportContainer.querySelector("#" + Config.SAVE_EXPERIMENT_BUTTON_ID);
        uploadButton = importExportContainer.querySelector("#" + Config.UPLOAD_EXPERIMENT_BUTTON_ID);
        newButton = importExportContainer.querySelector("#" + Config.NEW_EXPERIMENT_BUTTON_ID);
        this.saveButton.addEventListener("click", onSaveExperimentButtonClicked.bind(this));
        uploadButton.addEventListener("click", onUploadExperimentButtonClicked.bind(this));
        newButton.addEventListener("click", onNewExperimentButtonClicked.bind(this));
        
        // TreeView
        treeViewContainer.appendChild(treeViewElement);
        TreeView.init(treeViewContainer);

        experiment = ModelManager.initExperiment();
        newNode = createNode(this, undefined, experiment, undefined, undefined);
        newNode.updatePosition(TreeView.getCenter().x, TreeView.getCenter().y, true);
        TreeView.setRoot(newNode);

        whereAmIViewContainer.appendChild(whereAmIViewElement);
        WhereAmIView.init(whereAmIViewContainer);

        InputView.init(inputViewContainer);
        InputView.addEventListener(Config.EVENT_INPUT_CHANGED, onInputChanged.bind(this));
        InputView.addEventListener(Config.EVENT_ADD_NEXT_NODE, onAddNextNode.bind(this));
        InputView.addEventListener(Config.EVENT_ADD_PREV_NODE, onAddPreviousNode.bind(this));
        InputView.addEventListener(Config.EVENT_ADD_CHILD_NODE, onAddChildNode.bind(this));
        InputView.addEventListener(Config.EVENT_REMOVE_NODE, onRemoveNode.bind(this));
        
        document.addEventListener("keyup", onKeyUp.bind(this));
    }
}

function onSaveExperimentButtonClicked() {
    let downloadLinkElement = document.querySelector("#" + Config.DOWNLOAD_LINK_ID),
    experiment = ModelManager.getExperiment(),
    encodedResources = ModelManager.getAllResources(),
    result,
    correspondingNode,
    experimentJSON,
    jsonFile,
    nameCodeTable,
    textFile;

    result = InputValidator.experimentIsValid(experiment);
    if (result !== true) {
        correspondingNode = TreeView.getNodeById(result.correspondingNodeId);
        correspondingNode.parentNode.click();
        correspondingNode.click();
        InputView.showAlert(result.alert);
    }
    else {
        experiment.encodedResources = encodedResources;
        experimentJSON = JSON.stringify(experiment);
        // Declare type property as an enum for the android json library "com.fasterxml.jackson"
        experimentJSON = experimentJSON.replace(/"type"/g, "\"@type\"");
        jsonFile = generateFile(experimentJSON, "text/plain");
        nameCodeTable = ModelManager.getNameCodeTable(experiment);
        if (nameCodeTable.length !== 0) {
            textFile = generateFile(nameCodeTable, "text/plain");
            downloadLinkElement.setAttribute("href", textFile);
            downloadLinkElement.setAttribute("download", experiment.name + "_Code_Tabelle.txt");
            downloadLinkElement.click();
        }
        downloadLinkElement.setAttribute("href", jsonFile);
        downloadLinkElement.setAttribute("download", experiment.name + ".txt");
        downloadLinkElement.click();
    }
}

function generateFile(input, mimeType){
    let textFile = null,
    data = new Blob([input], {type: mimeType}); 

    if (textFile !== null) {  
      window.URL.revokeObjectURL(textFile);  
    }  

    textFile = window.URL.createObjectURL(data);  

    return textFile; 
  }

function onUploadExperimentButtonClicked() {
    let uploadElement,
    experiment,
    ids;

    if (confirm(Config.LOAD_EXPERIMENT_ALERT)) { // eslint-disable-line no-alert
        uploadElement = document.querySelector("#" + Config.UPLOAD_INPUT_ID);
        uploadElement.addEventListener("change", function(event) {
            new Promise(function(resolve, reject) {
                var reader = new FileReader();
                reader.onload = function() { resolve(reader.result); };
                reader.onerror = reject;
                reader.readAsText(event.target.files[0]);
            }).then(function(result) {
                experiment = JSON.parse(result);
                ModelManager.removeExperiment();
                TreeView.removeNode(TreeView.rootNode);
                for (let encodedResource of experiment.encodedResources) {
                    ModelManager.addResource(encodedResource.fileName, encodedResource.base64String);
                }
                ModelManager.saveExperiment(experiment);
                ids = ModelManager.getIds(experiment);
                IdManager.setIds(ids);
                WhereAmIView.update([]);
                InputView.hide();
                InputView.hideAlert();
                // TODO
                //TreeView init and createNodes
            }.bind(this));
        }.bind(this));
        uploadElement.click();
    }
}

function onNewExperimentButtonClicked() {
    let experiment,
    newNode;

    if (confirm(Config.NEW_EXPERIMENT_ALERT)) { // eslint-disable-line no-alert
        IdManager.removeIds();
        ModelManager.removeExperiment();
        TreeView.removeNode(TreeView.rootNode);
        WhereAmIView.update([]);
        InputView.hide();
        InputView.hideAlert();
        experiment = ModelManager.initExperiment();
        newNode = createNode(this, undefined, experiment, undefined, undefined);
        newNode.updatePosition(TreeView.getCenter().x, TreeView.getCenter().y, true);
        TreeView.setRoot(newNode);
    }
}

function createNode(that, parentNode, data, stepType, questionType) {
    let id = data.id,
    elements,
    description = data.name,
    node;

    if (parentNode === undefined) {
        elements = SvgFactory.createRootNodeElements(Config.EXPERIMENT_ICON_SRC);
        node = new RootNode(elements, id, Config.TYPE_EXPERIMENT, description);
    }
    else if (parentNode.type === Config.TYPE_EXPERIMENT) {
        elements = SvgFactory.createTimelineNodeElements(Config.EXPERIMENT_GROUP_ICON_SRC);
        node = new TimelineNode(elements, id, Config.TYPE_EXPERIMENT_GROUP, description, parentNode, that.timelineEventListener, TreeView.getWidth());
    }
    else if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
        elements = SvgFactory.createDeflateableNodeElements(false, true, Config.SURVEY_ICON_SRC);
        node = new DeflateableNode(elements, id, Config.TYPE_SURVEY, description, parentNode);
    }
    else if (parentNode.type === Config.TYPE_SURVEY) {
        if (stepType === Config.STEP_TYPE_INSTRUCTION) {
            elements = SvgFactory.createMoveableNodeElements(true, false, Config.INSTRUCTION_ICON_SRC);
            node = new MoveableNode(elements, id, stepType, description, parentNode);
        }
        else if (stepType === Config.STEP_TYPE_BREATHING_EXERCISE) {
            elements = SvgFactory.createMoveableNodeElements(true, false, Config.BREATHING_EXERCISE_ICON_SRC);
            node = new MoveableNode(elements, id, stepType, description, parentNode);
        }
        else if (stepType === Config.STEP_TYPE_QUESTIONNAIRE) {
            elements = SvgFactory.createMoveableNodeElements(true, true, Config.QUESTIONNAIRE_ICON_SRC);
            node = new MoveableNode(elements, id, Config.STEP_TYPE_QUESTIONNAIRE, description, parentNode);
        }
        else {
            throw "The step type " + stepType + " is not defined.";
        }
    }
    else if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        if (questionType === Config.QUESTION_TYPE_CHOICE) {
            elements = SvgFactory.createMoveableNodeElements(true, true, Config.QUESTION_ICON_SRC);
            node = new MoveableNode(elements, id, Config.QUESTION_TYPE_CHOICE, description, parentNode);
        }
        else if (questionType !== Config.QUESTION_TYPE_CHOICE && questionType !== undefined) {
            elements = SvgFactory.createMoveableNodeElements(true, false, Config.QUESTION_ICON_SRC);
            node = new MoveableNode(elements, id, questionType, description, parentNode);
        }
        else {
            throw "The question type " + questionType + " is not defined.";
        }
    }
    else if (parentNode.type === Config.QUESTION_TYPE_CHOICE) {
        description = data.text;
        elements = SvgFactory.createStandardNodeElements(true, false, Config.ANSWER_ICON_SRC);
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
    nodeDataModel = ModelManager.getDataFromNodeId(clickedNode.id, experiment),
    parentNodeDataModel,
    movingVector = {
        x: undefined,
        y: undefined,
    },
    ongoingInstructionsForInputView = [],
    firstNodeOfRow,
    questionsForInputView = [],
    promise,
    validationResult;

    if (clickedNode !== previousFocusedNode) {
        this.currentSelection = [];
        updateCurrentSelection(this, clickedNode);
        TreeView.currentFocusedNode = clickedNode;

        clickedNode.emphasize(this.currentSelection);
        clickedNode.focus();
        clickedNode.show();
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
                if (ongoingInstructionsForInputView.length === 0) {
                    nodeDataModel.waitForStep = 0;
                    ModelManager.updateExperiment(nodeDataModel);
                }
            }
            if (clickedNode.parentNode.type === Config.QUESTION_TYPE_CHOICE) {
                firstNodeOfRow = getFirstNodeOfRow(clickedNode.parentNode);
                questionsForInputView = getQuestionsForInputView(firstNodeOfRow, clickedNode.parentNode, questionsForInputView);
            }
        }
        if (clickedNode.type === Config.STEP_TYPE_INSTRUCTION) {
            if (nodeDataModel.imageFileName !== null) {
                promise = ModelManager.getResource(nodeDataModel.imageFileName);
            }
            if (nodeDataModel.videoFileName !== null) {
                promise = ModelManager.getResource(nodeDataModel.videoFileName);
            }
            if (promise !== undefined) {
                promise.then(function(result) {
                    if (typeof(result) === "string") {
                        console.log(result);
                    }
                    else {
                        InputView.show(clickedNode, nodeDataModel, ongoingInstructionsForInputView, questionsForInputView, result);
                    }
                });
            }
            else {
                InputView.show(clickedNode, nodeDataModel, ongoingInstructionsForInputView, questionsForInputView, undefined);
            }
        }
        else {
            InputView.show(clickedNode, nodeDataModel, ongoingInstructionsForInputView, questionsForInputView, undefined);
        }
        InputView.selectFirstInput();

        if (clickedNode.parentNode !== undefined) {
            parentNodeDataModel = ModelManager.getDataFromNodeId(clickedNode.parentNode.id, experiment);
        }
        validationResult = InputValidator.inputIsValid(clickedNode, nodeDataModel, parentNodeDataModel);
        if (validationResult === true) {
            InputView.hideAlert();
            InputView.enableInputs();
            enableNodeActions(this, TreeView.rootNode);
            this.saveButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
        else {
            validationResult.correspondingNode.click();
            InputView.showAlert(validationResult.alert);
            InputView.enableInputs();
            InputView.disableInputsExcept(validationResult.invalidInput);
            disableNodeActions(this, TreeView.rootNode);
            this.saveButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
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

function getQuestionsForInputView(node, exceptionNode, questionsForInputView) {
    let question,
    modelData,
    experiment = Storage.load();

    if (node === undefined) {
        return questionsForInputView;
    }
    if (node !== exceptionNode) {
        modelData = ModelManager.getDataFromNodeId(node.id, experiment);
        question = {
            label: modelData.name,
            value: modelData.id,
        };
        questionsForInputView.push(question);
    }
    return getQuestionsForInputView(node.nextNode, exceptionNode, questionsForInputView);
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
        properties.id = node.id;
        properties.nextStepId = null;
        if (node.previousNode !== undefined) {
            properties.previousStepId = node.previousNode.id;
        }
        else {
            properties.previousStepId = null;
        }
        ModelManager.updateExperiment(properties);
        return;
    }
    properties.id = node.id;
    properties.nextStepId = node.nextNode.id;
    if (node.previousNode !== undefined) {
        properties.previousStepId = node.previousNode.id;
    }
    else {
        properties.previousStepId = null;
    }
    ModelManager.updateExperiment(properties);
    updateStepLinks(node.nextNode);
}

function updateQuestionLinks(node) {
    let properties = {};
    if (node.nextNode === undefined) {
        properties.id = node.id;
        if (node.type !== Config.QUESTION_TYPE_CHOICE) {
            properties.nextQuestionId = null;
        }
        if (node.previousNode !== undefined) {
            properties.previousQuestionId = node.previousNode.id;
        }
        else {
            properties.previousQuestionId = null;
        }
        ModelManager.updateExperiment(properties);
        return;
    }
    properties.id = node.id;
    if (node.type !== Config.QUESTION_TYPE_CHOICE) {
        properties.nextQuestionId = node.nextNode.id;
    }
    if (node.previousNode !== undefined) {
        properties.previousQuestionId = node.previousNode.id;
    }
    else {
        properties.previousQuestionId = null;
    }
    ModelManager.updateExperiment(properties);
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
        updateSurveyLinks(timeSortedChildNodes);
        correspondingNode.updateTimelineLength();
        newNode.click();
    }
}

function updateSurveyLinks(timeSortedChildNodes) {
    let properties = {};
    for (let i = 0; i < timeSortedChildNodes.length; i++) {
        properties.id = timeSortedChildNodes[i].id;
        if (i !== timeSortedChildNodes.length - 1) {
            properties.nextSurveyId = timeSortedChildNodes[i + 1].id;
        }
        else {
            properties.nextSurveyId = null;
        }
        if (timeSortedChildNodes.length === 1) {
            timeSortedChildNodes[i].previousNode = undefined;
            properties.previousSurveyId = null;
            timeSortedChildNodes[i].nextNode = undefined;
            properties.nextSurveyId = null;
        }
        else if (i === 0) {
            timeSortedChildNodes[i].previousNode = undefined;
            properties.previousSurveyId = null;
            timeSortedChildNodes[i].nextNode = timeSortedChildNodes[i + 1];
            properties.nextSurveyId = timeSortedChildNodes[i + 1].id;
        }
        else if (i === timeSortedChildNodes.length - 1) {
            timeSortedChildNodes[i].previousNode = timeSortedChildNodes[i - 1];
            properties.previousSurveyId = timeSortedChildNodes[i - 1].id;
            timeSortedChildNodes[i].nextNode = undefined;
            properties.nextSurveyId = null;
        }
        else {
            timeSortedChildNodes[i].previousNode = timeSortedChildNodes[i - 1];
            properties.previousSurveyId = timeSortedChildNodes[i - 1].id;
            timeSortedChildNodes[i].nextNode = timeSortedChildNodes[i + 1];
            properties.nextSurveyId = timeSortedChildNodes[i + 1].id;
        }
        ModelManager.updateExperiment(properties);
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
        updateSurveyLinks(timeSortedChildNodes);
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
    experiment = ModelManager.getExperiment(),
    currentDataModel = ModelManager.getDataFromNodeId(correspondingNode.id, experiment),
    newDataModel = event.data.newModelProperties,
    nodeUpdatedDataModel,
    parentNodeDataModel,
    timeInMin,
    timeSortedChildNodes,
    fileName,
    validationResult;

    // TODO
    console.log(newDataModel.surveyFrequency);

    newDataModel.id = correspondingNode.id;
    if (newDataModel.name !== undefined) {
        correspondingNode.updateDescription(newDataModel.name);
    }
    if (newDataModel.text !== undefined && correspondingNode.type === Config.TYPE_ANSWER) {
        correspondingNode.updateDescription(newDataModel.text);
    }
    if (newDataModel.absoluteStartDaysOffset !== undefined || newDataModel.absoluteStartAtHour !== undefined) {
        if (newDataModel.absoluteStartDaysOffset === undefined) {
            timeInMin = currentDataModel.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + newDataModel.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + newDataModel.absoluteStartAtMinute * 1;
        }
        else {
            timeInMin = newDataModel.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + currentDataModel.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + currentDataModel.absoluteStartAtMinute * 1;
        }
        correspondingNode.parentNode.updateNodeTimeMap(correspondingNode, timeInMin);
        timeSortedChildNodes = correspondingNode.parentNode.getTimeSortedChildNodes();
        updateSurveyLinks(timeSortedChildNodes);
        correspondingNode.parentNode.updateTimelineLength();
    }

    if (correspondingNode.type === Config.STEP_TYPE_INSTRUCTION) {
        if (newDataModel.imageFileName !== undefined) {
            fileName = newDataModel.imageFileName;
        }
        if (newDataModel.videoFileName !== undefined){
            fileName = newDataModel.videoFileName;
        }
        if (fileName !== undefined && fileName !== null) {
            if (!ModelManager.addResource(fileName, event.data.base64String)) {
                // TODO: Alert, that another file with the same file name already exists
                // InputView: Set file inputs values to null and display them
            }
            else {
                ModelManager.updateExperiment(newDataModel);
            }
        }
        else {
            ModelManager.updateExperiment(newDataModel);
        }
        if (fileName === null) {
            ModelManager.removeResource(event.data.previousFileName);
        }
    }
    else {
        ModelManager.updateExperiment(newDataModel);
    }

    WhereAmIView.update(this.currentSelection);
    
    experiment = ModelManager.getExperiment();
    if (correspondingNode.parentNode !== undefined) {
        parentNodeDataModel = ModelManager.getDataFromNodeId(correspondingNode.parentNode.id, experiment);
    }
    nodeUpdatedDataModel = ModelManager.getDataFromNodeId(correspondingNode.id, experiment);
    validationResult = InputValidator.inputIsValid(correspondingNode, nodeUpdatedDataModel, parentNodeDataModel);
    if (validationResult === true) {
        InputView.hideAlert();
        InputView.enableInputs();
        enableNodeActions(this, TreeView.rootNode);
        this.saveButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }
    else {
        validationResult.correspondingNode.click();
        InputView.showAlert(validationResult.alert);
        InputView.enableInputs();
        InputView.disableInputsExcept(validationResult.invalidInput);
        disableNodeActions(this, TreeView.rootNode);
        this.saveButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }

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