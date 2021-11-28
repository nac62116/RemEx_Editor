import ModelManager from "../utils/ModelManager.js";
import TreeView from "../views/TreeView.js";
import InputView from "../views/InputView.js";
import WhereAmIView from "../views/WhereAmIView.js";
import LoadingScreenView from "../views/LoadingScreenView.js";
import ImportExportView from "../views/ImportExportView.js";
import InputValidator from "../utils/InputValidator.js";
import SvgFactory from "../utils/SvgFactory.js";
import Config from "../utils/Config.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO:
// -> Code cleaning
// -> Finish load button (TreeView.insertSubTree(parentNode, dataModel)) -> if parentNode undefined -> root
// -> Survey frequency buttons
// -> Copy paste option?
// -> Test phase: Test fully grown experiment on RemExApp, Test the RemExEditor functionality
// -> Create .exe file for install
// -> MIT Licence: Licence text on top of each file and after that the contibutors
// -> RemEx Logo in the top left corner
// -> InfoView
// APP:
// -> RemEx Logo as App icon
// -> Show a loading Screen when experiment gets loaded

// ENHANCEMENT:
// EDITOR:
// - Group node svg elements together in SvgFactory so that NodeView.updatePosition only needs to update the group element position
// - Add key movement (Shortcuts (e.g. Arrows -> navigating through tree, Ctrl + ArrowRight -> addNextNode, Shift + ArrowLeft -> moveNodeLeft, Strg + S -> Save experiment, ...))
// - Show survey time windows on the timeline (survey.startTimeInMin |-------| survey.startTimeInMin + survey.maxDurationInMin + survey.notificationDurationInMin)
// - Calculate the optimal duration for a survey depending on its content
// - Survey time randomization
// APP:
// - If the device is turned off, the current experiment is finished and can't be resumed (Issues with receiving a boot completed action from the system, to resume the experiment)
// - Same problem when the user kills the app (swipes it away in the recent apps list) during an experiment between two surveys (not during a survey). If the user kills the app during a survey the survey gets properly finished and the next survey alarm is set
// - Logging user interactions that are relevant for the researchers
// BOTH:
// - Add new survey steps like distraction games, etc...
// - Add new question types
// - Upload experiment to server (EDITOR) / Download experiment from server (APP) (Keep offline functionality (save experiment to client) -> Server communication is only needed for up/downloading experiment)

class Controller {

