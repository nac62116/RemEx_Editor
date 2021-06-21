/* eslint-env broswer */

import Config from "../../utils/Config.js";
import InputView from "./InputView.js";
import {Event} from "../../utils/Observable.js"

class ExperimentGroupInputView extends InputView {

    init() {
        super.init();
        this.deleteButton.addEventListener("click", onDeleteButtonClicked.bind(this));
    }

    show(data) {
        super.show();
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

        this.header.innerHTML = data.experimentGroupName;
        inputField = super.createTextInput(Config.INPUT_EXPERIMENT_GROUP_NAME_LABEL, Config.INPUT_EXPERIMENT_GROUP_NAME_ID);
        inputElement = inputField.querySelector("#" + Config.INPUT_EXPERIMENT_GROUP_NAME_ID);
        inputElement.value = data.experimentGroupName;
        inputElement.addEventListener("keyup", onInput.bind(this));

        this.inputFieldsContainer.appendChild(inputField);
    }
}

function onInput(event) {
    let data = {},
    controllerEvent;
    
    data.node = this.correspondingNode;
    data.experimentGroupName = this.inputFieldsContainer.querySelector("#" + Config.INPUT_EXPERIMENT_GROUP_NAME_ID).value;
    this.header.innerHTML = data.experimentGroupName;

    controllerEvent = new Event(Config.EVENT_INPUT_CHANGED, data);
    this.notifyAll(controllerEvent);
}

function onDeleteButtonClicked() {
    let data, controllerEvent;

    data = {
        correspondingNode: this.correspondingNode
    };
    controllerEvent = new Event(Config.EVENT_REMOVE_NODE, data);
    this.notifyAll(controllerEvent);
}

export default new ExperimentGroupInputView();