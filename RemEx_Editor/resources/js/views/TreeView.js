import RootNode from "../views/nodeView/RootNode.js";
import TimelineNode from "../views/nodeView/TimelineNode.js";
import DeflateableNode from "../views/nodeView/DeflateableNode.js";
import StandardNode from "../views/nodeView/StandardNode.js";
import SwitchableNode from "./nodeView/SwitchableNode.js";
import SvgFactory from "../utils/SvgFactory.js";
import Config from "../utils/Config.js";

class TreeView {

    init(treeViewContainer, treeViewEventListener) {
        this.treeViewContainer = treeViewContainer;
        this.treeViewElement = treeViewContainer.querySelector("#" + Config.TREE_VIEW_ID);
        this.treeViewEventListener = treeViewEventListener;
        this.currentFocusedNode = undefined;
        this.currentSelection = [];
        this.rootNode = undefined;
        // Node map to store the nodes that arent linked yet
        // Key: id
        // Value: node
        this.nodeMap = new Map();
    }

    createSubtree(subtreeData) {
        let newNode = createNodes(this, subtreeData);

        if (subtreeData.type === Config.TYPE_EXPERIMENT) {
            this.rootNode = newNode;
        }
        
        return newNode;
    }

    removeSubtree(node) {
        let index;

        // Update links
        if (node.parentNode !== undefined) {
            index = node.parentNode.childNodes.indexOf(node);
            node.parentNode.childNodes.splice(index, 1);
        }
        if (node.previousNode !== undefined) {
            node.previousNode.nextNode = node.nextNode;
        }
        if (node.nextNode !== undefined) {
            node.nextNode.previousNode = node.previousNode;
        }
        removeNodes(this, node);
    }

    updateNodeLinks(nodeData, parentNode, previousNode, nextNode) {
        let node = this.getNodeById(nodeData.id);

        node.parentNode = parentNode;
        if (parentNode !== undefined && !parentNode.childNodes.includes(node)) {
            parentNode.childNodes.push(node);
        }
        node.previousNode = previousNode;
        if (previousNode !== undefined) {
            previousNode.nextNode = node;
        }
        node.nextNode = nextNode;
        if (nextNode !== undefined) {
            nextNode.previousNode = node;
        }
        updateChildNodeLinks(this, nodeData);
    }

    getNodeById(id) {
        return this.nodeMap.get(id);
    }

    clickNode(node, nodeId) {
        let nodeToClick;
        if (node !== undefined) {
            nodeToClick = node;
        }
        else {
            nodeToClick = this.getNodeById(nodeId);
        }
        nodeToClick.click();
    }

    clickAddPreviousNodeButton(node, nodeData) {
        node.clickAddPreviousButton(nodeData);
    }

    clickAddChildNodeButton(node, nodeData) {
        node.clickAddChildButton(nodeData);
    }

    clickTimeline(timelineNode, surveyData) {
        let timeInMin,
        positionOnTimeline;

        timeInMin = surveyData.absoluteStartDaysOffset * 24 * 60 + surveyData.absoluteStartAtHour * 60 + surveyData.absoluteStartAtMinute; // eslint-disable-line no-magic-numbers
        positionOnTimeline = timelineNode.getPositionOnTimeline(undefined, timeInMin, true);

        timelineNode.clickTimeline(positionOnTimeline, surveyData);
    }

    updateTimelineLength(timelineNode, lastSurveyData) {
        let labels = timelineNode.getTimelineLabels();

        for (let label of labels) {
            this.treeViewElement.removeChild(label.stroke);
            this.treeViewElement.removeChild(label.description);
        }
        timelineNode.updateTimelineLength(lastSurveyData);
        labels = timelineNode.getTimelineLabels();
        for (let label of labels) {
            timelineNode.nodeElements.nodeBody.insertAdjacentElement("afterend", label.stroke);
            timelineNode.nodeElements.nodeBody.insertAdjacentElement("afterend", label.description);
        }
    }

