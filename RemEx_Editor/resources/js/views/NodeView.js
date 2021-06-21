/* eslint-env broswer */

import Config from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";

const UNDRAGGABLE_TYPES = [Config.NODE_TYPE_EXPERIMENT, Config.NODE_TYPE_EXPERIMENT_GROUP];

class NodeView extends Observable {

    constructor(id, type, description) {
        super();
        this.id = id;
        this.type = type;
        this.isEmphasized = false;
        this.isFocused = false;
        this.isFocusable = true;
        this.isDraggable = false;
        this.elements = [];
        this.centerOffsetVector = {
            x: undefined,
            y: undefined
        };
        this.nodeSvg = createNodeSvg(type, description);
        this.nodeSvg.addEventListener("click", onClick.bind(this));
        this.nodeSvg.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeSvg.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.nodeSvg.addEventListener("mousedown", onStartDrag.bind(this));
        document.addEventListener("mousemove", onDrag.bind(this));
        this.nodeSvg.addEventListener("mouseup", onDrop.bind(this));
        this.elements.push(this.nodeSvg);
        this.childNodes = [];
    }

    setInputPath(parentOutputPoint) {
        this.parentOutputPoint = parentOutputPoint;
        if (parentOutputPoint !== null) {
            this.inputPath = createInputPath();
            this.elements.push(this.inputPath);
        }
        else {
            this.inputPath = null;
        }
    }

