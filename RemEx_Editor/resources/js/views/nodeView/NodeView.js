import Config from "../../utils/Config.js";
import {Observable, Event as ControllerEvent} from "../../utils/Observable.js";
import SvgFactory from "../../utils/SvgFactory.js";

class NodeView extends Observable {

    // TODO: Insert icon via constructor
    constructor(nodeElements, id, type, description) {
        super();
        this.nodeElements = nodeElements;
        this.id = id;
        this.type = type;
        this.description = description;
        this.parentNode = undefined;
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
        this.isClickable = true;
        this.nodeElements.nodeBody.addEventListener("click", onClick.bind(this));
        this.nodeElements.nodeBody.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeElements.nodeBody.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.nodeElements.nodeDescription.addEventListener("click", onClick.bind(this));
        this.nodeElements.nodeDescription.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeElements.nodeDescription.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.nodeElements.nodeIcon.addEventListener("click", onClick.bind(this));
        this.nodeElements.nodeIcon.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.nodeElements.nodeIcon.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.updateDescription(description);
    }

    click() {
        this.nodeElements.nodeBody.dispatchEvent(new Event("mouseenter"));
        this.nodeElements.nodeBody.dispatchEvent(new Event("click"));
    }

    show() {
        this.nodeElements.nodeBody.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.nodeElements.nodeDescription.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.nodeElements.nodeIcon.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }

    hide() {
        this.nodeElements.nodeBody.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.nodeElements.nodeDescription.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.nodeElements.nodeIcon.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }

    focus() {
        this.nodeElements.nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR_FOCUSED);
        this.nodeElements.nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_FOCUSED);
    }

    defocus() {
        this.nodeElements.nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR);
        this.nodeElements.nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
    }

    emphasize() {
        this.nodeElements.nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_EMPHASIZED);
        this.nodeElements.nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_EMPHASIZED);
        this.nodeElements.nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
        this.nodeElements.nodeIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_EMPHASIZED);
    }

    deemphasize() {
        this.nodeElements.nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
        this.nodeElements.nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
        this.nodeElements.nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
        this.nodeElements.nodeIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
    }

    updatePosition(centerX, centerY) {
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
        this.nodeElements.nodeIcon.setAttribute("x", this.center.x - Config.NODE_ICON_CENTER_OFFSET_X);
        this.nodeElements.nodeIcon.setAttribute("y", this.center.y - Config.NODE_ICON_CENTER_OFFSET_Y);
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

    setIsClickable(isClickable) {
        this.isClickable = isClickable;
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
            if (that.nodeElements.nodeDescription.getAttribute("x") !== null) {
                newLine.setAttribute("x", that.nodeElements.nodeDescription.getAttribute("x"));
                newLine.setAttribute("y", that.nodeElements.nodeDescription.getAttribute("y"));
            }
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
    
    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_NODE_MOUSE_ENTER, data);
        this.notifyAll(controllerEvent);
    }
}

function onMouseLeave() {
    let data, controllerEvent;
    
    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_NODE_MOUSE_LEAVE, data);
        this.notifyAll(controllerEvent);
    }
}

function onClick() {
    let data, controllerEvent;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_NODE_CLICKED, data);
        this.notifyAll(controllerEvent);
    }
}

export default NodeView;