/* eslint-env broswer */

import Config from "../utils/Config.js";

class TreeView {

    setElement(element) {
        this.treeViewContainer = element;
        this.treeView = element.firstElementChild;
        this.treeView.setAttribute("width", this.treeViewContainer.clientWidth);
        this.treeView.setAttribute("height", this.treeViewContainer.clientHeight);
        this.background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        //this.treeView.setAttribute("x", this.treeViewContainer.getBoundingClientRect().left);
        //this.treeView.setAttribute("y", this.treeViewContainer.getBoundingClientRect().top);
        this.background.setAttribute("width", this.treeViewContainer.clientWidth);
        this.background.setAttribute("height", this.treeViewContainer.clientHeight);
        this.background.setAttribute("fill", Config.TREE_VIEW_BACKGROUND_COLOR);
        this.background.setAttribute("fill-opacity", Config.TREE_VIEW_BACKGROUND_OPACITY);
        this.treeView.appendChild(this.background);
    }

    insertNodeView(nodeElements) {
        for (let element of nodeElements) {
            this.treeView.appendChild(element);
        }
    }

    removeNodeView(nodeElement) {
        nodeElement.remove();
    }

    getWidth() {
        return this.treeViewContainer.clientWidth;
    }

    getHeight() {
        return this.treeViewContainer.clientHeight;
    }
}

export default new TreeView();