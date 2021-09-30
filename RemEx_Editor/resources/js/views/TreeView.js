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
        for (let nodeKey in node.nodeElements) {
            if (Object.prototype.hasOwnProperty.call(node.nodeElements, nodeKey)) {
                if (nodeKey !== "timelineElements") {
                    this.treeViewElement.appendChild(node.nodeElements[nodeKey]);
                }
                else {
                    for (let timelineKey in node.nodeElements.timelineElements) {
                        if (Object.prototype.hasOwnProperty.call(node.nodeElements.timelineElements, timelineKey)) {
                            if (timelineKey !== "labels") {
                                this.treeViewElement.appendChild(node.nodeElements.timelineElements[timelineKey]);
                            }
                        }
                    }
                }
            }
        }
    }

    removeNode(node) {
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
                        }
                    }
                }
            }
        }
        removeChildNodes(node);
    }
}

function removeChildNodes(node) {
    if (node.childNodes === undefined || node.childNodes.length === 0) {
        return;
    }
    for (let childNode of node.childNodes) {
        for (let nodeKey in childNode.nodeElements) {
            if (Object.prototype.hasOwnProperty.call(childNode.nodeElements, nodeKey)) {
                if (nodeKey !== "timelineElements") {
                    childNode.nodeElements[nodeKey].remove();
                }
                else {
                    for (let timelineKey in childNode.nodeElements.timelineElements) {
                        if (Object.prototype.hasOwnProperty.call(childNode.nodeElements.timelineElements, timelineKey)) {
                            if (timelineKey !== "labels") {
                                childNode.nodeElements.timelineElements[timelineKey].remove();
                            }
                        }
                    }
                }
            }
        }
        removeChildNodes(childNode);
    }
}

export default new TreeView();