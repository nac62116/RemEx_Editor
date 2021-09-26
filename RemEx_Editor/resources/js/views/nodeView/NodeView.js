import Config from "../../utils/Config.js";
import {Observable, Event as ControllerEvent} from "../../utils/Observable.js";
import SvgFactory from "../../utils/SvgFactory.js";

const UNDRAGGABLE_TYPES = [Config.TYPE_EXPERIMENT, Config.TYPE_EXPERIMENT_GROUP];

class NodeView extends Observable {

    // TODO: Insert icon via constructor
    constructor(nodeElements, id, type, description, parentNode) {
        super();
        this.nodeElements = nodeElements;
        this.id = id;
        this.type = type;
        this.description = description;
        this.parentNode = parentNode;
        this.previousNode = undefined;
        this.nextNode = undefined;
        this.childNodes = [];
        this.positionBeforeDrag = {
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
        this.centerOffsetVector = {
            x: undefined,
            y: undefined,
        };
        this.isEmphasized = false;
        this.isFocused = false;
        this.isFocusable = true;
        this.isDraging = false;
        this.nodeElements.nodeBody.addEventListener("click", onClick.bind(this));
        this.nodeElements.nodeBody.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeElements.nodeBody.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.nodeElements.nodeBody.addEventListener("mousedown", onStartDrag.bind(this));
        this.nodeElements.nodeBody.addEventListener("mouseup", onDrop.bind(this));
        this.nodeElements.nodeDescription.addEventListener("click", onClick.bind(this));
        this.nodeElements.nodeDescription.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeElements.nodeDescription.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.nodeElements.nodeDescription.addEventListener("mousedown", onStartDrag.bind(this));
        this.nodeElements.nodeDescription.addEventListener("mouseup", onDrop.bind(this));
        document.addEventListener("mousemove", onDrag.bind(this));
        this.updateDescription(description);
    }

    click() {
        this.nodeElements.nodeBody.dispatchEvent(new Event("click"));
    }

    show() {
        this.nodeElements.nodeBody.removeAttribute("display");
        this.nodeElements.nodeDescription.removeAttribute("display");
    }

    hide() {
        this.nodeElements.nodeBody.setAttribute("display", "none");
        this.nodeElements.nodeDescription.setAttribute("display", "none");
    }

    focus() {
        if (!this.isFocused) {
            this.isFocused = true;
            this.nodeElements.nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR_FOCUSED);
        }
    }

    defocus() {
        if (this.isFocused) {
            this.isFocused = false;
            this.nodeElements.nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR);
        }
    }

    emphasize() {
        this.isEmphasized = true;
        this.nodeElements.nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_EMPHASIZED);
        this.nodeElements.nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_EMPHASIZED);
        this.nodeElements.nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    }

    deemphasize() {
        if (!this.isFocused) {
            this.isEmphasized = false;
            this.nodeElements.nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
            this.nodeElements.nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
            this.nodeElements.nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
        }
    }

    returnToPositionBeforeDrag() {
        this.updatePosition(this.positionBeforeDrag.x, this.positionBeforeDrag.y, false);
    }

    updatePosition(centerX, centerY, makeStatic) {
        // Recalculate points
        if (makeStatic) {
            this.positionBeforeDrag = {
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
            y: centerY - this.nodeElements.nodeBody.getAttribute("height") / 2, // eslint-disable-line no-magic-numbers
        };
        this.bottom = {
            x: centerX,
            y: centerY + this.nodeElements.nodeBody.getAttribute("height") / 2, // eslint-disable-line no-magic-numbers
        };
        this.topLeft = {
            x: centerX - this.nodeElements.nodeBody.getAttribute("width") / 2, // eslint-disable-line no-magic-numbers
            y: centerY - this.nodeElements.nodeBody.getAttribute("height") / 2, // eslint-disable-line no-magic-numbers
        };
        this.nodeElements.nodeBody.setAttribute("x", this.topLeft.x);
        this.nodeElements.nodeBody.setAttribute("y", this.topLeft.y);
        this.nodeElements.nodeDescription.setAttribute("x", this.center.x);
        this.nodeElements.nodeDescription.setAttribute("y", this.center.y + Config.NODE_DESCRIPTION_CENTER_OFFSET_Y);
        for (let newLine of this.nodeElements.nodeDescription.children) {
            newLine.setAttribute("x", this.center.x);
            newLine.setAttribute("y", this.center.y + Config.NODE_DESCRIPTION_CENTER_OFFSET_Y);
        }
    }

    updateDescription(description) {
        this.description = description;
        insertDescriptionWithLineBreaks(this, description);
    }
}

