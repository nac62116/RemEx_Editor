/* eslint-env broswer */

import Config from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";

class TreeNodeView extends Observable {

    constructor(id, centerX, centerY, parentOutputPoint, type) {
        /* Can't be instantiated
        if (new.target === NodeView) {
            throw new TypeError(Config.NODE_VIEW_CONSTRUCTOR_ERROR);
        }*/
        
        super();
        this.id = id;
        this.elements = [];
        if (parentOutputPoint !== null) {
            this.inputPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            this.inputPath.setAttribute("stroke-width", Config.TREE_NODE_PATH_STROKE_WIDTH);
            this.inputPath.setAttribute("stroke", Config.TREE_NODE_PATH_STROKE_COLOR);
            this.inputPath.setAttribute("stroke-opacity", Config.TREE_NODE_PATH_STROKE_OPACITY);
            this.inputPath.setAttribute("fill", "transparent");
        }
        this.nodeBody = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.nodeBody.setAttribute("width", Config.TREE_NODE_WIDTH);
        this.nodeBody.setAttribute("height", Config.TREE_NODE_HEIGHT);
        this.nodeBody.setAttribute("rx", Config.TREE_NODE_BORDER_RADIUS);
        this.nodeBody.setAttribute("ry", Config.TREE_NODE_BORDER_RADIUS);
        this.nodeBody.setAttribute("fill", Config.TREE_VIEW_BACKGROUND_COLOR);
        this.nodeBody.setAttribute("fill-opacity", Config.TREE_VIEW_BACKGROUND_OPACITY);
        this.nodeBody.setAttribute("stroke-width", Config.TREE_NODE_STROKE_WIDTH);
        this.nodeBody.setAttribute("stroke", Config.TREE_NODE_STROKE_COLOR);
        this.nodeBody.setAttribute("stroke-opacity", Config.TREE_NODE_STROKE_OPACITY);
        this.center = {
            x: centerX,
            y: centerY
        }
        this.top = {
            x: centerX,
            y: centerY - this.nodeBody.getAttribute("height") / 2
        }
        this.bottom = {
            x: centerX,
            y: centerY + this.nodeBody.getAttribute("height") / 2
        }
        this.topLeft = {
            x: centerX - this.nodeBody.getAttribute("width") / 2,
            y: centerY - this.nodeBody.getAttribute("height") / 2
        }
        if (parentOutputPoint !== null) {
            this.bezierReferencePoint = {
                x: parentOutputPoint.x,
                y: (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 4))
            }
            this.inputPath.setAttribute("d", "M " + parentOutputPoint.x + " " + parentOutputPoint.y + " Q " + this.bezierReferencePoint.x + " " + this.bezierReferencePoint.y + ", " + (parentOutputPoint.x + ((this.top.x - parentOutputPoint.x) / 2)) + " " + (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + this.top.y);
            this.elements.push(this.inputPath);
        }
        this.nodeBody.setAttribute("x", this.topLeft.x);
        this.nodeBody.setAttribute("y", this.topLeft.y);
        this.elements.push(this.nodeBody);
    }

    getElements() {
        return this.elements;
    }
}

export default TreeNodeView;