    show() {
        if (this.inputPath !== null) {
            this.inputPath.removeAttribute("display");
        }
        else {
            // No input path to show.
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
        else {
            // No input path to hide.
        }
        for (let element of this.nodeSvg.children) {
            element.setAttribute("display", "none");
            element.setAttribute("display", "none");
        }
    }

    focus() {
        if (!this.isFocused) {
            this.isFocused = true;
        }
        else {
            // This node is already focused.
        }
    }

    defocus() {
        if (this.isFocused) {
            this.isFocused = false;
            this.deemphasize();
        }
        else {
            // This node is already defocused.
        }
    }

    emphasize() {
        let newFillOpacity, newStrokeOpacity;

        if (!this.isEmphasized && !this.isFocused && this.isFocusable) {
            this.isEmphasized = true;
            if (this.inputPath !== null) {
                this.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED);
            }
            else {
                // No input path to emphasize.
            }
            for (let element of this.nodeSvg.children) {
                newFillOpacity = element.getAttribute("fill-opacity") * 1 + element.getAttribute(Config.EMPHASIZE_FILL_OPACITY_BY) * 1;
                newStrokeOpacity = element.getAttribute("stroke-opacity") * 1 + element.getAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY) * 1;
                element.setAttribute("fill-opacity", newFillOpacity);
                element.setAttribute("stroke-opacity", newStrokeOpacity);
            }
        }
        else {
            // This node is either already focused or it is not focusable (nodes are not focusable if other nodes are currently dragged arround).
        }
    }

    deemphasize() {
        let newFillOpacity, newStrokeOpacity;

        if (this.isEmphasized && !this.isFocused && this.isFocusable) {
            this.isEmphasized = false;
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
        else {
            // This node is either already focused or it is not focusable (nodes are not focusable if other nodes are currently dragged arround).
        }
    }

    returnToLastStaticPosition() {
        this.updatePosition(this.lastStaticPosition.x, this.lastStaticPosition.y, false);
    }

    updatePosition(centerX, centerY, parentOutputPoint, makeStatic) {
        // Recalculate points
        if (makeStatic) {
            this.lastStaticPosition = {
                x: centerX,
                y: centerY
            }
        }
        else {
            // This node is currently moving. It has not yet a new static position.
        }
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
        if (this.inputPath !== null) {
            this.bezierReferencePoint = {
                x: this.parentOutputPoint.x,
                y: (this.parentOutputPoint.y + ((this.top.y - this.parentOutputPoint.y) / 4))
            }
            // Update Positions
            this.inputPath.setAttribute("d", "M " + this.parentOutputPoint.x + " " + this.parentOutputPoint.y + " Q " + this.bezierReferencePoint.x + " " + this.bezierReferencePoint.y + ", " + (this.parentOutputPoint.x + ((this.top.x - this.parentOutputPoint.x) / 2)) + " " + (this.parentOutputPoint.y + ((this.top.y - this.parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + this.top.y);
        }
        else {
            // No input path which postion has to be updated.
        }
        this.nodeSvg.setAttribute("x", this.topLeft.x);
        this.nodeSvg.setAttribute("y", this.topLeft.y);
    }

    updateDescription(description) {
        let descriptionElement = this.nodeSvg.querySelector("#" + Config.NODE_DESCRIPTION_ID);
        descriptionElement.remove();
        descriptionElement = createDescription(description, true);
        this.nodeSvg.appendChild(descriptionElement);
    }
}


// Event callback functions:

function onMouseEnter() {
    let data, controllerEvent;
    
    data = {
        target: this
    };
    controllerEvent = new Event(Config.EVENT_NODE_MOUSE_ENTER, data);
    this.notifyAll(controllerEvent);
}

function onMouseLeave() {
    let data, controllerEvent;
    
    data = {
        target: this
    };
    controllerEvent = new Event(Config.EVENT_NODE_MOUSE_LEAVE, data);
    this.notifyAll(controllerEvent);
}

function onClick() {
    let data, controllerEvent;

    data = {
        target: this
    };
    controllerEvent = new Event(Config.EVENT_NODE_CLICKED, data);
    this.notifyAll(controllerEvent);
}

function onStartDrag(event) {
    let controllerEvent, data;

    if (!UNDRAGGABLE_TYPES.includes(this.type)) {
        this.centerOffsetVector.x = this.center.x - event.clientX;
        this.centerOffsetVector.y = this.center.y - event.clientY;
        this.isDraggable = true;
        data = {
            target: this
        };
        controllerEvent = new Event(Config.EVENT_NODE_START_DRAG, data);
        this.notifyAll(controllerEvent);
    }
    else {
        // This node type is not draggable at all
    }
}

function onDrag(event) {
    let x, y, controllerEvent, data;

    if (this.isDraggable) {
        x = event.clientX + this.centerOffsetVector.x;
        y = event.clientY + this.centerOffsetVector.y;
        this.updatePosition(x, y, false);
        data = {
            target: this
        };
        controllerEvent = new Event(Config.EVENT_NODE_ON_DRAG, data);
        this.notifyAll(controllerEvent);
    }
    else {
        // This node is currently not draggable
    }
}

function onDrop() {
    let controllerEvent, data;

    this.isDraggable = false;
    data = {
        target: this
    };
    controllerEvent = new Event(Config.EVENT_NODE_ON_DROP, data);
    this.notifyAll(controllerEvent);
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
    //nodeIcon = createIcon(type),
    nodeDescription = createDescription(description, false);

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
    return nodeIcon;
}

function createDescription(description, isEmphasized) {
    let nodeDescription = document.createElementNS("http://www.w3.org/2000/svg", "text"),
    newLine,
    lastWhitespaceIndex,
    substring,
    currentIndex;
    nodeDescription.setAttribute("id", Config.NODE_DESCRIPTION_ID);
    nodeDescription.setAttribute("x", Config.NODE_DESCRIPTION_X);
    nodeDescription.setAttribute("y", Config.NODE_DESCRIPTION_Y);
    nodeDescription.setAttribute("text-anchor", Config.NODE_DESCRIPTION_TEXT_ANCHOR);
    nodeDescription.setAttribute("fill", Config.NODE_DESCRIPTION_COLOR);
    nodeDescription.setAttribute(Config.EMPHASIZE_FILL_OPACITY_BY, Config.NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZE_BY);
    nodeDescription.setAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY, Config.NODE_DESCRIPTION_STROKE_OPACITY_EMPHASIZE_BY);
    nodeDescription.setAttribute("font-family", Config.NODE_DESCRIPTION_FONT_FAMILY);
    nodeDescription.setAttribute("font-size", Config.NODE_DESCRIPTION_FONT_SIZE);
    nodeDescription.setAttribute("font-weight", Config.NODE_DESCRIPTION_FONT_WEIGHT);
    if (isEmphasized) {
        nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED + Config.EMPHASIZE_FILL_OPACITY_BY);
        nodeDescription.setAttribute("stroke-opacity", Config.NODE_DESCRIPTION_STROKE_OPACITY_DEEMPHASIZED + Config.EMPHASIZE_STROKE_OPACITY_BY);
    }
    else {
        nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
        nodeDescription.setAttribute("stroke-opacity", Config.NODE_DESCRIPTION_STROKE_OPACITY_DEEMPHASIZED);
    }
    // Description fits in one line
    if (description.length <= Config.NODE_DESCRIPTION_LINE_BREAK_COUNT) {
        nodeDescription.innerHTML = description;
    }
    // Description does not fit. It is breaked into several lines, if possible at whitespace positions.
    else {
        // First line
        substring = description.substr(0, Config.NODE_DESCRIPTION_LINE_BREAK_COUNT);
        lastWhitespaceIndex = substring.lastIndexOf(" ");
        // There is a whitespace where the line can be broken
        if (lastWhitespaceIndex !== -1) {
            nodeDescription.innerHTML = description.slice(0, lastWhitespaceIndex);
            currentIndex = lastWhitespaceIndex + 1;
        }
        // There is not whitespace and the line gets broken after the defined character count (no hyphenation yet)
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

export default NodeView;