/* eslint-env broswer */

import Config from "../../utils/Config.js";
import Observable from "../../utils/Observable.js";

class InputView extends Observable {

    init() {
        this.inputViewContainer = document.querySelector("#" + Config.INPUT_VIEW_CONTAINER_ID);
        this.inputFieldsContainer = document.querySelector("#" + Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.header = document.querySelector("#" + Config.INPUT_VIEW_HEADER_ID);
        this.deleteButton = document.querySelector("#" + Config.INPUT_VIEW_DELETE_BUTTON_ID);
        this.saveButton = document.querySelector("#" + Config.INPUT_VIEW_SAVE_BUTTON_ID);
        this.saveButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.saveButton.addEventListener("click", onSaveButtonClicked.bind(this));
        // TODO: Fullscreen Button
        this.hide();
    }

    show() {
        // Show the input view elements
        this.header.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.saveButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.deleteButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }

    hide() {
        this.inputFieldsContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.header.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.saveButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }

    createTextInput(label, id) {
        let inputField, labelElement, inputElement;
    
        inputField = document.createElement("div");
        inputField.classList.add(Config.INPUT_FIELD_CSS_CLASS_NAME);
        labelElement = document.createElement("label");
        labelElement.setAttribute("for", id);
        labelElement.innerHTML = label;
        inputElement = document.createElement("input");
        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("id", id);
        inputElement.setAttribute("name", id);
    
        inputField.appendChild(labelElement);
        inputField.appendChild(inputElement);
    
        return inputField;
    }
}

function onSaveButtonClicked(event) {
    console.log("click");
    let inputField = this.inputFieldsContainer.querySelector("#" + Config.INPUT_EXPERIMENT_NAME_ID);
    console.log(inputField.value);
}

export default InputView;