    init() {
        let importExportContainer = document.querySelector("#" + Config.IMPORT_EXPORT_CONTAINER_ID),
        treeViewContainer = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID),
        treeViewElement = SvgFactory.createTreeViewElement(),
        whereAmIViewContainer = document.querySelector("#" + Config.WHERE_AM_I_VIEW_CONTAINER_ID),
        whereAmIViewElement = SvgFactory.createWhereAmIViewElement(),
        inputViewContainer = document.querySelector("#" + Config.INPUT_VIEW_CONTAINER_ID),
        loadingScreenElement = document.querySelector("#" + Config.LOADING_SCREEN_ID),
        experiment,
        newNode,
        // Event listener
        // ***
        // Here are all entry points into this Controller.
        // After this init() function is executed,
        // everything that can happen, happens in one of those callback functions.
        // ***
        treeViewEventListener = [
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
                callback: onAddNode.bind(this),
            },
            {
                eventType: Config.EVENT_ADD_PREVIOUS_NODE,
                callback: onAddNode.bind(this),
            },
            {
                eventType: Config.EVENT_ADD_CHILD_NODE,
                callback: onAddNode.bind(this),
            },
            {
                eventType: Config.EVENT_MOVE_NODE_RIGHT,
                callback: onSwitchNodes.bind(this),
            },
            {
                eventType: Config.EVENT_MOVE_NODE_LEFT,
                callback: onSwitchNodes.bind(this),
            },
        ],
        inputViewEventListener = [
            {
                eventType: Config.EVENT_INPUT_CHANGED,
                callback: onInputChanged.bind(this),
            },
            {
                eventType: Config.EVENT_REMOVE_NODE,
                callback: onRemoveNode.bind(this),
            },
            {
                eventType: Config.EVENT_CHANGE_NODE,
                callback: onChangeNode.bind(this),
            },
            {
                eventType: Config.EVENT_TIMELINE_CLICKED,
                callback: onTimelineClicked.bind(this),
            },
        ],
        importExportViewEventListener = [
            {
                eventType: Config.EVENT_SAVE_EXPERIMENT,
                callback: onSaveExperiment.bind(this),
            },
            {
                eventType: Config.EVENT_SAVING_PROGRESS,
                callback: onSaveExperimentProgress.bind(this),
            },
            {
                eventType: Config.EVENT_EXPERIMENT_SAVED,
                callback: onExperimentSaved.bind(this),
            },
            {
                eventType: Config.EVENT_UPLOAD_EXPERIMENT,
                callback: onUploadExperiment.bind(this),
            },
            {
                eventType: Config.EVENT_EXPERIMENT_UPLOADED,
                callback: onExperimentUploaded.bind(this),
            },
            {
                eventType: Config.EVENT_NEW_EXPERIMENT,
                callback: onNewExperiment.bind(this),
            },
        ];

        // experiment is the root of the data model:
        // ***
        // Experiment has
        // ExperimentGroups have
        // Surveys have 
        // Steps (Instructions, BreathingExercises, Questionnaires)
        // Questionnaires have
        // Questions (Text-, Choice-, Likert-, PointOfTime-, TimeIntervallQuestions)
        // ChoiceQuestions have Answers
        // ***
        experiment = ModelManager.initExperiment();

        // LoadingScreenView
        LoadingScreenView.init(loadingScreenElement);

        // ImportExportView (Save/Load Functionality)
        ImportExportView.init(importExportContainer);
        for (let listener of importExportViewEventListener) {
            ImportExportView.addEventListener(listener.eventType, listener.callback);
        }

        // TreeView (Handles the tree in the top left corner)
        treeViewContainer.appendChild(treeViewElement);
        TreeView.init(treeViewContainer, treeViewEventListener);
        newNode = TreeView.createSubtree(experiment); 
        TreeView.updateNodeLinks(experiment, undefined, undefined, undefined);    

        // WhereAmIView (Shows the current position inside tree in the top right corner)
        whereAmIViewContainer.appendChild(whereAmIViewElement);
        WhereAmIView.init(whereAmIViewContainer);

        // InputView (Handles the user input in the bottom left corner)
        InputView.init(inputViewContainer);
        for (let listener of inputViewEventListener) {
            InputView.addEventListener(listener.eventType, listener.callback);
        }


//###
        // TODO: InfoView
//###


        TreeView.clickNode(newNode, undefined);
    }
}

// *** ImportExportView callback functions:
// **
// *

function onSaveExperiment() {
    let experiment = ModelManager.getExperiment(),
    resourcePromises = ModelManager.getAllResources(),
    validationResult,
    // Writing a nameCodeTable, which provides the answer codes to the corresponding questions/answers to simplify the csv understanding after an experiment.
    nameCodeTable = ModelManager.getNameCodeTable(experiment);

    // Checking for a valid experiment
    validationResult = InputValidator.experimentIsValid(experiment);
    if (validationResult !== true) {
        TreeView.clickNode(undefined, validationResult.invalidNodeId);
        InputView.showAlert(validationResult.alert);
    }
    else {
        LoadingScreenView.show(Config.SAVING_PROMPT + "<br>Fortschritt: 0 %");
        ImportExportView.exportExperiment(experiment, nameCodeTable, resourcePromises);
    }
}

function onSaveExperimentProgress(event) {
    LoadingScreenView.show(Config.SAVING_PROMPT + "<br>Fortschritt: " + Math.round(event.data.percent) + " %");
}

function onExperimentSaved() {
    LoadingScreenView.hide();
}

function onUploadExperiment() {
    
    if (confirm(Config.LOAD_EXPERIMENT_ALERT)) {
        

//###
        // TODO: Get experiment and resources from zip file in this function
        ImportExportView.importExperiment();
//###


    }
}

