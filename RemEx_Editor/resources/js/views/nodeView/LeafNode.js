import NodeView from "./NodeView.js";
import Config from "../../utils/Config.js";

class LeafNode extends NodeView {

    constructor(nodeElements, id, properties) {
        super(nodeElements, id, properties);
        
        this.nodeElements.addNextButton.addEventListener("click", onAddNextNodeClicked.bind(this));
        this.nodeElements.addNextButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
        this.nodeElements.addNextButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
        this.nodeElements.addPreviousButton.addEventListener("click", onAddPreviousNodeClicked.bind(this));
        this.nodeElements.addPreviousButton.addEventListener("mouseenter", onAddButtonMouseEnter.bind(this));
        this.nodeElements.addPreviousButton.addEventListener("mouseleave", onAddButtonMouseLeave.bind(this));
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

        this.nodeElements.addNextButton.removeAttribute("display");
        this.nodeElements.addPrevButton.removeAttribute("display");
    }

    defocus() {
        super.defocus();

        this.nodeElements.addNextButton.setAttribute("display", "none");
        this.nodeElements.addPrevButton.setAttribute("display", "none");
    }

    emphasize() {
        super.emphasize();

        this.nodeElements.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED);
    }

    deemphasize() {
        super.deemphasize();

        if (!this.isFocused) {
            this.nodeElements.inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
        }
    }

    updatePosition(centerX, centerY, makeStatic) {
        let parentOutputPoint = this.parentNode.bottom,
        bezierReferencePoint = {
            x: parentOutputPoint.x,
            y: (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 4)), // eslint-disable-line no-magic-numbers
        };

        super.updatePosition(centerX, centerY, makeStatic);
        this.nodeElements.inputPath.setAttribute("d", "M " + parentOutputPoint.x + " " + parentOutputPoint.y + " Q " + bezierReferencePoint.x + " " + bezierReferencePoint.y + ", " + (parentOutputPoint.x + ((this.top.x - parentOutputPoint.x) / 2)) + " " + (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + this.top.y); // eslint-disable-line no-magic-numbers
        this.nodeElements.addNextButton.setAttribute("cx", this.center.x + Config.NODE_ADD_BUTTON_DISTANCE);
        this.nodeElements.addNextButton.setAttribute("cy", this.center.y);
        this.nodeElements.addPrevButton.setAttribute("cx", this.center.x - Config.NODE_ADD_BUTTON_DISTANCE);
        this.nodeElements.addPrevButton.setAttribute("cy", this.center.y);
    }
}

function onAddNextNodeClicked() {
    let controllerEvent, data;

    data = {
        target: this,
    };
    controllerEvent = new Event(Config.EVENT_ADD_NEXT_NODE, data);
    this.notifyAll(controllerEvent);
}

function onAddPreviousNodeClicked() {
    let controllerEvent, data;

    data = {
        target: this,
    };
    controllerEvent = new Event(Config.EVENT_ADD_PREV_NODE, data);
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

export default new LeafNode();