/* eslint-env broswer */

import Config from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";

class InputView extends Observable {

    init(element) {
        this.inputViewContainer = element;
        this.inputFieldsContainer = element.querySelector("#" + Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.header = element.querySelector("#" + Config.INPUT_VIEW_HEADER_ID);
        this.editButton = element.querySelector("#" + Config.INPUT_VIEW_EDIT_BUTTON_ID);
        this.saveButton = element.querySelector("#" + Config.INPUT_VIEW_SAVE_BUTTON_ID);
        this.saveButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.hide();
    }

    show(type, data) {
        // Create and fill input fields
        if (type === Config.NODE_TYPE_NEW_EXPERIMENT) {
            createNewExperimentInputFields(this);
        }
        // Show the input view elements
        this.header.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        if (type === Config.NODE_TYPE_NEW_EXPERIMENT ||
            type === Config.NODE_TYPE_NEW_STEP ||
            type === Config.NODE_TYPE_NEW_QUESTION) {
            this.saveButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
        else {
            this.editButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }

    hide() {
        this.inputFieldsContainer.innerHTML = "";
        this.header.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.editButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.saveButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }
}

function createNewExperimentInputFields(that) {
    let inputElement;

    that.header.innerHTML = Config.NODE_TYPE_NEW_EXPERIMENT_DESCRIPTION;
    inputElement = createTextInput(Config.INPUT_EXPERIMENT_NAME_LABEL, Config.INPUT_EXPERIMENT_NAME_ID);
    that.inputFieldsContainer.appendChild(inputElement);
}

function createTextInput(label, id) {
    let inputContainer, labelElement, inputElement;

    inputContainer = document.createElement("div");
    inputContainer.classList.add(Config.INPUT_FIELD_CSS_CLASS_NAME);
    labelElement = document.createElement("label");
    labelElement.setAttribute("for", id);
    labelElement.innerHTML = label;
    inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("id", id);
    inputElement.setAttribute("name", id);

    inputContainer.appendChild(labelElement);
    inputContainer.appendChild(inputElement);

    return inputContainer;
}

export default new InputView();