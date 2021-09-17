import Config from "../../utils/Config.js";
import {Observable, Event} from "../../utils/Observable.js";

const UNDRAGGABLE_TYPES = [Config.TYPE_EXPERIMENT, Config.TYPE_EXPERIMENT_GROUP];

class NodeView extends Observable {

    constructor(id, type, description, parent, previousNode, nextNode) {
        super();
        this.id = id;
        this.type = type;
        this.parentNode = parent;
        this.previousNode = previousNode;
        this.nextNode = nextNode;
        this.childNodes = [];
        this.lastStaticPosition = {
            x: undefined,
            y: undefined,
        };
        this.center = {
            x: undefined,
            y: undefined,
        };
        this.top = {
            x: undefined,
            y: undefined,
        };
        this.bottom = {
            x: undefined,
            y: undefined,
        };
        this.topLeft = {
            x: undefined,
            y: undefined,
        };
        this.topRight = {
            x: undefined,
            y: undefined,
        };
        this.isEmphasized = false;
        this.isFocused = false;
        this.isFocusable = true;
        this.isDraggable = false;
        this.elements = [];
        this.centerOffsetVector = {
            x: undefined,
            y: undefined,
        };
        this.nodeSvg = createNodeSvg(this, description);
        this.nodeSvg.addEventListener("click", onClick.bind(this));
        this.nodeSvg.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeSvg.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.nodeSvg.addEventListener("mousedown", onStartDrag.bind(this));
        document.addEventListener("mousemove", onDrag.bind(this));
        this.nodeSvg.addEventListener("mouseup", onDrop.bind(this));
        this.elements.push(this.nodeSvg);
        if (type !== Config.TYPE_EXPERIMENT) {
            this.addNextNodeButton = createAddButton(this, true);
            this.addPrevNodeButton = createAddButton(this, false);
            this.elements.push(this.addNextNodeButton);
            this.elements.push(this.addPrevNodeButton);
        }
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
            if (this.type !== Config.TYPE_EXPERIMENT) {
                this.addNextNodeButton.removeAttribute("display");
                this.addPrevNodeButton.removeAttribute("display");
            }
            else {
                // No add buttons to hide
            }
        }
        else {
            // This node is already focused.
        }
    }

    defocus() {
        if (this.isFocused) {
            this.isFocused = false;
            if (this.type !== Config.TYPE_EXPERIMENT) {
                this.addNextNodeButton.setAttribute("display", "none");
                this.addPrevNodeButton.setAttribute("display", "none");
            }
            else {
                // No add buttons to hide
            }
        }
        else {
            // This node is already defocused.
        }
    }

    emphasize() {
        let nodeBody,
        nodeDescription;
        
        this.isEmphasized = true;
        if (this.inputPath !== null) {
            this.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED);
        }
        else {
            // No input path to emphasize.
        }
        nodeBody = this.nodeSvg.querySelector("#" + Config.NODE_BODY_ID);
        nodeDescription = this.nodeSvg.querySelector("#" + Config.NODE_DESCRIPTION_ID);
        nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_EMPHASIZED);
        nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_EMPHASIZED);
        nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    }

    deemphasize() {
        let nodeBody,
        nodeDescription;

        if (!this.isFocused) {
            this.isEmphasized = false;
            if (this.inputPath !== null) {
                this.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
            }
            else {
                // No input path to deemphasize
            }
            nodeBody = this.nodeSvg.querySelector("#" + Config.NODE_BODY_ID);
            nodeDescription = this.nodeSvg.querySelector("#" + Config.NODE_DESCRIPTION_ID);
            nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
            nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
            nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
        }
    }

    returnToLastStaticPosition() {
        this.updatePosition(this.lastStaticPosition.x, this.lastStaticPosition.y, false);
    }

    updatePosition(centerX, centerY, makeStatic) {
        // Recalculate points
        if (makeStatic) {
            this.lastStaticPosition = {
                x: centerX,
                y: centerY,
            };
        }
        else {
            // This node is currently moving. It has not yet a new static position.
        }
        this.center = {
            x: centerX,
            y: centerY,
        };
        this.top = {
            x: centerX,
            y: centerY - this.nodeSvg.getAttribute("height") / 2, // eslint-disable-line no-magic-numbers
        };
        this.bottom = {
            x: centerX,
            y: centerY + this.nodeSvg.getAttribute("height") / 2, // eslint-disable-line no-magic-numbers
        };
        this.topLeft = {
            x: centerX - this.nodeSvg.getAttribute("width") / 2, // eslint-disable-line no-magic-numbers
            y: centerY - this.nodeSvg.getAttribute("height") / 2, // eslint-disable-line no-magic-numbers
        };
        this.topRight = {
            x: centerX + this.nodeSvg.getAttribute("width") / 2, // eslint-disable-line no-magic-numbers
            y: centerY - this.nodeSvg.getAttribute("height") / 2, // eslint-disable-line no-magic-numbers
        };
        if (this.inputPath !== null) {
            this.bezierReferencePoint = {
                x: this.parentOutputPoint.x,
                y: (this.parentOutputPoint.y + ((this.top.y - this.parentOutputPoint.y) / 4)), // eslint-disable-line no-magic-numbers
            };
            // Update Positions
            this.inputPath.setAttribute("d", "M " + this.parentOutputPoint.x + " " + this.parentOutputPoint.y + " Q " + this.bezierReferencePoint.x + " " + this.bezierReferencePoint.y + ", " + (this.parentOutputPoint.x + ((this.top.x - this.parentOutputPoint.x) / 2)) + " " + (this.parentOutputPoint.y + ((this.top.y - this.parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + this.top.y); // eslint-disable-line no-magic-numbers
        }
        else {
            // No input path which postion has to be updated.
        }
        if (this.type !== Config.TYPE_EXPERIMENT) {
            this.addNextNodeButton.setAttribute("cx", this.center.x + Config.NODE_ADD_BUTTON_DISTANCE);
            this.addNextNodeButton.setAttribute("cy", this.center.y);
            this.addPrevNodeButton.setAttribute("cx", this.center.x - Config.NODE_ADD_BUTTON_DISTANCE);
            this.addPrevNodeButton.setAttribute("cy", this.center.y);
        }
        else {
            // No add buttons which positions have to be updated.
        }
        this.nodeSvg.setAttribute("x", this.topLeft.x);
        this.nodeSvg.setAttribute("y", this.topLeft.y);
    }

    updateDescription(description) {
        let formatedDescription = description,
        descriptionElement;

        if (description.length > Config.NODE_DESCRIPTION_MAX_LENGTH) {
            formatedDescription = description.substring(0, Config.NODE_DESCRIPTION_MAX_LENGTH) + "...";
        }
        else {
            // Description is short enough
        }
        descriptionElement = this.nodeSvg.querySelector("#" + Config.NODE_DESCRIPTION_ID);
        descriptionElement.remove();
        descriptionElement = createDescription(this, formatedDescription);
        this.nodeSvg.appendChild(descriptionElement);
    }
}

// Event callback functions:

function onMouseEnter() {
    let data, controllerEvent;
    
    data = {
        target: this,
    };
    controllerEvent = new Event(Config.EVENT_NODE_MOUSE_ENTER, data);
    this.notifyAll(controllerEvent);
}

function onMouseLeave() {
    let data, controllerEvent;
    
    data = {
        target: this,
    };
    controllerEvent = new Event(Config.EVENT_NODE_MOUSE_LEAVE, data);
    this.notifyAll(controllerEvent);
}

function onClick() {
    let data, controllerEvent;

    data = {
        target: this,
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
            target: this,
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
            target: this,
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
        target: this,
    };
    controllerEvent = new Event(Config.EVENT_NODE_ON_DROP, data);
    this.notifyAll(controllerEvent);
}

function onAddNextNodeClicked() {
    let controllerEvent, data;

    data = {
        target: this,
        insertionType: Config.INSERT_AFTER,
    };
    controllerEvent = new Event(Config.EVENT_ADD_NODE, data);
    this.notifyAll(controllerEvent);
}

function onAddPrevNodeClicked() {
    let controllerEvent, data;

    data = {
        target: this,
        insertionType: Config.INSERT_BEFORE,
    };
    controllerEvent = new Event(Config.EVENT_ADD_NODE, data);
    this.notifyAll(controllerEvent);
}

function onAddButtonMouseEnter(event) {
    event.target.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
    event.target.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
}

function onAddButtonMouseLeave(event) {
    event.target.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
    event.target.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
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

function createAddButton(that, isNextButton) {
    let addButton = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    if (isNextButton) {
        addButton.addEventListener("click", onAddNextNodeClicked.bind(that));
    }
    else {
        addButton.addEventListener("click", onAddPrevNodeClicked.bind(that));
    }
    addButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(that));
    addButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
    addButton.setAttribute("r", Config.NODE_ADD_BUTTON_RADIUS);
    addButton.setAttribute("fill", Config.NODE_ADD_BUTTON_FILL_COLOR_DEEMPHASIZED);
    addButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
    addButton.setAttribute("stroke", Config.NODE_ADD_BUTTON_STROKE_COLOR);
    addButton.setAttribute("stroke-width", Config.NODE_ADD_BUTTON_STROKE_WIDTH);
    addButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
    addButton.setAttribute("display", "none");
    return addButton;
}

function createNodeSvg(that, description) {
    let nodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    nodeBody = createBody(that),
    //nodeIcon = createIcon(type),
    nodeDescription = createDescription(that, description);

    nodeBody.setAttribute("focusable", false);
    nodeDescription.setAttribute("focusable", false);
    nodeSvg.setAttribute("viewBox", "0 0 " + Config.NODE_WIDTH + " " + Config.NODE_HEIGHT);
    nodeSvg.setAttribute("width", Config.NODE_WIDTH);
    nodeSvg.setAttribute("height", Config.NODE_HEIGHT);
    nodeSvg.appendChild(nodeBody);
    //nodeSvg.appendChild(nodeIcon);
    nodeSvg.appendChild(nodeDescription);
    return nodeSvg;
}

function createBody(that) {
    let nodeBody = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    nodeBody.setAttribute("id", Config.NODE_BODY_ID);
    nodeBody.setAttribute("x", Config.NODE_BODY_X);
    nodeBody.setAttribute("y", Config.NODE_BODY_Y);
    nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH);
    nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT);
    nodeBody.setAttribute("rx", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("ry", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR);
    nodeBody.setAttribute("stroke-width", Config.NODE_BODY_STROKE_WIDTH);
    nodeBody.setAttribute("stroke", Config.NODE_BODY_STROKE_COLOR);
    if (that.isEmphasized) {
        nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_EMPHASIZED);
        nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_EMPHASIZED);
    }
    else {

        nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
        nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
    }
    return nodeBody;
}

// TODO
/*function createIcon(type) {
    let nodeIcon;
    return nodeIcon;
}*/

function createDescription(that, description) {
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
    nodeDescription.setAttribute("font-family", Config.NODE_DESCRIPTION_FONT_FAMILY);
    nodeDescription.setAttribute("font-size", Config.NODE_DESCRIPTION_FONT_SIZE);
    nodeDescription.setAttribute("font-weight", Config.NODE_DESCRIPTION_FONT_WEIGHT);
    if (that.isEmphasized) {
        nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    }
    else {
        nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
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