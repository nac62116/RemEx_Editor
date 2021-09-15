import Config from "../../utils/Config.js";
import Observable from "../../utils/Observable.js";

class InputView extends Observable {

    init() {
        this.inputViewContainer = document.querySelector("#" + Config.INPUT_VIEW_CONTAINER_ID);
        this.inputFieldsContainer = document.querySelector("#" + Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.header = document.querySelector("#" + Config.INPUT_VIEW_HEADER_ID);
        this.deleteButton = document.querySelector("#" + Config.INPUT_VIEW_DELETE_BUTTON_ID);
        this.correspondingNode = undefined;
        this.inputEnabled = true;
        // TODO: Fullscreen Button
        this.hide();
    }

    show() {
        // Show the input view elements
        this.header.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.deleteButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        // The inputFields are recreated in the derived classes (ExperimentInputView, ...)
        for (let inputField of this.inputFieldsContainer.children) {
            inputField.remove();
        }
    }

    hide() {
        this.inputFieldsContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.header.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }

    selectFirstInput() {
        this.inputFieldsContainer.querySelector("input").select();
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

export default InputView;