function onExperimentUploaded(event) {
    let newNode;

    TreeView.removeSubtree(TreeView.rootNode);
    ModelManager.removeExperiment();

    ModelManager.saveExperiment(event.data.experiment);
    ModelManager.setIds(event.data.experiment);
    for (let resource of event.data.resources) {
        ModelManager.addResource(resource);
    }
    WhereAmIView.update([]);
    InputView.hide();
    InputView.hideAlert();   
    newNode = TreeView.createSubtree(event.data.experiment);
    TreeView.updateNodeLinks(event.data.experiment, undefined, undefined, undefined);   
    TreeView.clickNode(newNode, undefined);
}

function onNewExperiment() {
    let experiment,
    newNode;

    if (confirm(Config.NEW_EXPERIMENT_ALERT)) {

        TreeView.removeSubtree(TreeView.rootNode);
        ModelManager.removeExperiment();
        experiment = ModelManager.initExperiment();
        WhereAmIView.update([]);
        InputView.hide();
        InputView.hideAlert();
        newNode = TreeView.createSubtree(experiment);
        TreeView.updateNodeLinks(experiment, undefined, undefined, undefined);   
        TreeView.clickNode(newNode, undefined);
    }
}

// *** TreeView callback functions:
// **
// *

function onNodeMouseEnter(event) {
    let hoveredNode = event.data.target;

    if (!TreeView.currentSelection.includes(hoveredNode)) {
        hoveredNode.emphasize();
    }


//###
    // TODO: InfoView
//###


}

function onNodeMouseLeave(event) {
    let hoveredNode = event.data.target;
    
    if (!TreeView.currentSelection.includes(hoveredNode)) {
        hoveredNode.deemphasize();
    }


//###
    // TODO: InfoView
//###


}

function onNodeClicked(event) {
    let clickedNode = event.data.target,
    experiment = ModelManager.getExperiment(),
    nodeDataModel = ModelManager.getDataFromNodeId(clickedNode.id, experiment),
    parentNodeDataModel,
    pastOngoingInstructions,
    firstNodeOfRow,
    pastAndFutureQuestions,
    promise;

    if (clickedNode !== TreeView.currentFocusedNode) {
        if (clickedNode.parentNode !== undefined) {
            parentNodeDataModel = ModelManager.getDataFromNodeId(clickedNode.parentNode.id, experiment);
            if (clickedNode.parentNode.type === Config.TYPE_SURVEY) {
                // Ongoing instructions are those with a duration.
                // E.g.:
                // "Ongoing Instruction" (durationInMin = 2):
                // --> "Put something for at least 2 Minutes in your mouth."
                //
                // To avoid letting the user wait for the whole two minutes,
                // we can let him do something parallel.
                // Questionnaire -> Instruction -> BreathingExercise -> some other Step ....
                //
                // Now its time for the "Corresponding Instruction":
                // --> "Put the something out of your mouth."
                //
                // The "Corresponding Instruction" has to wait for the "Ongoing Instruction".
                // --> ("Corresponding Instruction".waitForStep = "Ongoing Instruction".id).
                //
                // To be able to create such an instruction,
                // the InputView needs to know all past ongoing instructions.
                pastOngoingInstructions = ModelManager.getPastOngoingInstructions(clickedNode);
            }
            if (clickedNode.parentNode.type === Config.QUESTION_TYPE_CHOICE) {
                firstNodeOfRow = TreeView.getFirstNodeOfRow(clickedNode.parentNode);
                // The answers of a choice question can link to different questions.
                // Thats why we need all past and future questions for the InputView
                // when an answer node is clicked.
                pastAndFutureQuestions = ModelManager.getPastAndFutureQuestions(firstNodeOfRow, clickedNode.parentNode);
            }
        }
        

//###
        // TODO: Move this to a seperate thread
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
                        alert(result); // eslint-disable-line no-alert
                    }
                    else {
                        if (nodeDataModel.imageFileName !== null) {
                            InputView.setImageResource(result, nodeDataModel.id);
                        }
                        if (nodeDataModel.videoFileName !== null) {
                            InputView.setVideoResource(result, nodeDataModel.id);
                        }
                    }
                });
            }
        }
//###


        TreeView.navigateToNode(clickedNode);
        WhereAmIView.update(TreeView.currentSelection);
        InputView.show(clickedNode, nodeDataModel, parentNodeDataModel, pastOngoingInstructions, pastAndFutureQuestions);
        InputView.selectFirstInput();
        

