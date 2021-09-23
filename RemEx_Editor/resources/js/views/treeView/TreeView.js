import Config from "../../utils/Config.js";

class TreeView {

    // treeViewElement
    init(treeViewContainer) {
        this.treeViewElement = treeViewContainer.firstElementChild;
        this.currentFocusedNode = undefined;
    }

    getCenter() {
        let center = {
            x: this.treeViewElement.clientWidth / 2, // eslint-disable-line no-magic-numbers
            y: this.treeViewElement.clientHeight / 2, // eslint-disable-line no-magic-numbers
        };
        return center;
    }

    getWidth() {
        return this.treeViewElement.clientWidth;
    }

    getHeight() {
        return this.treeViewElement.clientHeight;
    }

    insertNode(node) {
        for (let element in node.nodeElements) {
            if (Object.prototype.hasOwnProperty.call(node.nodeElements, element)) {
                this.treeViewElement.appendChild(node.nodeElements[element]);
            }
        }
    }

    removeNode(node) {
        /*
        let isInsertion = false,
        nextFocusedNode;

        updateNodeLinks(node);
        nextFocusedNode = getNextFocusedNode(node);
        updateNextNodePositions(node.nextNode, isInsertion);
        removeNodeFromParentsList(node);
        removeNodeFromDOM(node);
        return nextFocusedNode;*/
    }

    focusNode(node) {
        /* Moving animation
        let firstNodeOfRow = getFirstNodeOfRow(node),
        centerOffsetVector = getCenterOffsetVector(this, node),
        partialVector = {
            x: centerOffsetVector.x / Config.TREE_MOVEMENT_ANIMATION_STEPS,
            y: centerOffsetVector.y / Config.TREE_MOVEMENT_ANIMATION_STEPS,
        },
        i = 0,
        intervall;
        
        intervall = setInterval(() => {
            moveHorizontal(firstNodeOfRow, partialVector);
            moveVertical(this.experimentRootNode, null, partialVector);
            i += 1;
            if (i === Config.TREE_MOVEMENT_ANIMATION_STEPS) {
                clearInterval(intervall);
            }
        }, Config.TREE_MOVEMENT_ANIMATION_FRAME_RATE_MS);
        
        showChildNodes(node, true);
        defocusNextNodes(firstNodeOfRow);
        deemphasizeNextNodes(firstNodeOfRow);
        node.focus();
        this.currentFocusedNode = node;*/
    }

    moveToPreviousNode() {
        if (this.currentFocusedNode.previousNode !== undefined) {
            this.clickNode(this.currentFocusedNode.previousNode);
        }
    }

    moveToNextNode() {
        if (this.currentFocusedNode.nextNode !== undefined) {
            this.clickNode(this.currentFocusedNode.nextNode);
        }
    }

    moveToParentNode() {
        if (this.currentFocusedNode.parentNode !== undefined) {
            this.clickNode(this.currentFocusedNode.parentNode);
        }
    }

    moveToFirstChildNode() {
        if (this.currentFocusedNode.childNodes[0] !== undefined) {
            this.clickNode(this.currentFocusedNode.childNodes[0]);
        }
    }

    insertTimeline(timelineElement) {
        let timelinePosition = {
            x: undefined,
            y: this.currentFocusedNode.center.y + Config.TREE_VIEW_ROW_DISTANCE,
        };
        if (this.currentTimelineElement !== undefined) {
            this.treeViewElement.removeChild(this.currentTimelineElement);
        }
        else {
            // No current element to remove
        }
        this.treeViewElement.appendChild(timelineElement);
        this.currentTimelineElement = timelineElement;
        return timelinePosition;
    }
}

function removeNodeFromParentsList(node) {
    let indexInParentList;

    indexInParentList = node.parentNode.childNodes.indexOf(node);
    if (indexInParentList !== -1) {
        node.parentNode.childNodes.splice(indexInParentList, 1);
    }
}

function removeNodeFromDOM(node) {
    for (let element of node.elements) {
        element.remove();
    }
}

export default new TreeView();