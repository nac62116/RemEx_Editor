/* eslint-env broswer */

import Config from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";

class TreeNodeView extends Observable {

    constructor(id, centerX, centerY, parentOutputPoint, type, description) {
        super();
        this.id = id;
        this.type = type;
        this.isFocused = false;
        this.elements = [];
        this.parentOutputPoint = parentOutputPoint;
        if (parentOutputPoint !== null) {
            this.inputPath = createInputPath();
            this.elements.push(this.inputPath);
        }
        this.nodeSvg = createNodeSvg(type, description);
        this.nodeSvg.addEventListener("click", onClick.bind(this));
        this.nodeSvg.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeSvg.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.nodeSvg.addEventListener('mousedown', onStartDrag.bind(this));
        this.nodeSvg.addEventListener('mousemove', onDrag.bind(this));
        this.nodeSvg.addEventListener('mouseup', onDrop.bind(this));
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
        if (this.inputPath !== null) {
            this.inputPath.removeAttribute("display");
        }
        for (let element of this.nodeSvg.children) {
            element.removeAttribute("display");
            element.removeAttribute("display");
        }
    }

    hide() {
        if (this.inputPath !== null) {
            this.inputPath.setAttribute("display", "none");
        }
        for (let element of this.nodeSvg.children) {
            element.setAttribute("display", "none");
            element.setAttribute("display", "none");
        }
    }

    focus() {
        this.isFocused = true;
    }

    defocus() {
        this.isFocused = false;
        this.deemphasize();
    }

    emphasize() {
        let newFillOpacity, newStrokeOpacity;
        if (this.inputPath !== null) {
            this.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED);
        }
        for (let element of this.nodeSvg.children) {
            newFillOpacity = element.getAttribute("fill-opacity") * 1 + element.getAttribute(Config.EMPHASIZE_FILL_OPACITY_BY) * 1;
            newStrokeOpacity = element.getAttribute("stroke-opacity") * 1 + element.getAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY) * 1;
            element.setAttribute("fill-opacity", newFillOpacity);
            element.setAttribute("stroke-opacity", newStrokeOpacity);
        }
    }

    deemphasize() {
        let newFillOpacity, newStrokeOpacity;
        if (this.inputPath !== null) {
            this.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
        }
        for (let element of this.nodeSvg.children) {
            newFillOpacity = element.getAttribute("fill-opacity") * 1 - element.getAttribute(Config.EMPHASIZE_FILL_OPACITY_BY) * 1;
            newStrokeOpacity = element.getAttribute("stroke-opacity") * 1 - element.getAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY) * 1;
            element.setAttribute("fill-opacity", newFillOpacity);
            element.setAttribute("stroke-opacity", newStrokeOpacity);
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

// Event callback functions:

function onClick() {
    let data, event;

    if (!this.isFocused) {
        data = {
            id: this.id,
            type: this.type
        };
        event = new Event(Config.EVENT_NODE_CLICKED, data);
        this.focus();
        this.notifyAll(event);
    }
}

function onMouseEnter(event) {
    if (!this.isFocused) {
        this.emphasize();
    }
}

function onMouseLeave(event) {
    if (!this.isFocused) {
        this.deemphasize();
    }
}

function onStartDrag(event) {
    console.log(event);
}

function onDrag(event) {
    console.log(event);
}

function onDrop(event) {
    console.log(event);
}

// Svg element creation:

function createInputPath() {
    let inputPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    inputPath.setAttribute("stroke-width", Config.NODE_INPUT_PATH_STROKE_WIDTH);
    inputPath.setAttribute("stroke", Config.NODE_INPUT_PATH_STROKE_COLOR);
    inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
    inputPath.setAttribute("fill", "transparent");
    return inputPath;
}

function createNodeSvg(type, description) {
    let nodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    nodeBody = createBody(),
    nodeIcon = createIcon(type),
    nodeDescription = createDescription(description);

    nodeSvg.setAttribute("viewBox", "0 0 " + Config.NODE_WIDTH + " " + Config.NODE_HEIGHT);
    nodeSvg.setAttribute("width", Config.NODE_WIDTH);
    nodeSvg.setAttribute("height", Config.NODE_HEIGHT);
    nodeSvg.appendChild(nodeBody);
    //nodeSvg.appendChild(nodeIcon);
    nodeSvg.appendChild(nodeDescription);
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
    nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR);
    nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
    nodeBody.setAttribute(Config.EMPHASIZE_FILL_OPACITY_BY, Config.NODE_BODY_FILL_OPACITY_EMPHASIZE_BY);
    nodeBody.setAttribute("stroke-width", Config.NODE_BODY_STROKE_WIDTH);
    nodeBody.setAttribute("stroke", Config.NODE_BODY_STROKE_COLOR);
    nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
    nodeBody.setAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY, Config.NODE_BODY_STROKE_OPACITY_EMPHASIZE_BY);
    return nodeBody;
}