//###
        // Is this necessary in onNodeClicked()
        /*
        validationResult = InputValidator.inputIsValid(clickedNode, nodeDataModel, parentNodeDataModel);
        if (validationResult === true) {
            InputView.hideAlert();
            InputView.enableInputs();
            TreeView.enableNodeActions();
            ImportExportView.enableSaveButton();
        }
        else {
            validationResult.correspondingNode.click();
            InputView.showAlert(validationResult.alert);
            InputView.enableInputs();
            InputView.disableInputsExcept(validationResult.invalidInput);
            TreeView.disableNodeActions();
            ImportExportView.disableSaveButton();
        }
        */
//###


    }
}

function onAddNode(event) {
    let clickedNode = event.data.target,
    experiment,
    newNode,
    newNodeData,
    nodeToUpdateData,
    previousNodeData,
    nextNodeData,
    stepType,
    questionType;

    // First step:
    // Extending and updating the data model
    if (event.type === Config.EVENT_ADD_CHILD_NODE) {
        // Initial step and question types when adding a node
        if (clickedNode.type === Config.TYPE_SURVEY) {
            stepType = Config.STEP_TYPE_INSTRUCTION;
        }
        if (clickedNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            questionType = Config.QUESTION_TYPE_TEXT;
        }
        newNodeData = ModelManager.extendExperiment(clickedNode, undefined, stepType, questionType);
    }
    else {
        // Initial step and question types when adding a node
        if (clickedNode.parentNode !== undefined
            && clickedNode.parentNode.type === Config.TYPE_SURVEY) {
            stepType = Config.STEP_TYPE_INSTRUCTION;
        }
        if (clickedNode.parentNode !== undefined
            && clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            questionType = Config.QUESTION_TYPE_TEXT;
        }
        newNodeData = ModelManager.extendExperiment(clickedNode.parentNode, undefined, stepType, questionType);
    }
    experiment = ModelManager.getExperiment();

    if (event.type === Config.EVENT_ADD_CHILD_NODE) {
        if (clickedNode.type === Config.QUESTION_TYPE_CHOICE) {

            nodeToUpdateData = ModelManager.getDataFromNodeId(clickedNode.id, experiment);
            if (clickedNode.previousNode !== undefined) {
                previousNodeData = ModelManager.getDataFromNodeId(clickedNode.previousNode.id, experiment);
            }
            if (clickedNode.nextNode !== undefined) {
                nextNodeData = ModelManager.getDataFromNodeId(clickedNode.nextNode.id, experiment);
            }
        }
    }
    else {

        if (clickedNode.type === Config.TYPE_ANSWER) {

            nodeToUpdateData = ModelManager.getDataFromNodeId(clickedNode.parentNode.id, experiment);
            if (clickedNode.parentNode.nextNode !== undefined) {
                nextNodeData = ModelManager.getDataFromNodeId(clickedNode.parentNode.nextNode.id, experiment);
            }
            if (clickedNode.parentNode.previousNode !== undefined) {
                previousNodeData = ModelManager.getDataFromNodeId(clickedNode.parentNode.previousNode.id, experiment);
            }
        }
        if (event.type === Config.EVENT_ADD_PREVIOUS_NODE) {
            if (clickedNode.parentNode !== undefined
                && (clickedNode.parentNode.type === Config.TYPE_SURVEY
                    || clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE)) {
    
                nodeToUpdateData = newNodeData;
                if (clickedNode.previousNode !== undefined) {
                    previousNodeData = ModelManager.getDataFromNodeId(clickedNode.previousNode.id, experiment);
                }
                nextNodeData = ModelManager.getDataFromNodeId(clickedNode.id, experiment);
            }
        }
        if (event.type === Config.EVENT_ADD_NEXT_NODE) {
            if (clickedNode.parentNode !== undefined
                && (clickedNode.parentNode.type === Config.TYPE_SURVEY
                    || clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE)) {
    
                nodeToUpdateData = newNodeData;
                if (clickedNode.nextNode !== undefined) {
                    nextNodeData = ModelManager.getDataFromNodeId(clickedNode.nextNode.id, experiment);
                }
                previousNodeData = ModelManager.getDataFromNodeId(clickedNode.id, experiment);
            }
        }
    }
    if (event.type === Config.EVENT_ADD_CHILD_NODE) {
        if (clickedNode.type === Config.QUESTION_TYPE_CHOICE) {
            ModelManager.updateQuestionLinks(nodeToUpdateData, previousNodeData, nextNodeData, undefined, true);
        }
    }
    else {
        if (clickedNode.parentNode !== undefined) {
            if (clickedNode.type === Config.TYPE_ANSWER
                || clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    ModelManager.updateQuestionLinks(nodeToUpdateData, previousNodeData, nextNodeData, undefined, true);
            }
            if (clickedNode.parentNode.type === Config.TYPE_SURVEY) {
                ModelManager.updateStepLinks(nodeToUpdateData, previousNodeData, nextNodeData);
            }
        }
    }
    
    // Second step:
    // Updating the views
    newNode = TreeView.createSubtree(newNodeData);
    if (event.type === Config.EVENT_ADD_NEXT_NODE) {
        TreeView.updateNodeLinks(newNodeData, clickedNode.parentNode, clickedNode, clickedNode.nextNode);
    }
    if (event.type === Config.EVENT_ADD_PREVIOUS_NODE) {
        TreeView.updateNodeLinks(newNodeData, clickedNode.parentNode, clickedNode.previousNode, clickedNode);
    }
    if (event.type === Config.EVENT_ADD_CHILD_NODE) {
        TreeView.updateNodeLinks(newNodeData, clickedNode, undefined, undefined);
    }
    TreeView.clickNode(newNode, undefined);
}