function insertDescriptionWithLineBreaks(that, description) {
    let newLine,
    lineSpacing = Config.LINE_SPACING,
    lineNumber = 1,
    substring,
    currentIndex,
    lastWhitespaceIndex;

    // Description fits in one line
    if (description.length <= Config.NODE_DESCRIPTION_LINE_BREAK_COUNT) {
        that.nodeElements.nodeDescription.innerHTML = description;
    }
    // Description does not fit. It is breaked into several lines, if possible at whitespace positions.
    else {
        // First line
        substring = description.slice(0, Config.NODE_DESCRIPTION_LINE_BREAK_COUNT);
        lastWhitespaceIndex = substring.lastIndexOf(" ");
        // There is a whitespace where the line can be broken
        if (lastWhitespaceIndex !== -1) {
            that.nodeElements.nodeDescription.innerHTML = description.slice(0, lastWhitespaceIndex);
            currentIndex = lastWhitespaceIndex + 1;
        }
        // There is not whitespace and the line gets broken after the defined character count (no hyphenation yet)
        else {
            that.nodeElements.nodeDescription.innerHTML = substring;
            currentIndex = Config.NODE_DESCRIPTION_LINE_BREAK_COUNT;
        }
        
        while (lineNumber <= Config.NODE_DESCRIPTION_MAX_NEW_LINE_COUNT) {
            newLine = SvgFactory.createNewTextLine();
            newLine.setAttribute("dy", lineSpacing);
            // Last line
            if (currentIndex + Config.NODE_DESCRIPTION_LINE_BREAK_COUNT >= description.length) {
                substring = description.slice(currentIndex, description.length);
                currentIndex = description.length;
                lineNumber = Config.NODE_DESCRIPTION_MAX_NEW_LINE_COUNT;
            }
            // All other lines
            else {
                substring = description.slice(currentIndex, currentIndex + Config.NODE_DESCRIPTION_LINE_BREAK_COUNT);
                lastWhitespaceIndex = substring.lastIndexOf(" ");
                if (lastWhitespaceIndex !== -1) {
                    substring = description.slice(currentIndex, currentIndex + lastWhitespaceIndex);
                    currentIndex += substring.length + 1;
                }
                else {
                    currentIndex += Config.NODE_DESCRIPTION_LINE_BREAK_COUNT;
                }
            }
            newLine.innerHTML = substring;
            if (lineNumber === Config.NODE_DESCRIPTION_MAX_NEW_LINE_COUNT && currentIndex < description.length) {
                newLine.innerHTML += "...";
            }
            that.nodeElements.nodeDescription.appendChild(newLine);
            lineSpacing += Config.LINE_SPACING;
            lineNumber += 1;
        }
    }
}

// Event callback functions:

function onMouseEnter() {
    let data, controllerEvent;
    
    data = {
        target: this,
    };
    controllerEvent = new ControllerEvent(Config.EVENT_NODE_MOUSE_ENTER, data);
    this.notifyAll(controllerEvent);
}

function onMouseLeave() {
    let data, controllerEvent;
    
    data = {
        target: this,
    };
    controllerEvent = new ControllerEvent(Config.EVENT_NODE_MOUSE_LEAVE, data);
    this.notifyAll(controllerEvent);
}

function onClick() {
    let data, controllerEvent;

    data = {
        target: this,
    };
    controllerEvent = new ControllerEvent(Config.EVENT_NODE_CLICKED, data);
    this.notifyAll(controllerEvent);
}

function onStartDrag(event) {
    let controllerEvent, data;

    if (!UNDRAGGABLE_TYPES.includes(this.type)) {
        this.centerOffsetVector.x = this.center.x - event.clientX;
        this.centerOffsetVector.y = this.center.y - event.clientY;
        this.isDraging = true;
        data = {
            target: this,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_NODE_START_DRAG, data);
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
        controllerEvent = new ControllerEvent(Config.EVENT_NODE_ON_DRAG, data);
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
    controllerEvent = new ControllerEvent(Config.EVENT_NODE_ON_DROP, data);
    this.notifyAll(controllerEvent);
}

export default NodeView;