/* eslint-env broswer */

import Config from "../../utils/Config.js";
import InputView from "./InputView.js";
import {Event} from "../../utils/Observable.js"

class ExperimentInputView extends InputView {

    show(data) {
        super.show();
        // The root node cannot be deleted
        this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.removeInputFields();
        this.createInputFields(data);
    }

    removeInputFields() {
        for (let child of this.inputFieldsContainer.children) {
            child.remove();
        }
    }

    createInputFields(data) {
        let inputField, inputElement;

        this.header.innerHTML = data.experimentName;
        inputField = super.createTextInput(Config.INPUT_EXPERIMENT_NAME_LABEL, Config.INPUT_EXPERIMENT_NAME_ID);
        inputElement = inputField.querySelector("#" + Config.INPUT_EXPERIMENT_NAME_ID);
        inputElement.value = data.experimentName;
        inputElement.addEventListener("keyup", onInput.bind(this));

        this.inputFieldsContainer.appendChild(inputField);
    }
}

function onInput(event) {
    let data = {},
    controllerEvent;
    
    data.node = this.correspondingNode;
    data.experimentName = this.inputFieldsContainer.querySelector("#" + Config.INPUT_EXPERIMENT_NAME_ID).value;
    this.header.innerHTML = data.experimentName;

    controllerEvent = new Event(Config.EVENT_INPUT_CHANGED, data);
    this.notifyAll(controllerEvent);
}

export default new ExperimentInputView();