function onChangeNode(event) {
    let nodeToChange = event.data.target,
    stepType = event.data.stepType,
    questionType = event.data.questionType,
    experiment = ModelManager.getExperiment(),
    nodeToChangeData = ModelManager.getDataFromNodeId(nodeToChange.id, experiment),
    initialProperties = {
        id: nodeToChange.id,
    },
    newNode,
    newNodeData,
    nextNodeData;
    
    if (nodeToChange.nextNode !== undefined) {
        nextNodeData = ModelManager.getDataFromNodeId(nodeToChange.nextNode.id, experiment);
    }

    // First step:
    // Shortening, extending and updating the data model
    ModelManager.removeSubtreeResources(nodeToChange, experiment);
    ModelManager.shortenExperiment(nodeToChange, nodeToChange.parentNode);
    newNodeData = ModelManager.extendExperiment(nodeToChange.parentNode, initialProperties, stepType, questionType);
    experiment = ModelManager.getExperiment();
    if (stepType !== undefined) {
        // If the node to change is a node with a duration (detailed example in onNodeClicked()),
        // next steps could wait for it. Those steps have to be updated to wait for no step anymore.
        if (nodeToChangeData.durationInMin !== undefined
            && nodeToChangeData.durationInMin > 0
            && nextNodeData !== undefined) {
                ModelManager.removeWaitForStepLinks(nextNodeData, nodeToChangeData, experiment);
        }
    }

    // Second step:
    // Updating the views
    TreeView.removeSubtree(nodeToChange);
    newNode = TreeView.createSubtree(newNodeData);
    TreeView.updateNodeLinks(newNodeData, nodeToChange.parentNode, nodeToChange.previousNode, nodeToChange.nextNode);
    TreeView.clickNode(newNode, undefined);
}

