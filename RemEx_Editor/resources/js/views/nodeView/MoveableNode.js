import Config from "../../utils/Config.js";
import StandardNode from "./StandardNode.js";
import {Event} from "../../utils/Observable.js";

class MoveableNode extends StandardNode {

    constructor(nodeElements, id, type, description) {
        super(nodeElements, id, type, description);
        this.nodeElements.moveRightButton.addEventListener("click", onMoveRightButtonClicked.bind(this));
        this.nodeElements.moveRightButton.addEventListener("mouseenter", onMoveButtonMouseEnter.bind(this));
        this.nodeElements.moveRightButton.addEventListener("mouseleave", onMoveButtonMouseLeave.bind(this));
        this.nodeElements.moveLeftButton.addEventListener("click", onMoveLeftButtonClicked.bind(this));
        this.nodeElements.moveLeftButton.addEventListener("mouseenter", onMoveButtonMouseEnter.bind(this));
        this.nodeElements.moveLeftButton.addEventListener("mouseleave", onMoveButtonMouseLeave.bind(this));
    }

    showMoveLeftButton() {
        this.nodeElements.moveLeftButton.removeAttribute("display");
    }

    hideMoveLeftButton() {
        this.nodeElements.moveLeftButton.setAttribute("display", "none");
    }

    showMoveRightButton() {
        this.nodeElements.moveRightButton.removeAttribute("display");
    }

    hideMoveRightButton() {
        this.nodeElements.moveRightButton.setAttribute("display", "none");
    }

    focus() {
        super.focus();
        if (this.nextNode !== undefined) {
            this.nodeElements.moveRightButton.removeAttribute("display");
        }
        if (this.previousNode !== undefined) {
            this.nodeElements.moveLeftButton.removeAttribute("display");
        }
    }

    defocus() {
        super.defocus();
        this.nodeElements.moveRightButton.setAttribute("display", "none");
        this.nodeElements.moveLeftButton.setAttribute("display", "none");
    }

    updatePosition(centerX, centerY) {
        super.updatePosition(centerX, centerY);

        this.nodeElements.moveRightButton.setAttribute("cx", this.center.x + Config.NODE_MOVE_BUTTON_CENTER_OFFSET_X);
        this.nodeElements.moveRightButton.setAttribute("cy", this.center.y - Config.NODE_MOVE_BUTTON_CENTER_OFFSET_Y);

        this.nodeElements.moveLeftButton.setAttribute("cx", this.center.x - Config.NODE_MOVE_BUTTON_CENTER_OFFSET_X);
        this.nodeElements.moveLeftButton.setAttribute("cy", this.center.y - Config.NODE_MOVE_BUTTON_CENTER_OFFSET_Y);
        
    }
}

function onMoveRightButtonClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new Event(Config.EVENT_MOVE_NODE_RIGHT, data);
        this.notifyAll(controllerEvent);
    }
}

function onMoveLeftButtonClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new Event(Config.EVENT_MOVE_NODE_LEFT, data);
        this.notifyAll(controllerEvent);
    }
}

function onMoveButtonMouseEnter(event) {
    if (this.isClickable) {
        event.target.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
        event.target.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
    }
}

function onMoveButtonMouseLeave(event) {
    if (this.isClickable) {
        event.target.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
        event.target.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
    }
}

export default MoveableNode;