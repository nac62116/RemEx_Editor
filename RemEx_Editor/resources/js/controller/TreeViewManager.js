import Config from "../utils/Config.js";
import NodeView from "../views/NodeView.js";
import TreeView from "../views/TreeView.js";

class TreeViewManager {

    initTreeView(eventListener, experiment) {
        let experimentRootNode;

        // Init TreeView
        TreeView.init();

        /* Überprüfen! */
        experimentRootNode = createInitialExperimentTree(this, eventListener, experiment);
        TreeView.setInitialTree(experimentRootNode);
    }

    createNode(id, eventListener, nodeProperties) {
        let newNode;
    
        if (nodeProperties.description.length >= Config.NODE_DESCRIPTION_MAX_LENGTH) {
            nodeProperties.description = nodeProperties.description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
        }
        newNode = new NodeView(id, nodeProperties.type, nodeProperties.description, nodeProperties.parentNode, nodeProperties.previousNode, nodeProperties.nextNode);
        for (let listener of eventListener) {
            newNode.addEventListener(listener.eventType, listener.callback);
        }
        if (nodeProperties.parentNode !== undefined) {
            nodeProperties.parentNode.childNodes.push(newNode);
        }
        if (nodeProperties.previousNode !== undefined) {
            nodeProperties.previousNode.nextNode = newNode;
        }
        if (nodeProperties.nextNode !== undefined) {
            nodeProperties.nextNode.previousNode = newNode;
        }
    
        return newNode;
    }

    insertNode(node, insertionType) {
        TreeView.insertNode(node, insertionType);
    }

    removeNode(nodeToRemove) {
        let nextFocusedNode,
        indexInParentList;
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
        indexInParentList = nodeToRemove.parentNode.childNodes.indexOf(nodeToRemove);
        if (indexInParentList !== -1) {
            nodeToRemove.parentNode.childNodes.splice(indexInParentList, 1);
        }
        TreeView.removeNode(nodeToRemove);
        return nextFocusedNode;
    }

    clickNode(node) {
        node.nodeSvg.dispatchEvent(new Event("click"));
    }

    focusNode(node) {
        TreeView.setFocusOn(node);
    }

    emphasizeNode(node) {
        node.emphasize();
    }

    deemphasizeNode(node) {
        node.deemphasize();
    }

    updateDescription(node, description) {
        let formatedDescription = description;

        if (description.length > Config.NODE_DESCRIPTION_MAX_LENGTH) {
            formatedDescription = description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
        }
        else {
            // Description is short enough
        }
        node.updateDescription(formatedDescription);
    }
}

function createInitialExperimentTree(that, eventListener, experiment) {
    let experimentRootNode,
    groupNode,
    previousGroupNode,
    surveyNode,
    previousSurveyNode,
    stepNode,
    previousStepNode,
    questionNode,
    previousQuestionNode,
    nodeProperties = {},
    id;

    nodeProperties.type = Config.TYPE_EXPERIMENT;
    nodeProperties.description = experiment.name;
    nodeProperties.parentNode = undefined;
    nodeProperties.previousNode = undefined;
    nodeProperties.nextNode = undefined;
    experimentRootNode = that.createNode(id, eventListener, nodeProperties);
    for (let group of experiment.groups) {
        id = group.id;
        nodeProperties.type = Config.TYPE_EXPERIMENT_GROUP;
        nodeProperties.description = group.name;
        nodeProperties.parentNode = experimentRootNode;
        nodeProperties.previousNode = previousGroupNode;
        nodeProperties.nextNode = undefined;
        groupNode = that.createNode(id, eventListener, nodeProperties);
        experimentRootNode.childNodes.push(groupNode);
        if (previousGroupNode !== undefined) {
            previousGroupNode.nextNode = groupNode;
        }
        previousGroupNode = groupNode;
        for (let survey of group.surveys) {
            // TODO: Create Survey Timeline
            id = survey.id;
            nodeProperties.type = Config.TYPE_SURVEY;
            nodeProperties.description = survey.name;
            nodeProperties.parentNode = groupNode;
            nodeProperties.previousNode = previousSurveyNode;
            nodeProperties.nextNode = undefined;
            surveyNode = that.createNode(id, eventListener, nodeProperties);
            groupNode.childNodes.push(surveyNode);
            if (previousSurveyNode !== undefined) {
                previousSurveyNode.nextNode = surveyNode;
            }
            previousSurveyNode = surveyNode;
            for (let step of survey.steps) {
                id = step.id;
                nodeProperties.description = step.name;
                nodeProperties.parentNode = surveyNode;
                nodeProperties.previousNode = previousStepNode;
                nodeProperties.nextNode = undefined;
                if (step.type === Config.STEP_TYPE_INSTRUCTION) {
                    nodeProperties.type = Config.TYPE_INSTRUCTION;
                }
                else if (step.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
                    nodeProperties.type = Config.TYPE_BREATHING_EXERCISE;
                }
                else if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    nodeProperties.type = Config.TYPE_QUESTIONNAIRE;
                }
                else {
                    throw "TreeView: No Node for step type \"" + step.type + "\" is defined.";
                }
                stepNode = that.createNode(id, eventListener, nodeProperties);
                surveyNode.childNodes.push(stepNode);
                if (previousStepNode !== undefined) {
                    previousStepNode.nextNode = stepNode;
                }
                previousStepNode = stepNode;
                if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    for (let question of step.questions) {
                        id = question.id;
                        nodeProperties.type = Config.TYPE_QUESTION;
                        nodeProperties.description = question.name;
                        nodeProperties.parentNode = stepNode;
                        nodeProperties.previousNode = previousQuestionNode;
                        nodeProperties.nextNode = undefined;
                        questionNode = that.createNode(id, eventListener, nodeProperties);
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

export default new TreeViewManager();