function onSwitchNodes(event) {
    let experiment = ModelManager.getExperiment(),
    // The switching pair
    rightNode,
    leftNode,
    // The node before the switching pair
    previousNode,
    // Tthe node after the switching pair
    nextNode,
    rightNodeData,
    leftNodeData,
    previousNodeData,
    nextNodeData,
    nextFocusedNode = event.data.target;

    if (event.type === Config.EVENT_MOVE_NODE_LEFT) {
        rightNode = event.data.target;
        leftNode = rightNode.previousNode;
    }
    else {
        leftNode = event.data.target;
        rightNode = leftNode.nextNode;
    }
    previousNode = leftNode.previousNode;
    nextNode = rightNode.nextNode;
    
    // First step:
    // Updating the data model
    rightNodeData = ModelManager.getDataFromNodeId(rightNode.id, experiment);
    leftNodeData = ModelManager.getDataFromNodeId(leftNode.id, experiment);
    if (previousNode !== undefined) {
        previousNodeData = ModelManager.getDataFromNodeId(previousNode.id, experiment);
    }
    if (nextNode !== undefined) {
        nextNodeData = ModelManager.getDataFromNodeId(nextNode.id, experiment);
    }
    
    if (rightNode.parentNode.type === Config.TYPE_SURVEY) {
        if (rightNodeData.waitForStep === leftNodeData.id) {
            rightNodeData.waitForStep = 0;
        }
        ModelManager.updateStepLinks(rightNodeData, previousNodeData, leftNodeData);
        ModelManager.updateStepLinks(leftNodeData, rightNodeData, nextNodeData);
    }

    if (rightNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        ModelManager.updateQuestionLinks(rightNodeData, previousNodeData, leftNodeData, undefined, true);
        ModelManager.updateQuestionLinks(leftNodeData, rightNodeData, nextNodeData, undefined, true);
    }

    // Second step:
    // Updating the views
    TreeView.switchNodes(leftNode, rightNode, previousNode, nextNode);
    TreeView.clickNode(nextFocusedNode, undefined);
}

function onTimelineClicked(event) {
    let timelineNode = event.data.correspondingNode,
    experiment = ModelManager.getExperiment(),
    timelineNodeData = ModelManager.getDataFromNodeId(timelineNode.id, experiment),
    properties = {
        absoluteStartDaysOffset: event.data.absoluteStartDaysOffset,
        absoluteStartAtHour: event.data.absoluteStartAtHour,
        absoluteStartAtMinute: event.data.absoluteStartAtMinute,
    },
    timeInMin = properties.absoluteStartDaysOffset * 24 * 60 + properties.absoluteStartAtHour * 60 + properties.absoluteStartAtMinute, // eslint-disable-line no-magic-numbers
    newSurveyNode,
    newSurveyData,
    previousSurveyNode,
    nextSurveyNode,
    // The survey with the greatest start time
    lastSurveyData;


//###
    // TODO: Check if a clicking scope is necessary or if the timeline can be clicked from anywhere
//###


    // First step:
    // Extending, updating and shortening the data model
    newSurveyData = ModelManager.extendExperiment(timelineNode, properties, undefined, undefined);
    lastSurveyData = ModelManager.updateSurveyLinks(timelineNodeData);
    experiment = ModelManager.getExperiment();

    // Second step:
    // Updating the views
    if (newSurveyData.previousSurveyId !== undefined) {
        previousSurveyNode = ModelManager.getDataFromNodeId(newSurveyData.previousSurveyId, experiment);
    }
    if (newSurveyData.nextSurveyId !== undefined) {
        nextSurveyNode = ModelManager.getDataFromNodeId(newSurveyData.nextSurveyId, experiment);
    }
    newSurveyNode = TreeView.createSubtree(newSurveyData);
    TreeView.updateNodeLinks(newSurveyData, timelineNode, previousSurveyNode, nextSurveyNode);
    timelineNode.updateNodeTimeMap(newSurveyNode.id, timeInMin);
    timelineNode.updateTimelineLength(lastSurveyData);
    TreeView.clickNode(newSurveyNode, undefined);
}

// *** InputView callback functions:
// **
// *

