/* eslint-env broswer */

import Config from "../utils/Config.js";

class TreeView {

    setElement(element) {
        this.treeViewContainer = element;
        this.treeView = element.firstElementChild;
        this.treeView.setAttribute("viewBox", "0 0 " + this.treeViewContainer.clientWidth + " " + this.treeViewContainer.clientHeight);
        this.background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.background.setAttribute("x", "-150%");
        this.background.setAttribute("y", "-350%");
        this.background.setAttribute("width", "400%");
        this.background.setAttribute("height", "800%");
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