function createIcon(type) {
    let nodeIcon;
    switch(type) {
        // TODO
        case Config.NODE_TYPE_NEW:
            break;
        
        case Config.NODE_TYPE_EXPERIMENT:
            break;

        case Config.NODE_TYPE_EXPERIMENT_GROUP:
            break;
        
        case Config.NODE_TYPE_INSTRUCTION:
            break;

        case Config.NODE_TYPE_BREATHING_EXERCISE:
            break;

        case Config.NODE_TYPE_QUESTIONNAIRE:
            break;

        case Config.NODE_TYPE_QUESTION:
            break;

        default:
            break;
    }
    return nodeIcon;
}

function createDescription(description) {
    let nodeDescription = document.createElementNS("http://www.w3.org/2000/svg", "text"),
    newLine,
    lastWhitespaceIndex,
    substring,
    currentIndex;
    nodeDescription.setAttribute("x", Config.NODE_DESCRIPTION_X);
    nodeDescription.setAttribute("y", Config.NODE_DESCRIPTION_Y);
    nodeDescription.setAttribute("text-anchor", Config.NODE_DESCRIPTION_TEXT_ANCHOR);
    nodeDescription.setAttribute("fill", Config.NODE_DESCRIPTION_COLOR);
    nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    nodeDescription.setAttribute(Config.EMPHASIZE_FILL_OPACITY_BY, Config.NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZE_BY);
    nodeDescription.setAttribute("stroke-opacity", Config.NODE_DESCRIPTION_STROKE_OPACITY_DEEMPHASIZED);
    nodeDescription.setAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY, Config.NODE_DESCRIPTION_STROKE_OPACITY_EMPHASIZE_BY);
    nodeDescription.setAttribute("font-family", Config.NODE_DESCRIPTION_FONT_FAMILY);
    nodeDescription.setAttribute("font-size", Config.NODE_DESCRIPTION_FONT_SIZE);
    nodeDescription.setAttribute("font-weight", Config.NODE_DESCRIPTION_FONT_WEIGHT);
    // Description fits in one line
    if (description.length <= Config.NODE_DESCRIPTION_LINE_BREAK_COUNT) {
        nodeDescription.innerHTML = description;
    }
    // Description does not fit. It is breaked into several lines, if possible at whitespace positions.
    else {
        // First line
        substring = description.substr(0, Config.NODE_DESCRIPTION_LINE_BREAK_COUNT);
        lastWhitespaceIndex = substring.lastIndexOf(" ");
        if (lastWhitespaceIndex !== -1) {
            nodeDescription.innerHTML = description.slice(0, lastWhitespaceIndex);
            currentIndex = lastWhitespaceIndex + 1;
        }
        else {
            nodeDescription.innerHTML = substring;
            currentIndex = Config.NODE_DESCRIPTION_LINE_BREAK_COUNT;
        }
        while (currentIndex < description.length) {
            newLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            newLine.setAttribute("x", Config.NODE_DESCRIPTION_X);
            newLine.setAttribute("dy", Config.NODE_DESCRIPTION_LINE_SPACING);
            // Last line
            if (currentIndex + Config.NODE_DESCRIPTION_LINE_BREAK_COUNT > description.length) {
                substring = description.slice(currentIndex, description.length);
                currentIndex = description.length;
            }
            // All other lines
            else {
                substring = description.substr(0, currentIndex + Config.NODE_DESCRIPTION_LINE_BREAK_COUNT);
                lastWhitespaceIndex = substring.lastIndexOf(" ");
                if (lastWhitespaceIndex !== -1) {
                    substring = description.slice(currentIndex, lastWhitespaceIndex);
                    currentIndex += substring.length + 1;
                }
                else {
                    substring = description.substr(currentIndex, Config.NODE_DESCRIPTION_LINE_BREAK_COUNT);
                    currentIndex += Config.NODE_DESCRIPTION_LINE_BREAK_COUNT;
                }
            }
            newLine.innerHTML = substring;
            nodeDescription.appendChild(newLine);
        }
    }
    return nodeDescription;
}

export default TreeNodeView;