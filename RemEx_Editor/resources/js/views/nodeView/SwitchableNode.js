import Config from "../../utils/Config.js";
import StandardNode from "./StandardNode.js";
import {Event} from "../../utils/Observable.js";

/*
MIT License

Copyright (c) 2021 Colin Nash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

class SwitchableNode extends StandardNode {

    constructor(nodeElements, id, type, description) {
        super(nodeElements, id, type, description);
        this.nodeElements.switchRightButton.addEventListener("click", onMoveRightButtonClicked.bind(this));
        this.nodeElements.switchRightButton.addEventListener("mouseenter", onMoveButtonMouseEnter.bind(this));
        this.nodeElements.switchRightButton.addEventListener("mouseleave", onMoveButtonMouseLeave.bind(this));
        this.nodeElements.switchRightIcon.addEventListener("click", onMoveRightButtonClicked.bind(this));
        this.nodeElements.switchRightIcon.addEventListener("mouseenter", onMoveButtonMouseEnter.bind(this));
        this.nodeElements.switchRightIcon.addEventListener("mouseleave", onMoveButtonMouseLeave.bind(this));
        this.nodeElements.switchLeftButton.addEventListener("click", onMoveLeftButtonClicked.bind(this));
        this.nodeElements.switchLeftButton.addEventListener("mouseenter", onMoveButtonMouseEnter.bind(this));
        this.nodeElements.switchLeftButton.addEventListener("mouseleave", onMoveButtonMouseLeave.bind(this));
        this.nodeElements.switchLeftIcon.addEventListener("click", onMoveLeftButtonClicked.bind(this));
        this.nodeElements.switchLeftIcon.addEventListener("mouseenter", onMoveButtonMouseEnter.bind(this));
        this.nodeElements.switchLeftIcon.addEventListener("mouseleave", onMoveButtonMouseLeave.bind(this));
    }

    showMoveLeftButton() {
        this.nodeElements.switchLeftButton.removeAttribute("display");
        this.nodeElements.switchLeftIcon.removeAttribute("display");
    }

    hideMoveLeftButton() {
        this.nodeElements.switchLeftButton.setAttribute("display", "none");
        this.nodeElements.switchLeftIcon.setAttribute("display", "none");
    }

    showMoveRightButton() {
        this.nodeElements.switchRightButton.removeAttribute("display");
        this.nodeElements.switchRightIcon.removeAttribute("display");
    }

    hideMoveRightButton() {
        this.nodeElements.switchRightButton.setAttribute("display", "none");
        this.nodeElements.switchRightIcon.setAttribute("display", "none");
    }

    focus() {
        super.focus();
        if (this.nextNode !== undefined) {
            this.nodeElements.switchRightButton.removeAttribute("display");
            this.nodeElements.switchRightIcon.removeAttribute("display");
        }
        if (this.previousNode !== undefined) {
            this.nodeElements.switchLeftButton.removeAttribute("display");
            this.nodeElements.switchLeftIcon.removeAttribute("display");
        }
    }

    defocus() {
        super.defocus();
        this.nodeElements.switchRightButton.setAttribute("display", "none");
        this.nodeElements.switchRightIcon.setAttribute("display", "none");
        this.nodeElements.switchLeftButton.setAttribute("display", "none");
        this.nodeElements.switchLeftIcon.setAttribute("display", "none");
    }

    updatePosition(centerX, centerY) {
        super.updatePosition(centerX, centerY);

        this.nodeElements.switchRightButton.setAttribute("cx", this.center.x + Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_X);
        this.nodeElements.switchRightButton.setAttribute("cy", this.center.y - Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_Y);
        this.nodeElements.switchRightIcon.setAttribute("x", this.center.x + Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_X - Config.NODE_SWITCH_ICON_WIDTH * 1 / 2); // eslint-disable-line no-magic-numbers
        this.nodeElements.switchRightIcon.setAttribute("y", this.center.y - Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_Y - Config.NODE_SWITCH_ICON_HEIGHT * 1 / 2); // eslint-disable-line no-magic-numbers

        this.nodeElements.switchLeftButton.setAttribute("cx", this.center.x - Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_X);
        this.nodeElements.switchLeftButton.setAttribute("cy", this.center.y - Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_Y);
        this.nodeElements.switchLeftIcon.setAttribute("x", this.center.x - Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_X - Config.NODE_SWITCH_ICON_WIDTH * 1 / 2); // eslint-disable-line no-magic-numbers
        this.nodeElements.switchLeftIcon.setAttribute("y", this.center.y - Config.NODE_SWITCH_BUTTON_CENTER_OFFSET_Y - Config.NODE_SWITCH_ICON_HEIGHT * 1 / 2); // eslint-disable-line no-magic-numbers
        
    }
}

function onMoveRightButtonClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new Event(Config.EVENT_SWITCH_NODE_RIGHT, data);
        this.notifyAll(controllerEvent);
    }
}

function onMoveLeftButtonClicked() {
    let controllerEvent, data;

    if (this.isClickable) {
        data = {
            target: this,
        };
        controllerEvent = new Event(Config.EVENT_SWITCH_NODE_LEFT, data);
        this.notifyAll(controllerEvent);
    }
}

function onMoveButtonMouseEnter(event) {
    if (this.isClickable) {
        if (event.target === this.nodeElements.switchLeftButton
            || event.target === this.nodeElements.switchLeftIcon) {
                this.nodeElements.switchLeftButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
                this.nodeElements.switchLeftButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
                this.nodeElements.switchLeftIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_EMPHASIZED);
        }
        else {
                this.nodeElements.switchRightButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED);
                this.nodeElements.switchRightButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED);
                this.nodeElements.switchRightIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_EMPHASIZED);
        }
    }
}

function onMoveButtonMouseLeave(event) {
    if (this.isClickable) {
        if (event.target === this.nodeElements.switchLeftButton
            || event.target === this.nodeElements.switchLeftIcon) {
                this.nodeElements.switchLeftButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
                this.nodeElements.switchLeftButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
                this.nodeElements.switchLeftIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
        }
        else {
                this.nodeElements.switchRightButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
                this.nodeElements.switchRightButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
                this.nodeElements.switchRightIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
        }
    }
}

export default SwitchableNode;