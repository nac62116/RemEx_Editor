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
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.addEventListener("click", onAddPreviousNodeClicked.bind(this));
            this.nodeElements.addPreviousButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addPreviousButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        }
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.addEventListener("click", onAddChildNodeClicked.bind(this));
            this.nodeElements.addChildButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
            this.nodeElements.addChildButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        }
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
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.removeAttribute("display");
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
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.setAttribute("display", "none");
        }
        this.hideAddChildButton();
    }

    emphasize() {
        super.emphasize();
        this.nodeElements.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED);
    }

    deemphasize() {
        //console.log("before deemphasize node view");
        super.deemphasize();
        //console.log("before deemphasize standard node");
        this.nodeElements.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
        //console.log("after deemphasize standard node");
    
    }

    updatePosition(centerX, centerY) {
        let parentOutputPoint,
        bezierReferencePoint;

        super.updatePosition(centerX, centerY);
        //console.log("Standard node update position");
        parentOutputPoint = this.parentNode.bottom;
        bezierReferencePoint = {
            x: parentOutputPoint.x,
            y: (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 4)), // eslint-disable-line no-magic-numbers
        };
        this.nodeElements.inputPath.setAttribute("d", "M " + parentOutputPoint.x + " " + parentOutputPoint.y + " Q " + bezierReferencePoint.x + " " + bezierReferencePoint.y + ", " + (parentOutputPoint.x + ((this.top.x - parentOutputPoint.x) / 2)) + " " + (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + this.top.y); // eslint-disable-line no-magic-numbers
        if (this.nodeElements.addNextButton !== undefined) {
            this.nodeElements.addNextButton.setAttribute("cx", this.center.x + Config.NODE_ADD_PREV_NEXT_BUTTON_CENTER_OFFSET_X);
            this.nodeElements.addNextButton.setAttribute("cy", this.center.y);
        }
        if (this.nodeElements.addPreviousButton !== undefined) {
            this.nodeElements.addPreviousButton.setAttribute("cx", this.center.x - Config.NODE_ADD_PREV_NEXT_BUTTON_CENTER_OFFSET_X);
            this.nodeElements.addPreviousButton.setAttribute("cy", this.center.y);
        }
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.setAttribute("cx", this.center.x);
            this.nodeElements.addChildButton.setAttribute("cy", this.center.y + Config.NODE_ADD_CHILD_BUTTON_CENTER_OFFSET_Y);
        }
    }

    hideAddChildButton() {
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.setAttribute("display", "none");
        }
    }

    showAddChildButton() {
        if (this.nodeElements.addChildButton !== undefined) {
            this.nodeElements.addChildButton.removeAttribute("display");
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
        };
        controllerEvent = new ControllerEvent(Config.EVENT_ADD_PREVIOUS_NODE, data);
        this.notifyAll(controllerEvent);
    }
}

function onAddChildNodeClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new ControllerEvent(Config.EVENT_ADD_CHILD_NODE, data);
        this.notifyAll(controllerEvent);
    }
}

function onAddButtonMouseEnter(event) {
    if (this.isClickable) {
        event.target.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
        event.target.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
    }
}

function onAddButtonMouseLeave(event) {
    if (this.isClickable) {
        event.target.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
        event.target.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
    }
}

export default StandardNode;