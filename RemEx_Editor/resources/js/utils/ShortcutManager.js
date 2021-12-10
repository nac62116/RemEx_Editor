import {Observable, Event as ControllerEvent} from "./Observable.js";
import Config from "./Config.js";

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
    // ctrl + whitespace (not ctrl + v for pasting as its reserved for the system clipboard)
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
    let data = {},
    controllerEvent;
    
    this.currentPressedKeys.delete(event.key);
    // Arrow keys for movement
    if (event.key === "ArrowLeft"
        || event.key === "ArrowRight"
        || event.key === "ArrowDown"
        || event.key === "ArrowUp") {
            data.key = event.key;
            controllerEvent = new ControllerEvent(Config.EVENT_KEY_NAVIGATION, data);
            this.notifyAll(controllerEvent);
    }
}

export default new ShortcutManager();