    navigateToNode(node) {
        let treeViewCenter = {
            x: this.treeViewElement.clientWidth / 2, // eslint-disable-line no-magic-numbers
            y: this.treeViewElement.clientHeight / 2, // eslint-disable-line no-magic-numbers
        },
        y,
        positionOnTimeline;

        this.currentFocusedNode = node;
        for (let node of this.currentSelection) {
            node.isInCurrentSelection = false;
        }
        this.currentSelection = [];
        updateCurrentSelection(this, node);
        // Defocus, deemphasize and hide all nodes
        hideTree(this.rootNode);

        // Updating the position of all relevant nodes (All parents, all neighbours, all childs)
        // starting from root so that the input paths from each node
        // know where the parents output point lies.

        // Show, emphasize, focus and position this and all parent nodes from top down
        for (let i = this.currentSelection.length - 1; i >= 0; i--) {
            y = treeViewCenter.y - i * Config.NODE_DISTANCE_HORIZONTAL;
            this.currentSelection[i].show();
            if (!(this.currentSelection[i] instanceof DeflateableNode)) {
                this.currentSelection[i].emphasize();
            }
            // Child nodes of a timeline node need to be positioned on the timeline
            if (this.currentSelection[i].parentNode !== undefined && this.currentSelection[i].parentNode instanceof TimelineNode) {
                positionOnTimeline = this.currentSelection[i].parentNode.getPositionOnTimeline(this.currentSelection[i].id);
                this.currentSelection[i].updatePosition(positionOnTimeline.x, positionOnTimeline.y);
            }
            else {
                this.currentSelection[i].updatePosition(treeViewCenter.x, y);
            }
            
            if (i === 0) {
                if (this.currentSelection[i] instanceof DeflateableNode) {
                    this.currentSelection[i].emphasize();
                }
                this.currentSelection[i].focus();
            }
        }
        // Show and position all neighbour nodes and child nodes
        showAndMovePreviousNodes(node.previousNode, 1, treeViewCenter);
        showAndMoveNextNodes(node.nextNode, 1, treeViewCenter);
        showAndMoveChildNodes(node.childNodes, treeViewCenter);
    }

    switchNodes(leftNode, rightNode, previousNode, nextNode) {
        // Initial linking:
        // previousNode --- leftNode <-switch-> rightNode --- nextNode
        // Updating links of the switching pair
        leftNode.previousNode = rightNode;
        leftNode.nextNode = nextNode;
        rightNode.previousNode = previousNode;
        rightNode.nextNode = leftNode;
        // Updating links of the sourrounding nodes
        if (previousNode !== undefined) {
            previousNode.nextNode = rightNode;
        }
        if (nextNode !== undefined) {
            nextNode.previousNode = leftNode;
        }
    }

    getFirstNodeOfRow(node) {
        if (node.previousNode === undefined) {
            return node;
        }
        return this.getFirstNodeOfRow(node.previousNode);
    }

    enableNodeActions() {
        updateNodeActions(this.rootNode, true);
    }

    disableNodeActions() {
        updateNodeActions(this.rootNode, false);
    }

}

function createNodes(that, nodeData) {
    let id = nodeData.id,
    description = nodeData.name,
    elements,
    newNode,
    questionTypes = [
        Config.QUESTION_TYPE_CHOICE,
        Config.QUESTION_TYPE_TEXT,
        Config.QUESTION_TYPE_LIKERT,
        Config.QUESTION_TYPE_POINT_OF_TIME,
        Config.QUESTION_TYPE_TIME_INTERVAL,
    ],
    childrenData = [];

    if (nodeData.type === Config.TYPE_EXPERIMENT) {
        elements = SvgFactory.createRootNodeElements(Config.EXPERIMENT_ICON_SRC);
        newNode = new RootNode(elements, id, Config.TYPE_EXPERIMENT, description);
        childrenData = nodeData.groups;
    }
    else if (nodeData.type === Config.TYPE_EXPERIMENT_GROUP) {
        elements = SvgFactory.createTimelineNodeElements(Config.EXPERIMENT_GROUP_ICON_SRC);
        newNode = new TimelineNode(elements, id, Config.TYPE_EXPERIMENT_GROUP, description, that.treeViewElement);
        childrenData = nodeData.surveys;
    }
    else if (nodeData.type === Config.TYPE_SURVEY) {
        elements = SvgFactory.createDeflateableNodeElements(false, true, Config.SURVEY_ICON_SRC);
        newNode = new DeflateableNode(elements, id, Config.TYPE_SURVEY, description);
        childrenData = nodeData.steps;
    }
    else if (nodeData.type === Config.STEP_TYPE_INSTRUCTION) {
        elements = SvgFactory.createSwitchableNodeElements(true, false, Config.INSTRUCTION_ICON_SRC);
        newNode = new SwitchableNode(elements, id, nodeData.type, description);
    }
    else if (nodeData.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
        elements = SvgFactory.createSwitchableNodeElements(true, false, Config.BREATHING_EXERCISE_ICON_SRC);
        newNode = new SwitchableNode(elements, id, nodeData.type, description);
    }
    else if (nodeData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        elements = SvgFactory.createSwitchableNodeElements(true, true, Config.QUESTIONNAIRE_ICON_SRC);
        newNode = new SwitchableNode(elements, id, nodeData.type, description);
        childrenData = nodeData.questions;
    }
    else if (nodeData.type === Config.QUESTION_TYPE_CHOICE) {
        elements = SvgFactory.createSwitchableNodeElements(true, true, Config.QUESTION_ICON_SRC);
        newNode = new SwitchableNode(elements, id, nodeData.type, description);
        childrenData = nodeData.answers;
    }
    else if (nodeData.type !== Config.QUESTION_TYPE_CHOICE && questionTypes.includes(nodeData.type)) {
        elements = SvgFactory.createSwitchableNodeElements(true, false, Config.QUESTION_ICON_SRC);
        newNode = new SwitchableNode(elements, id, nodeData.type, description);
    }
    else if (nodeData.type === Config.TYPE_ANSWER) {
        description = nodeData.text;
        elements = SvgFactory.createStandardNodeElements(true, false, Config.ANSWER_ICON_SRC);
        newNode = new StandardNode(elements, id, Config.TYPE_ANSWER, description);
    }
    else {
        console.log("The data type " + nodeData.type + " is not defined.");
    }
    for (let listener of that.treeViewEventListener) {
        if (listener.eventType === Config.EVENT_TIMELINE_CLICKED) {
            if (newNode instanceof TimelineNode) {
                newNode.timeline.addEventListener(listener.eventType, listener.callback);
            }
        }
        else {
            newNode.addEventListener(listener.eventType, listener.callback);
        }
    }
    insertNode(that, newNode);
    if (newNode instanceof TimelineNode) {
        that.updateTimelineLength(newNode, undefined);
    }
    for (let childData of childrenData) {
        createNodes(that, childData);
    }
    return newNode;
}