function onRemoveNode(event) {
    let nodeToRemove = event.data.correspondingNode,
    experiment = ModelManager.getExperiment(),
    nodeToRemoveData = ModelManager.getDataFromNodeId(nodeToRemove.id, experiment),
    parentNodeData,
    previousNodeData,
    nextNodeData,
    previousPreviousNodeData,
    nextNextNodeData,
    nextFocusedNode,
    timelineNodeData,
    lastSurveyData;

    if (nodeToRemove.parentNode !== undefined) {
        parentNodeData = ModelManager.getDataFromNodeId(nodeToRemove.parentNode.id, experiment);
        nextFocusedNode = nodeToRemove.parentNode;
    }
    if (nodeToRemove.previousNode !== undefined) {
        if (nodeToRemove.previousNode.previousNode !== undefined) {
            previousPreviousNodeData = ModelManager.getDataFromNodeId(nodeToRemove.previousNode.previousNode.id, experiment);
        }
        previousNodeData = ModelManager.getDataFromNodeId(nodeToRemove.previousNode.id, experiment);
        nextFocusedNode = nodeToRemove.previousNode;
    }
    if (nodeToRemove.nextNode !== undefined) {
        if (nodeToRemove.nextNode.nextNode !== undefined) {
            nextNextNodeData = ModelManager.getDataFromNodeId(nodeToRemove.nextNode.nextNode.id, experiment);
        }
        nextNodeData = ModelManager.getDataFromNodeId(nodeToRemove.nextNode.id, experiment);
        nextFocusedNode = nodeToRemove.nextNode;
    }
    
    // First step:
    // Updating and shortening the data model
    ModelManager.removeSubtreeResources(nodeToRemove, experiment);
    ModelManager.shortenExperiment(nodeToRemove, nodeToRemove.parentNode);
    experiment = ModelManager.getExperiment();
    if (nodeToRemove.parentNode !== undefined) {
        if (nodeToRemove.parentNode.type === Config.TYPE_SURVEY) {
            if (previousNodeData !== undefined) {
                ModelManager.updateStepLinks(previousNodeData, previousPreviousNodeData, nextNodeData);
            }
            if (nextNodeData !== undefined) {
                ModelManager.updateStepLinks(nextNodeData, previousNodeData, nextNextNodeData);
            }
            // If the node to change is a node with a duration (detailed example in onNodeClicked()),
            // next steps could wait for it. Those steps have to be updated to wait for no step anymore.
            if (nodeToRemoveData.durationInMin !== undefined
                && nodeToRemoveData.durationInMin > 0
                && nextNodeData !== undefined) {
                    experiment = ModelManager.getExperiment();
                    ModelManager.removeWaitForStepLinks(nextNodeData, nodeToRemoveData, experiment);
            }
        }
        if (nodeToRemove.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            experiment = ModelManager.getExperiment();
            timelineNodeData = ModelManager.getDataFromNodeId(nodeToRemove.parentNode.id, experiment);
            lastSurveyData = ModelManager.updateSurveyLinks(timelineNodeData);
        }
        if (nodeToRemove.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            ModelManager.updateQuestionLinks(previousNodeData, previousPreviousNodeData, nextNodeData, nodeToRemoveData, false);
            ModelManager.updateQuestionLinks(nextNodeData, previousNodeData, nextNextNodeData, nodeToRemoveData, false);
        }
    }

    // Second step:
    // Updating the views
    if (nodeToRemove.parentNode !== undefined
        && nodeToRemove.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            nodeToRemove.parentNode.shortenNodeTimeMap(nodeToRemove.id);
            nodeToRemove.parentNode.updateTimelineLength(lastSurveyData);
    }
    TreeView.removeSubtree(nodeToRemove);
    TreeView.clickNode(nextFocusedNode, undefined);
}

