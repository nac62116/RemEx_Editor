import NodeView from "./NodeView.js";
import {Event} from "../../utils/Observable.js";
import Config from "../../utils/Config.js";

class RootNode extends NodeView {

    constructor(nodeElements, id, type, description) {
        super(nodeElements, id, type, description, undefined);
        
        this.nodeElements.addChildButton.addEventListener("click", onAddChildNodeClicked.bind(this));
        this.nodeElements.addChildButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
        this.nodeElements.addChildButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
    }

    focus() {
        super.focus();
        if (this.childNodes.length === 0) {
            this.showAddChildButton();
        }
        else {
            for (let childNode of this.childNodes) {
                childNode.show();
            }
        }
    }

    defocus() {
        super.defocus();
        this.hideAddChildButton();
    }

    updatePosition(centerX, centerY, makeStatic) {
        super.updatePosition(centerX, centerY, makeStatic);
        this.nodeElements.addChildButton.setAttribute("cx", this.center.x);
        this.nodeElements.addChildButton.setAttribute("cy", this.center.y + Config.NODE_ADD_CHILD_BUTTON_CENTER_OFFSET_Y);
    }

    hideAddChildButton() {
        this.nodeElements.addChildButton.setAttribute("display", "none");
    }

    showAddChildButton() {
        this.nodeElements.addChildButton.removeAttribute("display");
    }
}

function onAddChildNodeClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new Event(Config.EVENT_ADD_CHILD_NODE, data);
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

export default RootNode;