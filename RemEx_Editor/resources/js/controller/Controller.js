import ModelManager from "../utils/ModelManager.js";
import TreeView from "../views/TreeView.js";
import InputView from "../views/InputView.js";
import WhereAmIView from "../views/WhereAmIView.js";
import LoadingScreenView from "../views/LoadingScreenView.js";
import ImportExportView from "../views/ImportExportView.js";
import InputValidator from "../utils/InputValidator.js";
import ShortcutManager from "../utils/ShortcutManager.js";
import SvgFactory from "../utils/SvgFactory.js";
import Config from "../utils/Config.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO:
// -> Code cleaning
// -> Survey frequency buttons
// -> Copy paste option?
// -> Test phase: Test the RemExEditor functionality
// -> Create .exe file for install
// -> MIT Licence: Licence text on top of each file and after that the contibutors
// -> RemEx Logo in the top left corner
// -> InfoView
// APP:
// -> Test phase: Test fully grown experiment on RemExApp
// -> RemEx Logo as App icon

// ENHANCEMENT:
// EDITOR:
// - Group node svg elements together in SvgFactory so that NodeView.updatePosition only needs to update the group element position
// - Visualising the question links of answer nodes inside the TreeView
// - Add key movement (Shortcuts (e.g. Arrows -> navigating through tree, Ctrl + ArrowRight -> addNextNode, Shift + ArrowLeft -> moveNodeLeft, Strg + S -> Save experiment, ...))
// - Show survey time windows on the timeline (survey.startTimeInMin |-------| survey.startTimeInMin + survey.maxDurationInMin + survey.notificationDurationInMin)
// - Calculate the optimal duration for a survey depending on its content
// - Survey time randomization
// APP:
// - Important: If the device is turned off, the current experiment is finished and can't be resumed (Issues with receiving a boot completed action from the system, to resume the experiment)
// - Important: Same problem when the user kills the app (swipes it away in the recent apps list) during an experiment between two surveys (not during a survey). If the user kills the app during a survey the survey gets properly finished and the next survey alarm is set
// - Logging user interactions that are relevant for the researchers
// BOTH:
// - Special characters like german "Umlaute" (äöü) are not represented correctly -> Solve this issue by: (RemEx Editor) Encode the experimentJSON with ISO-8859-1 inside the ImportExportView.js and add it to JSZip as bytes; (RemEx App) change the StandardCharsets value inside AdminActivity.java from UTF_8 to ISO_8859_1
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
                callback: onNodeMouseEnter,
            },
            {
                eventType: Config.EVENT_NODE_MOUSE_LEAVE,
                callback: onNodeMouseLeave,
            },
            {
                eventType: Config.EVENT_NODE_CLICKED,
                callback: onNodeClicked,
            },
            {
                eventType: Config.EVENT_ADD_NEXT_NODE,
                callback: onAddNode,
            },
            {
                eventType: Config.EVENT_ADD_PREVIOUS_NODE,
                callback: onAddNode,
            },
            {
                eventType: Config.EVENT_ADD_CHILD_NODE,
                callback: onAddNode,
            },
            {
                eventType: Config.EVENT_TIMELINE_CLICKED,
                callback: onTimelineClicked,
            },
            {
                eventType: Config.EVENT_MOVE_NODE_RIGHT,
                callback: onSwitchNodes,
            },
            {
                eventType: Config.EVENT_MOVE_NODE_LEFT,
                callback: onSwitchNodes,
            },
        ],
        inputViewEventListener = [
            {
                eventType: Config.EVENT_INPUT_CHANGED,
                callback: onInputChanged,
            },
            {
                eventType: Config.EVENT_REMOVE_NODE,
                callback: onRemoveNode,
            },
            {
                eventType: Config.EVENT_CHANGE_NODE,
                callback: onChangeNode,
            },
            {
                eventType: Config.EVENT_UPLOAD_RESOURCE,
                callback: onUploadResource,
            },
        ],
        importExportViewEventListener = [
            {
                eventType: Config.EVENT_SAVE_EXPERIMENT,
                callback: onSaveExperiment,
            },
            {
                eventType: Config.EVENT_SAVING_PROGRESS,
                callback: onSaveExperimentProgress,
            },
            {
                eventType: Config.EVENT_EXPERIMENT_SAVED,
                callback: onExperimentSaved,
            },
            {
                eventType: Config.EVENT_UPLOAD_EXPERIMENT,
                callback: onUploadExperiment,
            },
            {
                eventType: Config.EVENT_EXPERIMENT_UPLOAD_STARTED,
                callback: onExperimentUploadStarted,
            },
            {
                eventType: Config.EVENT_EXPERIMENT_UPLOADED,
                callback: onExperimentUploaded,
            },
            {
                eventType: Config.EVENT_NEW_EXPERIMENT,
                callback: onNewExperiment,
            },
        ],
        shortcutManagerEventListener = [
            {
                eventType: Config.EVENT_COPY_NODE,
                callback: onCopyNode,
            },
            {
                eventType: Config.EVENT_PASTE_NODE,
                callback: onPasteNode,
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
        ModelManager.setIds(experiment);

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

        // ShortcutManager (Handles key shortcuts like copy/paste, save, etc.)
        ShortcutManager.init();
        for (let listener of shortcutManagerEventListener) {
            ShortcutManager.addEventListener(listener.eventType, listener.callback);
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
    
    
    // TODO: Validate whole Experiment
    
    
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
        ImportExportView.importExperiment();
    }
}

function onExperimentUploadStarted() {
    LoadingScreenView.show(Config.UPLOADING_PROMPT);
}

function onExperimentUploaded(event) {
    let newNode;
    
    LoadingScreenView.hide();
    if (event.data.success) {
        ModelManager.removeExperiment();
        TreeView.removeSubtree(TreeView.rootNode);
    
        ModelManager.saveExperiment(event.data.experiment);
        ModelManager.setIds(event.data.experiment);
        for (let resource of event.data.resources) {
            ModelManager.addResource(resource);
        }  
        newNode = TreeView.createSubtree(event.data.experiment);
        TreeView.updateNodeLinks(event.data.experiment, undefined, undefined, undefined);
        TreeView.clickNode(newNode, undefined);
    }
}

function onNewExperiment() {
    let experiment,
    newNode;

    if (confirm(Config.NEW_EXPERIMENT_ALERT)) {

        TreeView.removeSubtree(TreeView.rootNode);
        ModelManager.removeExperiment();
        experiment = ModelManager.initExperiment();
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

    if (!TreeView.currentSelection.includes(hoveredNode)
            || (hoveredNode.type === Config.TYPE_SURVEY
                && hoveredNode !== TreeView.currentFocusedNode)) {
        hoveredNode.emphasize();
    }


//###
    // TODO: InfoView
//###


}

function onNodeMouseLeave(event) {
    let hoveredNode = event.data.target;
    
    if (!TreeView.currentSelection.includes(hoveredNode)
            || (hoveredNode.type === Config.TYPE_SURVEY
                && hoveredNode !== TreeView.currentFocusedNode)) {
        hoveredNode.deemphasize();
    }


//###
    // TODO: InfoView
//###


}

function onNodeClicked(event) {
    let clickedNode = event.data.target,
    nodeData = ModelManager.getDataById(clickedNode.id),
    parentNodeDataModel,
    pastOngoingInstructions,
    firstNodeOfRow,
    pastAndFutureQuestions,
    promise,
    childNodeData,
    timeInMin,
    timelineNodeData,
    lastSurveyData;

    if (clickedNode !== TreeView.currentFocusedNode) {
        if (clickedNode.parentNode !== undefined) {
            parentNodeDataModel = ModelManager.getDataById(clickedNode.parentNode.id);
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
            if (nodeData.imageFileName !== null) {
                promise = ModelManager.getResource(nodeData.imageFileName);
            }
            if (nodeData.videoFileName !== null) {
                promise = ModelManager.getResource(nodeData.videoFileName);
            }
            if (promise !== undefined) {
                promise.then(function(result) {
                    if (typeof(result) === "string" || result === undefined) {
                        alert(Config.LOADING_RESOURCE_FAILED + " (" + result + ")"); // eslint-disable-line no-alert
                        InputView.clearFileInputs();
                    }
                    else {
                        if (result.type.includes("image/")) {
                            if (nodeData.imageFileName !== null) {
                                InputView.setImageResource(result, nodeData.id);
                            }
                        }
                        if (result.type.includes("video/")) {
                            if (nodeData.videoFileName !== null) {
                                InputView.setVideoResource(result, nodeData.id);
                            }
                        }
                    }
                });
            }
        }
//###


        if (clickedNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            if (clickedNode.childNodes.length === 0) {
                clickedNode.clearNodeTimeMap();
            }
            else {
                for (let childNode of clickedNode.childNodes) {
                    childNodeData = ModelManager.getDataById(childNode.id);
                    timeInMin = childNodeData.absoluteStartDaysOffset * 24 * 60 + childNodeData.absoluteStartAtHour * 60 + childNodeData.absoluteStartAtMinute; // eslint-disable-line no-magic-numbers
                    clickedNode.updateNodeTimeMap(childNode.id, timeInMin);
                }
                timelineNodeData = ModelManager.getDataById(clickedNode.id);
                lastSurveyData = ModelManager.getLastSurveyData(timelineNodeData);
                TreeView.updateTimelineLength(clickedNode, lastSurveyData);
            }
        }
        TreeView.navigateToNode(clickedNode);
        WhereAmIView.update(TreeView.currentSelection);
        InputView.hideAlert();
        InputView.show(clickedNode, nodeData, parentNodeDataModel, pastOngoingInstructions, pastAndFutureQuestions);
    }
}

function onAddNode(event) {
    let clickedNode = event.data.target,
    newNode,
    newNodeData = event.data.nodeData,
    nodeToUpdateData,
    previousNodeData,
    nextNodeData,
    initialProperties = {};

    // First step:
    // Extending and updating the data model
    if (newNodeData === undefined) {
        if (event.type === Config.EVENT_ADD_CHILD_NODE) {
            // Initial step and question types when adding a node
            if (clickedNode.type === Config.TYPE_SURVEY) {
                initialProperties.type = Config.STEP_TYPE_QUESTIONNAIRE;
            }
            if (clickedNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                initialProperties.type = Config.QUESTION_TYPE_CHOICE;
            }
            newNodeData = ModelManager.extendExperiment(clickedNode, initialProperties);
        }
        else {
            // Initial step and question types when adding a node
            if (clickedNode.parentNode !== undefined
                && clickedNode.parentNode.type === Config.TYPE_SURVEY) {
                    initialProperties.type = Config.STEP_TYPE_QUESTIONNAIRE;
            }
            if (clickedNode.parentNode !== undefined
                && clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    initialProperties.type = Config.QUESTION_TYPE_CHOICE;
            }
            newNodeData = ModelManager.extendExperiment(clickedNode.parentNode, initialProperties);
        }
    }

    if (event.type === Config.EVENT_ADD_CHILD_NODE) {
        if (clickedNode.type === Config.QUESTION_TYPE_CHOICE) {

            nodeToUpdateData = ModelManager.getDataById(clickedNode.id);
            if (clickedNode.previousNode !== undefined) {
                previousNodeData = ModelManager.getDataById(clickedNode.previousNode.id);
            }
            if (clickedNode.nextNode !== undefined) {
                nextNodeData = ModelManager.getDataById(clickedNode.nextNode.id);
            }
        }
    }
    else {

        if (clickedNode.type === Config.TYPE_ANSWER) {

            nodeToUpdateData = ModelManager.getDataById(clickedNode.parentNode.id);
            if (clickedNode.parentNode.nextNode !== undefined) {
                nextNodeData = ModelManager.getDataById(clickedNode.parentNode.nextNode.id);
            }
            if (clickedNode.parentNode.previousNode !== undefined) {
                previousNodeData = ModelManager.getDataById(clickedNode.parentNode.previousNode.id);
            }
        }
        if (event.type === Config.EVENT_ADD_PREVIOUS_NODE) {
            if (clickedNode.parentNode !== undefined
                && (clickedNode.parentNode.type === Config.TYPE_SURVEY
                    || clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE)) {
    
                nodeToUpdateData = newNodeData;
                if (clickedNode.previousNode !== undefined) {
                    previousNodeData = ModelManager.getDataById(clickedNode.previousNode.id);
                }
                nextNodeData = ModelManager.getDataById(clickedNode.id);
            }
        }
        if (event.type === Config.EVENT_ADD_NEXT_NODE) {
            if (clickedNode.parentNode !== undefined
                && (clickedNode.parentNode.type === Config.TYPE_SURVEY
                    || clickedNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE)) {
    
                nodeToUpdateData = newNodeData;
                if (clickedNode.nextNode !== undefined) {
                    nextNodeData = ModelManager.getDataById(clickedNode.nextNode.id);
                }
                previousNodeData = ModelManager.getDataById(clickedNode.id);
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
    newNodeData = ModelManager.getDataById(newNodeData.id);
    console.log("After add:", ModelManager.getExperiment());
    
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
    nodeToChangeData = ModelManager.getDataById(nodeToChange.id),
    stepType = event.data.stepType,
    questionType = event.data.questionType,
    initialProperties = {},
    newNode,
    newNodeData,
    nextNodeData,
    previousNodeData;
    
    if (stepType !== undefined) {
        initialProperties.type = event.data.stepType;
    }
    if (questionType !== undefined) {
        initialProperties.type = event.data.questionType;
    }

    // First step:
    // Shortening, extending and updating the data model
    ModelManager.removeSubtreeResources(nodeToChange);
    ModelManager.shortenExperiment(nodeToChange, nodeToChange.parentNode);
    newNodeData = ModelManager.extendExperiment(nodeToChange.parentNode, initialProperties);
    if (stepType !== undefined) {
        // If the node to change is a node with a duration (detailed example in onNodeClicked()),
        // next steps could wait for it. Those steps have to be updated to wait for no step anymore.
        if (nodeToChangeData.durationInMin !== undefined
            && nodeToChangeData.durationInMin > 0
            && nextNodeData !== undefined) {
                if (nodeToChange.nextNode !== undefined) {
                    nextNodeData = ModelManager.getDataById(nodeToChange.nextNode.id);
                }
                nodeToChangeData = ModelManager.getDataById(nodeToChange.id);
                ModelManager.removeWaitForStepLinks(nextNodeData, nodeToChangeData);
        }
        newNodeData = ModelManager.getDataById(newNodeData.id);
        if (nodeToChange.previousNode !== undefined) {
            previousNodeData = ModelManager.getDataById(nodeToChange.previousNode.id);
        }
        if (nodeToChange.nextNode !== undefined) {
            nextNodeData = ModelManager.getDataById(nodeToChange.nextNode.id);
        }
        ModelManager.updateStepLinks(newNodeData, previousNodeData, nextNodeData);
    }
    else {
        newNodeData = ModelManager.getDataById(newNodeData.id);
        if (nodeToChange.previousNode !== undefined) {
            previousNodeData = ModelManager.getDataById(nodeToChange.previousNode.id);
        }
        if (nodeToChange.nextNode !== undefined) {
            nextNodeData = ModelManager.getDataById(nodeToChange.nextNode.id);
        }
        ModelManager.updateQuestionLinks(newNodeData, previousNodeData, nextNodeData, undefined, false);
    }
    newNodeData = ModelManager.getDataById(newNodeData.id);
    console.log("After change", ModelManager.getExperiment());

    // Second step:
    // Updating the views
    TreeView.removeSubtree(nodeToChange);
    newNode = TreeView.createSubtree(newNodeData);
    TreeView.updateNodeLinks(newNodeData, nodeToChange.parentNode, nodeToChange.previousNode, nodeToChange.nextNode);
    TreeView.clickNode(newNode, undefined);
}

function onSwitchNodes(event) {
    // The switching pair
    let rightNode,
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
    rightNodeData = ModelManager.getDataById(rightNode.id);
    leftNodeData = ModelManager.getDataById(leftNode.id);
    if (previousNode !== undefined) {
        previousNodeData = ModelManager.getDataById(previousNode.id);
    }
    if (nextNode !== undefined) {
        nextNodeData = ModelManager.getDataById(nextNode.id);
    }
    
    if (event.data.target.parentNode.type === Config.TYPE_SURVEY) {
        if (rightNodeData.waitForStep === leftNodeData.id) {
            rightNodeData.waitForStep = 0;
        }
        ModelManager.updateStepLinks(rightNodeData, previousNodeData, leftNodeData);
        rightNodeData = ModelManager.getDataById(rightNode.id);
        leftNodeData = ModelManager.getDataById(leftNode.id);
        ModelManager.updateStepLinks(leftNodeData, rightNodeData, nextNodeData);
    }

    if (event.data.target.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        ModelManager.updateQuestionLinks(rightNodeData, previousNodeData, leftNodeData, rightNodeData, true);
        rightNodeData = ModelManager.getDataById(rightNode.id);
        leftNodeData = ModelManager.getDataById(leftNode.id);
        ModelManager.updateQuestionLinks(leftNodeData, rightNodeData, nextNodeData, rightNodeData, true);
    }
    console.log("After switch:", ModelManager.getExperiment());

    // Second step:
    // Updating the views
    TreeView.switchNodes(leftNode, rightNode, previousNode, nextNode);
    TreeView.currentFocusedNode = undefined;
    TreeView.clickNode(nextFocusedNode, undefined);
}

function onTimelineClicked(event) {
    let timelineNode = event.data.correspondingNode,
    timelineNodeData,
    properties = {
        absoluteStartDaysOffset: event.data.absoluteStartDaysOffset,
        absoluteStartAtHour: event.data.absoluteStartAtHour,
        absoluteStartAtMinute: event.data.absoluteStartAtMinute,
    },
    timeInMin = properties.absoluteStartDaysOffset * 24 * 60 + properties.absoluteStartAtHour * 60 + properties.absoluteStartAtMinute, // eslint-disable-line no-magic-numbers
    newSurveyNode,
    newSurveyData = event.data.nodeData,
    previousSurveyNode,
    nextSurveyNode,
    // The survey with the greatest start time
    lastSurveyData;

    console.log("Add node");
//###
    // TODO: Check if a clicking scope is necessary or if the timeline can be clicked from anywhere
//###


    // First step:
    // Extending, updating and shortening the data model
    if (newSurveyData === undefined) {
        newSurveyData = ModelManager.extendExperiment(timelineNode, properties);
    }
    timelineNodeData = ModelManager.getDataById(timelineNode.id);
    lastSurveyData = ModelManager.updateSurveyLinks(timelineNodeData);
    newSurveyData = ModelManager.getDataById(newSurveyData.id);
    console.log("After timeline add", ModelManager.getExperiment());

    // Second step:
    // Updating the views
    if (newSurveyData.previousSurveyId !== undefined) {
        previousSurveyNode = TreeView.getNodeById(newSurveyData.previousSurveyId);
    }
    if (newSurveyData.nextSurveyId !== undefined) {
        nextSurveyNode = TreeView.getNodeById(newSurveyData.nextSurveyId);
    }
    newSurveyNode = TreeView.createSubtree(newSurveyData);
    TreeView.updateNodeLinks(newSurveyData, timelineNode, previousSurveyNode, nextSurveyNode);
    timelineNode.updateNodeTimeMap(newSurveyNode.id, timeInMin);
    TreeView.updateTimelineLength(timelineNode, lastSurveyData);
    TreeView.clickNode(newSurveyNode, undefined);
}

// *** InputView callback functions:
// **
// *

function onRemoveNode(event) {
    let nodeToRemove = event.data.correspondingNode,
    nodeToRemoveData = ModelManager.getDataById(nodeToRemove.id),
    previousNodeData,
    nextNodeData,
    previousPreviousNodeData,
    nextNextNodeData,
    nextFocusedNode,
    timelineNodeData,
    lastSurveyData;

    if (nodeToRemove.parentNode !== undefined) {
        nextFocusedNode = nodeToRemove.parentNode;
    }
    if (nodeToRemove.previousNode !== undefined) {
        nextFocusedNode = nodeToRemove.previousNode;
    }
    if (nodeToRemove.nextNode !== undefined) {
        if (nodeToRemove.nextNode.nextNode !== undefined) {
            nextNextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.nextNode.id);
        }
        nextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.id);
        nextFocusedNode = nodeToRemove.nextNode;
    }
    
    // First step:
    // Updating and shortening the data model
    ModelManager.removeSubtreeResources(nodeToRemove);
    ModelManager.shortenExperiment(nodeToRemove, nodeToRemove.parentNode);
    if (nodeToRemove.parentNode !== undefined) {
        if (nodeToRemove.parentNode.type === Config.TYPE_SURVEY) {
            if (nodeToRemove.previousNode !== undefined) {
                if (nodeToRemove.previousNode.previousNode !== undefined) {
                    previousPreviousNodeData = ModelManager.getDataById(nodeToRemove.previousNode.previousNode.id);
                }
                previousNodeData = ModelManager.getDataById(nodeToRemove.previousNode.id);
                if (nodeToRemove.nextNode !== undefined) {
                    nextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.id);
                }
                ModelManager.updateStepLinks(previousNodeData, previousPreviousNodeData, nextNodeData);
            }
            if (nodeToRemove.nextNode !== undefined) {
                if (nodeToRemove.nextNode.nextNode !== undefined) {
                    nextNextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.nextNode.id);
                }
                nextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.id);
                if (nodeToRemove.previousNode !== undefined) {
                    previousNodeData = ModelManager.getDataById(nodeToRemove.previousNode.id);
                }
                ModelManager.updateStepLinks(nextNodeData, previousNodeData, nextNextNodeData);
            }
            // If the node to change is a node with a duration (detailed example in onNodeClicked()),
            // next steps could wait for it. Those steps have to be updated to wait for no step anymore.
            if (nodeToRemoveData.durationInMin !== undefined
                && nodeToRemoveData.durationInMin > 0
                && nextNodeData !== undefined) {
                    if (nodeToRemove.nextNode !== undefined) {
                        nextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.id);
                    }
                    ModelManager.removeWaitForStepLinks(nextNodeData, nodeToRemoveData);
            }
        }
        if (nodeToRemove.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            timelineNodeData = ModelManager.getDataById(nodeToRemove.parentNode.id);
            lastSurveyData = ModelManager.updateSurveyLinks(timelineNodeData);
        }
        if (nodeToRemove.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            if (nodeToRemove.previousNode !== undefined) {
                if (nodeToRemove.previousNode.previousNode !== undefined) {
                    previousPreviousNodeData = ModelManager.getDataById(nodeToRemove.previousNode.previousNode.id);
                }
                previousNodeData = ModelManager.getDataById(nodeToRemove.previousNode.id);
                if (nodeToRemove.nextNode !== undefined) {
                    nextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.id);
                }
                ModelManager.updateQuestionLinks(previousNodeData, previousPreviousNodeData, nextNodeData, nodeToRemoveData, false);
            }
            if (nodeToRemove.nextNode !== undefined) {
                if (nodeToRemove.nextNode.nextNode !== undefined) {
                    nextNextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.nextNode.id);
                }
                nextNodeData = ModelManager.getDataById(nodeToRemove.nextNode.id);
                if (nodeToRemove.previousNode !== undefined) {
                    previousNodeData = ModelManager.getDataById(nodeToRemove.previousNode.id);
                }
                ModelManager.updateQuestionLinks(nextNodeData, previousNodeData, nextNextNodeData, nodeToRemoveData, false);
            }
        }
    }
    console.log("After removal:", ModelManager.getExperiment());

    // Second step:
    // Updating the views
    if (nodeToRemove.parentNode !== undefined
        && nodeToRemove.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            nodeToRemove.parentNode.shortenNodeTimeMap(nodeToRemove.id);
            TreeView.updateTimelineLength(nodeToRemove.parentNode, lastSurveyData);
    }
    TreeView.removeSubtree(nodeToRemove);
    TreeView.clickNode(nextFocusedNode, undefined);
}

