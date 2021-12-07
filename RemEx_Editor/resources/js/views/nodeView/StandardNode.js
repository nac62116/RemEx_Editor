import NodeView from "./NodeView.js";
import {Event as ControllerEvent} from "../../utils/Observable.js";
import Config from "../../utils/Config.js";

class StandardNode extends NodeView {

    constructor(nodeElements, id, type, description) {
        super(nodeElements, id, type, description);
        
        if (this.nodeElements.addNextButton !== undefined) {
            this.nodeElements.addNextButton.addEventListener("click", onAddNextNodeClicked.bind(this));
            this.nodeElements.addNextButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addNextButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
            this.nodeElements.addNextIcon.addEventListener("click", onAddNextNodeClicked.bind(this));
            this.nodeElements.addNextIcon.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addNextIcon.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.addEventListener("click", onAddPreviousNodeClicked.bind(this));
            this.nodeElements.addPreviousButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addPreviousButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
            this.nodeElements.addPreviousIcon.addEventListener("click", onAddPreviousNodeClicked.bind(this));
            this.nodeElements.addPreviousIcon.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addPreviousIcon.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        }
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.addEventListener("click", onAddChildNodeClicked.bind(this));
            this.nodeElements.addChildButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addChildButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
            this.nodeElements.addChildIcon.addEventListener("click", onAddChildNodeClicked.bind(this));
            this.nodeElements.addChildIcon.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addChildIcon.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        }
        // This property is only defined when the add buttons are triggered programmatically
        // and we want to add already defined data (e.g. onPasteNode)
        this.nodeData = undefined;
    }

    show() {
        super.show();
        this.nodeElements.inputPath.removeAttribute("display");
    }

    hide() {
        super.hide();
        this.nodeElements.inputPath.setAttribute("display", "none");
    }

    focus() {
        super.focus();

        if (this.nodeElements.addNextButton !== undefined) {
            this.nodeElements.addNextButton.removeAttribute("display");
            this.nodeElements.addNextIcon.removeAttribute("display");
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.removeAttribute("display");
            this.nodeElements.addPreviousIcon.removeAttribute("display");
        }
        if (this.childNodes.length === 0) {
            this.showAddChildButton();
        }
        else {
            this.hideAddChildButton();
        }
    }

    defocus() {
        super.defocus();

        if (this.nodeElements.addNextButton !== undefined) {
            this.nodeElements.addNextButton.setAttribute("display", "none");
            this.nodeElements.addNextIcon.setAttribute("display", "none");
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.setAttribute("display", "none");
            this.nodeElements.addPreviousIcon.setAttribute("display", "none");
        }
        this.hideAddChildButton();
    }

    emphasize() {
        super.emphasize();
        this.nodeElements.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED);
    }

    deemphasize() {
        super.deemphasize();
        this.nodeElements.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
    
    }

    updatePosition(centerX, centerY) {
        let parentOutputPoint,
        bezierReferencePoint;

        super.updatePosition(centerX, centerY);
        parentOutputPoint = this.parentNode.bottom;
        bezierReferencePoint = {
            x: parentOutputPoint.x,
            y: (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 4)), // eslint-disable-line no-magic-numbers
        };
        this.nodeElements.inputPath.setAttribute("d", "M " + parentOutputPoint.x + " " + parentOutputPoint.y + " Q " + bezierReferencePoint.x + " " + bezierReferencePoint.y + ", " + (parentOutputPoint.x + ((this.top.x - parentOutputPoint.x) / 2)) + " " + (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + this.top.y); // eslint-disable-line no-magic-numbers
        if (this.nodeElements.addNextButton !== undefined) {
            this.nodeElements.addNextButton.setAttribute("cx", this.center.x + Config.NODE_ADD_PREV_NEXT_BUTTON_CENTER_OFFSET_X);
            this.nodeElements.addNextButton.setAttribute("cy", this.center.y);
            this.nodeElements.addNextIcon.setAttribute("x", this.center.x + Config.NODE_ADD_PREV_NEXT_BUTTON_CENTER_OFFSET_X - Config.NODE_ADD_ICON_WIDTH * 1 / 2); // eslint-disable-line no-magic-numbers
            this.nodeElements.addNextIcon.setAttribute("y", this.center.y - Config.NODE_ADD_ICON_HEIGHT * 1 / 2); // eslint-disable-line no-magic-numbers
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.setAttribute("cx", this.center.x - Config.NODE_ADD_PREV_NEXT_BUTTON_CENTER_OFFSET_X);
            this.nodeElements.addPreviousButton.setAttribute("cy", this.center.y);
            this.nodeElements.addPreviousIcon.setAttribute("x", this.center.x - Config.NODE_ADD_PREV_NEXT_BUTTON_CENTER_OFFSET_X - Config.NODE_ADD_ICON_WIDTH * 1 / 2); // eslint-disable-line no-magic-numbers
            this.nodeElements.addPreviousIcon.setAttribute("y", this.center.y - Config.NODE_ADD_ICON_HEIGHT * 1 / 2); // eslint-disable-line no-magic-numbers
        }
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.setAttribute("cx", this.center.x);
            this.nodeElements.addChildButton.setAttribute("cy", this.center.y + Config.NODE_ADD_CHILD_BUTTON_CENTER_OFFSET_Y);
            this.nodeElements.addChildIcon.setAttribute("x", this.center.x - Config.NODE_ADD_ICON_WIDTH * 1 / 2); // eslint-disable-line no-magic-numbers
            this.nodeElements.addChildIcon.setAttribute("y", this.center.y + Config.NODE_ADD_CHILD_BUTTON_CENTER_OFFSET_Y - Config.NODE_ADD_ICON_HEIGHT * 1 / 2); // eslint-disable-line no-magic-numbers
        }
    }

    clickAddPreviousButton(nodeData) {
        let event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        this.nodeData = nodeData;
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.dispatchEvent(event);
        }
    }

    clickAddChildButton(nodeData) {
        let event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        this.nodeData = nodeData;
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.dispatchEvent(event);
        }
    }

    hideAddChildButton() {
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.setAttribute("display", "none");
            this.nodeElements.addChildIcon.setAttribute("display", "none");
        }
    }

    showAddChildButton() {
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.removeAttribute("display");
            this.nodeElements.addChildIcon.removeAttribute("display");
        }
    }
}

function onAddNextNodeClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_ADD_NEXT_NODE, data);
        this.notifyAll(controllerEvent);
    }
}

function onAddPreviousNodeClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
            nodeData: this.nodeData,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_ADD_PREVIOUS_NODE, data);
        this.notifyAll(controllerEvent);
    }
    this.nodeData = undefined;
}

function onAddChildNodeClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
            nodeData: this.nodeData,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_ADD_CHILD_NODE, data);
        this.notifyAll(controllerEvent);
    }
    this.nodeData = undefined;
}

function onAddButtonMouseEnter(event) {
    if (this.isClickable) {
        
        if (event.target === this.nodeElements.addNextButton
            || event.target === this.nodeElements.addNextIcon) {
                this.nodeElements.addNextButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
                this.nodeElements.addNextButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
                this.nodeElements.addNextIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_EMPHASIZED);
        }
        else if (event.target === this.nodeElements.addPreviousButton
                || event.target === this.nodeElements.addPreviousIcon) {
                    this.nodeElements.addPreviousButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
                    this.nodeElements.addPreviousButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
                    this.nodeElements.addPreviousIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_EMPHASIZED);
        }
        else {
            this.nodeElements.addChildButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
            this.nodeElements.addChildButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
            this.nodeElements.addChildIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_EMPHASIZED);
        }
    }
}

function onAddButtonMouseLeave(event) {
    if (this.isClickable) {
        if (event.target === this.nodeElements.addNextButton
            || event.target === this.nodeElements.addNextIcon) {
                this.nodeElements.addNextButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
                this.nodeElements.addNextButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
                this.nodeElements.addNextIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
        }
        else if (event.target === this.nodeElements.addPreviousButton
                || event.target === this.nodeElements.addPreviousIcon) {
                    this.nodeElements.addPreviousButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
                    this.nodeElements.addPreviousButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
                    this.nodeElements.addPreviousIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
        }
        else {
            this.nodeElements.addChildButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
            this.nodeElements.addChildButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
            this.nodeElements.addChildIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
        }
    }
}

export default StandardNode;