function insertNode(that, node) {
    that.nodeMap.set(node.id, node);
    for (let nodeKey in node.nodeElements) {
        if (Object.prototype.hasOwnProperty.call(node.nodeElements, nodeKey)) {
            if (nodeKey !== "timelineElements") {
                that.treeViewElement.appendChild(node.nodeElements[nodeKey]);
            }
            else {
                for (let timelineKey in node.nodeElements.timelineElements) {
                    if (Object.prototype.hasOwnProperty.call(node.nodeElements.timelineElements, timelineKey)) {
                        if (timelineKey !== "labels") {
                            that.treeViewElement.appendChild(node.nodeElements.timelineElements[timelineKey]);
                        }
                        else {
                            for (let labelKey in node.nodeElements.timelineElements[timelineKey]) {
                                if (Object.prototype.hasOwnProperty.call(node.nodeElements.timelineElements, labelKey)) {
                                    that.treeViewElement.appendChild(node.nodeElements.timelineElements[timelineKey][labelKey]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function updateChildNodeLinks(that, nodeData) {
    let node,
    nextNode,
    nextId,
    previousNode,
    previousId,
    childNode,
    childrenData;

    node = that.getNodeById(nodeData.id);
    node.childNodes = [];

    if (nodeData.type === Config.TYPE_EXPERIMENT
        || nodeData.type === Config.QUESTION_TYPE_CHOICE) {
        // Experiment groups (children of experiments) and answers (children of choice questions)
        // dont follow a specific linking in the data model.
        // Thus the corresponding nodes can be linked in any way.
        if (nodeData.type === Config.TYPE_EXPERIMENT) {
            childrenData = nodeData.groups;
        }
        if (nodeData.type === Config.QUESTION_TYPE_CHOICE) {
            childrenData = nodeData.answers;
        }
        for (let i = 0; i < childrenData.length; i++) {
            childNode = that.getNodeById(childrenData[i].id);
            node.childNodes.push(childNode);
            childNode.parentNode = node;
            // Previous and next links are only relevant with length > 1
            if (childrenData.length !== 1) {
                // First iteration
                if (i === 0) {
                    nextNode = that.getNodeById(childrenData[i + 1].id);
                    previousNode = undefined;
                }
                // Last iteration
                else if (i === childrenData.length - 1) {
                    nextNode = undefined;
                    previousNode = that.getNodeById(childrenData[i - 1].id);
                }
                // All other iterations
                else {
                    nextNode = that.getNodeById(childrenData[i + 1].id);
                    previousNode = that.getNodeById(childrenData[i - 1].id);
                }
                childNode.nextNode = nextNode;
                childNode.previousNode = previousNode;
            }
            updateChildNodeLinks(that, childrenData[i]);
        }
    }
    if (nodeData.type === Config.TYPE_EXPERIMENT_GROUP
        || nodeData.type === Config.TYPE_SURVEY
        || nodeData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        // Surveys (children of experiment groups), steps (children of surveys)
        // and questions (children of questionnaires) follow a specific linking in the data model.
        // Thus the corresponding nodes must be linked in that way.
        if (nodeData.type === Config.TYPE_EXPERIMENT_GROUP) {
            childrenData = nodeData.surveys;
        }
        if (nodeData.type === Config.TYPE_SURVEY) {
            childrenData = nodeData.steps;
        }
        if (nodeData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            childrenData = nodeData.questions;
        }
        for (let i = 0; i < childrenData.length; i++) {
            childNode = that.getNodeById(childrenData[i].id);
            node.childNodes.push(childNode);
            childNode.parentNode = node;
            if (nodeData.type === Config.TYPE_EXPERIMENT_GROUP) {
                nextId = childrenData[i].nextSurveyId;
                previousId = childrenData[i].previousSurveyId;
            }
            if (nodeData.type === Config.TYPE_SURVEY) {
                nextId = childrenData[i].nextStepId;
                previousId = childrenData[i].previousStepId;
            }
            if (nodeData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                nextId = childrenData[i].nextQuestionId;
                previousId = childrenData[i].previousQuestionId;
            }
            if (nextId !== null) {
                nextNode = that.getNodeById(nextId);
            }
            else {
                nextNode = undefined;
            }
            if (previousId !== null) {
                previousNode = that.getNodeById(previousId);
            }
            else {
                previousNode = undefined;
            }
            childNode.nextNode = nextNode;
            childNode.previousNode = previousNode;
            updateChildNodeLinks(that, childrenData[i]);
        }
    }
}

function removeNodes(that, node) {
    if (node === undefined) {
        return;
    }
    that.nodeMap.delete(node.id);
    for (let nodeKey in node.nodeElements) {
        if (Object.prototype.hasOwnProperty.call(node.nodeElements, nodeKey)) {
            if (nodeKey !== "timelineElements") {
                node.nodeElements[nodeKey].remove();
            }
            else {
                for (let timelineKey in node.nodeElements.timelineElements) {
                    if (Object.prototype.hasOwnProperty.call(node.nodeElements.timelineElements, timelineKey)) {
                        if (timelineKey !== "labels") {
                            node.nodeElements.timelineElements[timelineKey].remove();
                        }
                        else {
                            for (let label of node.nodeElements.timelineElements.labels) {
                                label.stroke.remove();
                                label.description.remove();
                            }
                        }
                    }
                }
            }
        }
    }
    for (let childNode of node.childNodes) {
        removeNodes(that, childNode);
    }
}

function updateCurrentSelection(that, node) {
    if (node === undefined) {
        return;
    }
    that.currentSelection.push(node);
    node.isInCurrentSelection = true;
    updateCurrentSelection(that, node.parentNode);
}

function hideTree(node) {
    if (node === undefined) {
        return;
    }
    node.defocus();
    node.deemphasize();
    node.hide();
    for (let childNode of node.childNodes) {
        hideTree(childNode);
    }
}

function showAndMovePreviousNodes(node, neighbourCount, treeViewCenter) {
    let nextCount = neighbourCount + 1,
    x = treeViewCenter.x - neighbourCount * Config.NODE_DISTANCE_HORIZONTAL,
    positionOnTimeline;

    if (node === undefined) {
        return;
    }

    node.show();
    // Child nodes of a timeline node need to be positioned on the timeline
    if (node.parentNode !== undefined && node.parentNode instanceof TimelineNode) {
        positionOnTimeline = node.parentNode.getPositionOnTimeline(node.id);
        node.updatePosition(positionOnTimeline.x, positionOnTimeline.y);
    }
    else {
        node.updatePosition(x, treeViewCenter.y);
    }

    showAndMovePreviousNodes(node.previousNode, nextCount, treeViewCenter);
}

function showAndMoveNextNodes(node, neighbourCount, treeViewCenter) {
    let nextCount = neighbourCount + 1,
    x = treeViewCenter.x + neighbourCount * Config.NODE_DISTANCE_HORIZONTAL,
    positionOnTimeline;

    if (node === undefined) {
        return;
    }

    node.show();
    // Child nodes of a timeline node need to be positioned on the timeline
    if (node.parentNode !== undefined && node.parentNode instanceof TimelineNode) {
        positionOnTimeline = node.parentNode.getPositionOnTimeline(node.id);
        node.updatePosition(positionOnTimeline.x, positionOnTimeline.y);
    }
    else {
        node.updatePosition(x, treeViewCenter.y);
    }

    showAndMoveNextNodes(node.nextNode, nextCount, treeViewCenter);
}

function showAndMoveChildNodes(childNodes, treeViewCenter) {
    if (childNodes === undefined || childNodes.length === 0) {
        return;
    }
    treeViewCenter.y += Config.NODE_DISTANCE_VERTICAL;
    showAndMovePreviousNodes(childNodes[0], 0, treeViewCenter);
    showAndMoveNextNodes(childNodes[0].nextNode, 1, treeViewCenter);
}

function updateNodeActions(node, enableActions) {
    if (node === undefined) {
        return;
    }
    node.setIsClickable(enableActions);
    for (let childNode of node.childNodes) {
        updateNodeActions(childNode, enableActions);
    }
}

export default new TreeView();