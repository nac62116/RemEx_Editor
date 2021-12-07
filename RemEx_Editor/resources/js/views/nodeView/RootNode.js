import NodeView from "./NodeView.js";
import {Event as ControllerEvent} from "../../utils/Observable.js";
import Config from "../../utils/Config.js";

class RootNode extends NodeView {

    constructor(nodeElements, id, type, description) {
        super(nodeElements, id, type, description);
        
        this.nodeElements.addChildButton.addEventListener("click", onAddChildNodeClicked.bind(this));
        this.nodeElements.addChildButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
        this.nodeElements.addChildButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        this.nodeElements.addChildIcon.addEventListener("click", onAddChildNodeClicked.bind(this));
        this.nodeElements.addChildIcon.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
        this.nodeElements.addChildIcon.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        // This property is only defined when the add buttons are triggered programmatically
        // and we want to add already defined data (e.g. onPasteNode)
        this.nodeData = undefined;
    }

    focus() {
        super.focus();
        if (this.childNodes.length === 0) {
            this.showAddChildButton();
        }
        else {
            this.hideAddChildButton();
        }
    }

    defocus() {
        super.defocus();
        this.hideAddChildButton();
    }

    updatePosition(centerX, centerY) {
        super.updatePosition(centerX, centerY);
        this.nodeElements.addChildButton.setAttribute("cx", this.center.x);
        this.nodeElements.addChildButton.setAttribute("cy", this.center.y + Config.NODE_ADD_CHILD_BUTTON_CENTER_OFFSET_Y);
        this.nodeElements.addChildIcon.setAttribute("x", this.center.x - Config.NODE_ADD_ICON_WIDTH * 1 / 2); // eslint-disable-line no-magic-numbers
        this.nodeElements.addChildIcon.setAttribute("y", this.center.y + Config.NODE_ADD_CHILD_BUTTON_CENTER_OFFSET_Y - Config.NODE_ADD_ICON_HEIGHT * 1 / 2); // eslint-disable-line no-magic-numbers
    }

    clickAddChildButton(nodeData) {
        let event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        this.nodeData = nodeData;
        this.nodeElements.addChildButton.dispatchEvent(event);
    }

    hideAddChildButton() {
        this.nodeElements.addChildButton.setAttribute("display", "none");
        this.nodeElements.addChildIcon.setAttribute("display", "none");
    }

    showAddChildButton() {
        this.nodeElements.addChildButton.removeAttribute("display");
        this.nodeElements.addChildIcon.removeAttribute("display");
    }
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

function onAddButtonMouseEnter() {
    if (this.isClickable) {
        this.nodeElements.addChildButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
        this.nodeElements.addChildButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
        this.nodeElements.addChildIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_EMPHASIZED);
    }
}

function onAddButtonMouseLeave() {
    if (this.isClickable) {
        this.nodeElements.addChildButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
        this.nodeElements.addChildButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
        this.nodeElements.addChildIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
    }
}

export default RootNode;