function onInputChanged(event) {
    let dataChangingNode = event.data.correspondingNode,
    experiment = ModelManager.getExperiment(),
    newDataProperties = event.data.newModelProperties,
    updatedNodeData,
    parentNode,
    parentNodeData,
    previousNode,
    previousNodeData,
    nextNode,
    nextNodeData,
    lastSurveyData,
    fileName,
    addResourceResult,
    timeInMin,
    validationResult;


//###
    // TODO survey frequency buttons; Label is not hidden when an alert in InputView is triggered
    // console.log(newDataProperties.surveyFrequency);
//###


    if (dataChangingNode.parentNode !== undefined) {
        parentNode = dataChangingNode.parentNode;
        parentNodeData = ModelManager.getDataFromNodeId(parentNode.id, experiment);
    }
    if (dataChangingNode.nextNode !== undefined) {
        nextNode = dataChangingNode.nextNode;
        nextNodeData = ModelManager.getDataFromNodeId(nextNode.id, experiment);
    }
    if (dataChangingNode.previousNode !== undefined) {
        previousNode = dataChangingNode.previousNode;
        previousNodeData = ModelManager.getDataFromNodeId(previousNode.id, experiment);
    }

    // First step:
    // Updating the data model
    ModelManager.updateExperiment(newDataProperties);
    experiment = ModelManager.getExperiment();
    updatedNodeData = ModelManager.getDataFromNodeId(dataChangingNode.id, experiment);
    if (dataChangingNode.parentNode !== undefined
        && dataChangingNode.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            lastSurveyData = ModelManager.updateSurveyLinks(parentNodeData);
    }
    if (dataChangingNode.type === Config.STEP_TYPE_INSTRUCTION) {
        if (dataChangingNode.nextNode !== undefined
            && newDataProperties.durationInMin === 0) {
                nextNodeData = ModelManager.getDataFromNodeId(dataChangingNode.nextNode.id, experiment);
                ModelManager.removeWaitForStepLinks(nextNodeData, updatedNodeData, experiment);
        }
        if (newDataProperties.imageFileName !== undefined) {
            fileName = newDataProperties.imageFileName;
        }
        if (newDataProperties.videoFileName !== undefined){
            fileName = newDataProperties.videoFileName;
        }
        if (fileName === null) {
            ModelManager.removeResource(event.data.previousFileName);
        }
        if (fileName !== undefined && fileName !== null) {
            addResourceResult = ModelManager.addResource(event.data.resourceFile);
            addResourceResult.then(
                function() {
                    LoadingScreenView.hide();
                },
                function(error) {
                    newDataProperties.imageFileName = null;
                    newDataProperties.videoFileName = null;
                    ModelManager.updateExperiment(newDataProperties);
                    InputView.clearFileInputs();
                    LoadingScreenView.hide();
                    if (error.toString().includes("The serialized value is too large")) {
                        alert(Config.FILE_TOO_LARGE + " (" + fileName + ")"); // eslint-disable-line no-alert
                    }
                    else if (error.toString().includes("The current transaction exceeded its quota limitations.")) {
                        alert(Config.DATABASE_FULL + " (" + fileName + ")"); // eslint-disable-line no-alert
                    }
                    else {
                        alert(error.toString() + " (" + fileName + ")"); // eslint-disable-line no-alert
                    }
                }
            );
        }
    }
    if (dataChangingNode.type === Config.QUESTION_TYPE_CHOICE) {
        ModelManager.updateQuestionLinks(updatedNodeData, previousNodeData, nextNodeData, undefined, false);
    }

    // Second step:
    // Updating the views
    TreeView.updateNodeLinks(updatedNodeData, parentNode, previousNode, nextNode);
    if (updatedNodeData.absoluteStartDaysOffset !== undefined
        && updatedNodeData.absoluteStartAtHour !== undefined
        && updatedNodeData.absoluteStartAtMinute !== undefined) {
            timeInMin = updatedNodeData.absoluteStartDaysOffset * 24 * 60 + updatedNodeData.absoluteStartAtHour * 60 + updatedNodeData.absoluteStartAtMinute; // eslint-disable-line no-magic-numbers
            parentNode.updateNodeTimeMap(dataChangingNode.id, timeInMin);
            parentNode.updateTimelineLength(lastSurveyData);
    }
    if (updatedNodeData.name !== undefined) {
        dataChangingNode.updateDescription(updatedNodeData.name);
    }
    if (updatedNodeData.text !== undefined && dataChangingNode.type === Config.TYPE_ANSWER) {
        dataChangingNode.updateDescription(updatedNodeData.text);
    }
    WhereAmIView.update(this.currentSelection);
    TreeView.navigateToNode(dataChangingNode);

    validationResult = InputValidator.inputIsValid(dataChangingNode, updatedNodeData, parentNodeData);
    if (validationResult === true) {
        InputView.hideAlert();
        InputView.enableInputs();
        TreeView.enableNodeActions();
        ImportExportView.enableSaveButton();
    }
    else {
        validationResult.correspondingNode.click();
        InputView.showAlert(validationResult.alert);
        InputView.enableInputs();
        InputView.disableInputsExcept(validationResult.invalidInput);
        TreeView.disableNodeActions();
        ImportExportView.disableSaveButton();
    }
}

export default new Controller();