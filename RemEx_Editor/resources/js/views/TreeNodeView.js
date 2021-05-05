/* eslint-env broswer */

import Config from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";

class TreeNodeView extends Observable {

    constructor(id, centerX, centerY, parentOutputPoint, type) {
        super();
        this.id = id;
        this.elements = [];
        this.parentOutputPoint = parentOutputPoint;
        if (parentOutputPoint !== null) {
            this.inputPath = createInputPath();
            this.elements.push(this.inputPath);
        }
        this.nodeSvg = createNodeSvg();
        this.elements.push(this.nodeSvg);
        this.updatePosition(centerX, centerY);
    }

    getId() {
        return this.id;
    }

    getElements() {
        return this.elements;
    }

    getBottom() {
        return this.bottom;
    }

    show() {
        this.deemphasize();
    }

    hide() {
        if (this.inputPath !== null) {
            this.inputPath.setAttribute("stroke-opacity", "0");
        }
        for (let element of this.nodeSvg.children) {
            element.setAttribute("fill-opacity", "0");
            element.setAttribute("stroke-opacity", "0");
        }
    }

    emphasize() {
        if (this.inputPath !== null) {
            this.inputPath.setAttribute("stroke-opacity", Config.NODE_PATH_STROKE_OPACITY_EMPHASIZED);
        }
        for (let element of this.nodeSvg.children) {
            element.setAttribute("fill-opacity", Config.NODE_BODY_BACKGROUND_OPACITY_EMPHASIZED);
            element.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_EMPHASIZED);
        }
    }

    deemphasize() {
        if (this.inputPath !== null) {
            this.inputPath.setAttribute("stroke-opacity", Config.NODE_PATH_STROKE_OPACITY_DEEMPHASIZED);
        }
        for (let element of this.nodeSvg.children) {
            element.setAttribute("fill-opacity", Config.NODE_BODY_BACKGROUND_OPACITY_DEEMPHASIZED);
            element.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
        }
    }

    updatePosition(centerX, centerY) {
        // Recalculate points
        this.center = {
            x: centerX,
            y: centerY
        }
        this.top = {
            x: centerX,
            y: centerY - this.nodeSvg.getAttribute("height") / 2
        }
        this.bottom = {
            x: centerX,
            y: centerY + this.nodeSvg.getAttribute("height") / 2
        }
        this.topLeft = {
            x: centerX - this.nodeSvg.getAttribute("width") / 2,
            y: centerY - this.nodeSvg.getAttribute("height") / 2
        }
        if (this.parentOutputPoint !== null) {
            this.bezierReferencePoint = {
                x: this.parentOutputPoint.x,
                y: (this.parentOutputPoint.y + ((this.top.y - this.parentOutputPoint.y) / 4))
            }
            // Update Positions
            this.inputPath.setAttribute("d", "M " + this.parentOutputPoint.x + " " + this.parentOutputPoint.y + " Q " + this.bezierReferencePoint.x + " " + this.bezierReferencePoint.y + ", " + (this.parentOutputPoint.x + ((this.top.x - this.parentOutputPoint.x) / 2)) + " " + (this.parentOutputPoint.y + ((this.top.y - this.parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + this.top.y);
        }
        this.nodeSvg.setAttribute("x", this.topLeft.x);
        this.nodeSvg.setAttribute("y", this.topLeft.y);
    }
}

function createInputPath() {
    let inputPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    inputPath.setAttribute("stroke-width", Config.NODE_PATH_STROKE_WIDTH);
    inputPath.setAttribute("stroke", Config.NODE_PATH_STROKE_COLOR);
    inputPath.setAttribute("stroke-opacity", Config.NODE_PATH_STROKE_OPACITY_DEEMPHASIZED);
    inputPath.setAttribute("fill", "transparent");
    return inputPath;
}

function createNodeSvg(type) {
    let nodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    nodeBody = createBody();
    //nodeIcon = createIcon(type),
    //nodeDescription = createDescription(type);

    nodeSvg.setAttribute("viewBox", "0 0 " + Config.NODE_WIDTH + " " + Config.NODE_HEIGHT);
    nodeSvg.setAttribute("width", Config.NODE_WIDTH);
    nodeSvg.setAttribute("height", Config.NODE_HEIGHT);
    nodeSvg.appendChild(nodeBody);
    //nodeSvg.appendChild(nodeIcon);
    //nodeSvg.appendChild(nodeDescription);
    return nodeSvg;
}

function createBody() {
    let nodeBody = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    nodeBody.setAttribute("x", Config.NODE_BODY_X);
    nodeBody.setAttribute("y", Config.NODE_BODY_Y);
    nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH);
    nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT);
    nodeBody.setAttribute("rx", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("ry", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("fill", Config.NODE_BODY_BACKGROUND_COLOR);
    nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_BACKGROUND_OPACITY_DEEMPHASIZED);
    nodeBody.setAttribute("stroke-width", Config.NODE_BODY_STROKE_WIDTH);
    nodeBody.setAttribute("stroke", Config.NODE_BODY_STROKE_COLOR);
    nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
    return nodeBody;
}

function createIcon(that, type) {
    let nodeIcon;
    switch(type) {

        case Config.TREE_NODE_TYPE_NEW:
            nodeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            break;
        
        case Config.TREE_NODE_TYPE_EXPERIMENT:
            break;

        case Config.TREE_NODE_TYPE_EXPERIMENT_GROUP:
            break;
        
        case Config.TREE_NODE_TYPE_INSTRUCTION:
            break;

        case Config.TREE_NODE_TYPE_BREATHING_EXERCISE:
            break;

        case Config.TREE_NODE_TYPE_QUESTIONNAIRE:
            break;

        case Config.TREE_NODE_TYPE_QUESTION:
            break;

        default:
            break;
    }
    return nodeIcon;
}

export default TreeNodeView;