function onInputChanged(event) {
    let dataChangingNode = event.data.correspondingNode,
    newDataProperties = event.data.newDataProperties,
    dataChangingNodeData,
    parentNode = dataChangingNode.parentNode,
    parentNodeData,
    previousNode = dataChangingNode.previousNode,
    previousNodeData,
    nextNode = dataChangingNode.nextNode,
    nextNodeData,
    lastSurveyData,
    fileName,
    addResourceResult,
    timeInMin,
    validationResult;


//###
    // TODO survey frequency buttons -> logic and responsiveness
    // Label is not hidden when an alert in InputView is triggered
    // console.log(newDataProperties.surveyFrequency);
//###


    // First step:
    // Updating the data model
    ModelManager.updateExperiment(newDataProperties);
    if (dataChangingNode.parentNode !== undefined
        && dataChangingNode.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            parentNodeData = ModelManager.getDataById(parentNode.id);
            lastSurveyData = ModelManager.updateSurveyLinks(parentNodeData);
    }
    if (dataChangingNode.type === Config.STEP_TYPE_INSTRUCTION) {
        if (dataChangingNode.nextNode !== undefined
            && newDataProperties.durationInMin === 0) {
                nextNodeData = ModelManager.getDataById(nextNode.id);
                ModelManager.removeWaitForStepLinks(nextNodeData, dataChangingNodeData);
        }
        if (newDataProperties.imageFileName !== undefined) {
            fileName = newDataProperties.imageFileName;
        }
        if (newDataProperties.videoFileName !== undefined){
            fileName = newDataProperties.videoFileName;
        }
        if (fileName === null) {
            if (event.data.previousFileName !== null) {
                ModelManager.removeResource(event.data.previousFileName);
            }
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
        dataChangingNodeData = ModelManager.getDataById(dataChangingNode.id);
        if (dataChangingNode.nextNode !== undefined) {
            nextNodeData = ModelManager.getDataById(nextNode.id);
        }
        if (dataChangingNode.previousNode !== undefined) {
            previousNodeData = ModelManager.getDataById(previousNode.id);
        }
        ModelManager.updateQuestionLinks(dataChangingNodeData, previousNodeData, nextNodeData, undefined, false);
    }
    dataChangingNodeData = ModelManager.getDataById(dataChangingNode.id);
    if (parentNode !== undefined) {
        parentNodeData = ModelManager.getDataById(parentNode.id);
    }
    console.log("After input change:", ModelManager.getExperiment());

    // Second step:
    // Updating the views
    TreeView.updateNodeLinks(dataChangingNodeData, parentNode, previousNode, nextNode);
    if (dataChangingNodeData.absoluteStartDaysOffset !== undefined
        && dataChangingNodeData.absoluteStartAtHour !== undefined
        && dataChangingNodeData.absoluteStartAtMinute !== undefined) {
            timeInMin = dataChangingNodeData.absoluteStartDaysOffset * 24 * 60 + dataChangingNodeData.absoluteStartAtHour * 60 + dataChangingNodeData.absoluteStartAtMinute; // eslint-disable-line no-magic-numbers
            parentNode.updateNodeTimeMap(dataChangingNode.id, timeInMin);
            TreeView.updateTimelineLength(parentNode, lastSurveyData);
    }
    if (dataChangingNodeData.name !== undefined) {
        dataChangingNode.updateDescription(dataChangingNodeData.name);
    }
    if (dataChangingNodeData.text !== undefined && dataChangingNode.type === Config.TYPE_ANSWER) {
        dataChangingNode.updateDescription(dataChangingNodeData.text);
    }
    TreeView.navigateToNode(dataChangingNode);
    WhereAmIView.update(TreeView.currentSelection);

    validationResult = InputValidator.inputIsValid(dataChangingNode, dataChangingNodeData, parentNodeData);
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

function onUploadResource() {
    LoadingScreenView.show(Config.LOADING_PROMPT);
}

// *** KeyManager callback functions:
// **
// *

function onCopyNode() {
    let nodeData = ModelManager.getDataById(TreeView.currentFocusedNode.id),
    clipboardContent = {};

    clipboardContent.nodeData = nodeData;
    if (TreeView.currentFocusedNode.parentNode !== undefined) {
        clipboardContent.parentNodeType = TreeView.currentFocusedNode.parentNode.type;
        ShortcutManager.setClipboardContent(clipboardContent);
        console.log("copied ", nodeData);
        // Inform user -> nodeData.name || text (answer) got copied!
    }
    else {
        console.log("not copy of experiment");
        // Inform user experiment nodes cannot be copied. To copy an experiment just save it on the Desktop. Thats the copy (that can be loaded elsewhere).
    }
}

function onPasteNode(event) {
    let clipboardNodeData = event.data.clipboardContent.nodeData,
    clipboardNodeDescription,
    clipboardParentNodeType = event.data.clipboardContent.parentNodeType,
    insertionParentNode,
    insertionParentNodeData,
    newData = {},
    id = clipboardNodeData.id,
    name = clipboardNodeData.name,
    validationResult;

    if (TreeView.currentFocusedNode.type === clipboardParentNodeType
        || (TreeView.currentFocusedNode.parentNode !== undefined
            && TreeView.currentFocusedNode.parentNode.type === clipboardParentNodeType)) {
                if (TreeView.currentFocusedNode.type === clipboardParentNodeType) {
                    insertionParentNode = TreeView.currentFocusedNode;
                }
                else {
                    insertionParentNode = TreeView.currentFocusedNode.parentNode;
                }
                insertionParentNodeData = ModelManager.getDataById(insertionParentNode.id);

                if (insertionParentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
                    clipboardNodeData.id = undefined;
                    clipboardNodeData.name = undefined;
                    validationResult = InputValidator.validateSurvey(undefined, clipboardNodeData, insertionParentNodeData);
                    while (validationResult.invalidInput === "absoluteStartDaysOffset"
                            || validationResult.invalidInput === "absoluteStartAtHour") {
                        if (clipboardNodeData.absoluteStartAtHour === 23) { // eslint-disable-line no-magic-numbers
                            clipboardNodeData.absoluteStartAtHour = 0;
                            clipboardNodeData.absoluteStartDaysOffset += 1;
                        }
                        else {
                            clipboardNodeData.absoluteStartAtHour += 1;
                        }
                        validationResult = InputValidator.validateSurvey(undefined, clipboardNodeData, insertionParentNodeData);
                    }
                }
                clipboardNodeData.id = id;
                clipboardNodeData.name = name;
                newData = ModelManager.extendExperimentWithCopy(clipboardNodeData, insertionParentNodeData, undefined);
                if (insertionParentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
                    TreeView.clickTimeline(insertionParentNode, newData);
                }
                else {
                    if (insertionParentNode.childNodes.length !== 0) {
                        TreeView.clickAddPreviousNodeButton(insertionParentNode.childNodes[0], newData);
                    }
                    else {
                        TreeView.clickAddChildNodeButton(insertionParentNode, newData);
                    }
                }
    
    }
    else {
        if (clipboardNodeData.type === Config.TYPE_ANSWER) {
            clipboardNodeDescription = clipboardNodeData.text;
        }
        else {
            clipboardNodeDescription = clipboardNodeData.name;
        }
        alert("Das aktuell ausgewählte Element (" + TreeView.currentFocusedNode.description + ") mit dem Typ (" + TreeView.currentFocusedNode.type + ") ist nicht auf der richtigen Ebene um das kopierte Element (" + clipboardNodeDescription + ") vom Typ (" + clipboardNodeData.type + ") einzufügen. Bitte ein Element vom Typ (" + clipboardParentNodeType + ") auswählen um das kopierte Element einzufügen.");
    }
}

export default new Controller();