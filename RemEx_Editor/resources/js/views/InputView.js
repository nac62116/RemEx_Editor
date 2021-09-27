import Config from "../utils/Config.js";
import {Observable, Event} from "../utils/Observable.js";
import RootNode from "./nodeView/RootNode.js";

const INPUT_FIELD_TEMPLATE_STRING = document.querySelector("#" + Config.INPUT_FIELD_TEMPLATE_ID).innerHTML.trim();

class InputView extends Observable {

    init(inputViewContainer) {
        this.inputViewContainer = inputViewContainer;
        this.inputFieldsContainer = inputViewContainer.querySelector("#" + Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.header = inputViewContainer.querySelector("#" + Config.INPUT_VIEW_HEADER_ID);
        this.deleteButton = inputViewContainer.querySelector("#" + Config.INPUT_VIEW_DELETE_BUTTON_ID);
        this.deleteButton.addEventListener(Config.EVENT_REMOVE_NODE, onRemoveNodeButtonClicked.bind(this));
        this.correspondingNode = undefined;
    }

    show(correspondingNode, correspondingModelObject) {
        let correspondingModelValues = {};

        this.correspondingNode = correspondingNode;
        this.header.innerHTML = correspondingNode.description;
        this.inputFieldsContainer.remove();
        this.inputFieldsContainer = document.createElement("div");
        this.inputFieldsContainer.setAttribute("id", Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.inputFieldsContainer.setAttribute("class", Config.INPUT_FIELD_CONTAINER_CSS_CLASS_NAME);
        this.inputViewContainer.firstElementChild.insertAdjacentElement("afterend", this.inputFieldsContainer);
        
        for (let inputFieldData of Config.INPUT_FIELD_DATA) {
            for (let modelPropertyKey in correspondingModelObject) {
                if (Object.prototype.hasOwnProperty.call(correspondingModelObject, modelPropertyKey)) {
                    if (modelPropertyKey === inputFieldData.correspondingModelProperty) {
                        if (modelPropertyKey === "absoluteStartAtHour") {
                            correspondingModelValues[modelPropertyKey] = correspondingModelObject[modelPropertyKey];
                            correspondingModelValues.absoluteStartAtMinute = correspondingModelObject.absoluteStartAtMinute;
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, correspondingModelValues);
                            break;
                        }
                        else if (modelPropertyKey === "absoluteStartDaysOffset") {
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey] + 1);
                            break;
                        }
                        else {
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey]);
                            break;
                        }
                    }
                }
            }
        }
        // Show the input view elements
        this.header.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        if (!(this.correspondingNode instanceof RootNode)) {
            this.deleteButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
        else {
            this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }

    hide() {
        this.header.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }

    selectFirstInput() {
        this.inputFieldsContainer.querySelector("input").select();
    }
}

function createInputField(that, label, type, values, modelProperty, modelValue) {
    let inputField, inputElement;

    inputField = document.createElement("div");
    inputField.innerHTML = INPUT_FIELD_TEMPLATE_STRING;
    inputField = inputField.firstElementChild;
    inputField.firstElementChild.innerHTML = label;

    if (type === "radio" || type === "checkbox") {
        for (let value of values) {
            inputElement = document.createElement("input");
            inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
            inputElement.setAttribute("value", value);
            inputElement.setAttribute("type", type);
            inputElement.setAttribute("name", modelProperty);
            inputElement.value = modelValue;
            inputElement.addEventListener("click", onInputChanged.bind(that));
            inputField.appendChild(inputElement);
        }
    }
    else if (type === "image" || type === "video") {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", "file");
        inputElement.setAttribute("accept", type + "/*");
        inputElement.setAttribute("name", modelProperty);
        inputElement.value = modelValue;
        inputElement.addEventListener("click", onInputChanged.bind(that));
        inputField.appendChild(inputElement);
    }
    else if (type === "time") {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", type);
        inputElement.setAttribute("name", modelProperty);
        inputElement.value = modelValue.absoluteStartAtHour + ":" + modelValue.absoluteStartAtMinute;
        inputElement.addEventListener("keyup", onInputChanged.bind(that));
        inputField.appendChild(inputElement);
    }
    else {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", type);
        inputElement.setAttribute("name", modelProperty);
        inputElement.value = modelValue;
        inputElement.addEventListener("keyup", onInputChanged.bind(that));
        inputField.appendChild(inputElement);
    }

    that.inputFieldsContainer.appendChild(inputField);
}

function onInputChanged(event) {
    let data,
    controllerEvent,
    properties = {
        id: this.correspondingNode.id,
    },
    correspondingModelProperty = event.target.getAttribute("name");

    if (correspondingModelProperty === "absoluteStartAtHour") {
        if (event.target.value !== "") {
            properties.absoluteStartAtHour = event.target.value.substr(0, 2);
            properties.absoluteStartAtMinute = event.target.value.substr(3, 2);
        }
        else {
            return;
        }
    }
    else if (correspondingModelProperty === "absoluteStartDaysOffset") {
        properties.absoluteStartDaysOffset = event.target.value - 1;
    }
    else {
        properties[correspondingModelProperty] = event.target.value;
    }

    data = {
        correspondingNode: this.correspondingNode,
        newModelProperties: properties,
    };
    controllerEvent = new Event(Config.EVENT_INPUT_CHANGED, data);
    this.notifyAll(controllerEvent);
}

function onRemoveNodeButtonClicked() {
    let data,
    controllerEvent;

    data = {
        correspondingNode: this.correspondingNode,
    };
    controllerEvent = new Event(Config.EVENT_REMOVE_NODE, data);
    this.notifyAll(controllerEvent);
}

export default new InputView();