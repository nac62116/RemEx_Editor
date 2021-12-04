import {Observable, Event as ControllerEvent} from "./Observable.js";
import Config from "./Config.js";

class ShortcutManager extends Observable {

    init() {
        document.addEventListener("keydown", onKeyDown.bind(this));
        document.addEventListener("keyup", onKeyUp.bind(this));
        this.currentPressedKeys = new Map();
        this.clipboardContent = undefined;
    }

    setClipboardContent(data) {
        this.clipboardContent = data;
    }

}

function onKeyDown(event) {
    let controllerEvent,
    data = {};

    this.currentPressedKeys.set(event.key, true);
    // Ctrl + c
    if (this.currentPressedKeys.get("Control")
        && this.currentPressedKeys.get("c")) {
            this.currentPressedKeys.delete("c");
            controllerEvent = new ControllerEvent(Config.EVENT_COPY_NODE, null);
            this.notifyAll(controllerEvent);
    }
    // ctrl + x (not ctrl + v for pasting as its reserved for the system clipboard)
    if (this.currentPressedKeys.get("Control")
        && this.currentPressedKeys.get(" ")) {
            this.currentPressedKeys.delete(" ");
            if (this.clipboardContent !== undefined) {
                data.clipboardContent = this.clipboardContent;
                controllerEvent = new ControllerEvent(Config.EVENT_PASTE_NODE, data);
                this.notifyAll(controllerEvent);
            }
    }
}

function onKeyUp(event) {
    this.currentPressedKeys.delete(event.key);
}

export default new ShortcutManager();