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
        this.deleteButton.addEventListener("click", onRemoveNodeButtonClicked.bind(this));
        this.correspondingNode = undefined;
    }

    show(correspondingNode, correspondingModelObject, ongoingInstructions, questions) {
        let correspondingModelValues = {};

        this.correspondingNode = correspondingNode;
        this.header.innerHTML = correspondingNode.description;
        this.inputFieldsContainer.remove();
        this.inputFieldsContainer = document.createElement("div");
        this.inputFieldsContainer.setAttribute("id", Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.inputFieldsContainer.setAttribute("class", Config.INPUT_FIELD_CONTAINER_CSS_CLASS_NAME);
        this.inputViewContainer.firstElementChild.insertAdjacentElement("afterend", this.inputFieldsContainer);

        if (correspondingNode.parentNode !== undefined) {
            if (correspondingNode.parentNode.type === Config.TYPE_SURVEY) {
                createInputField(this, Config.INPUT_FIELD_STEP_TYPE_DATA.label, Config.INPUT_FIELD_STEP_TYPE_DATA.inputType, Config.INPUT_FIELD_STEP_TYPE_DATA.values, Config.TYPE_STEP, correspondingNode.type);
            }
            if (correspondingNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                createInputField(this, Config.INPUT_FIELD_QUESTION_TYPE_DATA.label, Config.INPUT_FIELD_QUESTION_TYPE_DATA.inputType, Config.INPUT_FIELD_QUESTION_TYPE_DATA.values, Config.TYPE_QUESTION, correspondingNode.type);
            }
        }
        
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
                        else if (modelPropertyKey === "waitForStep") {
                            if (ongoingInstructions.length !== 0) {
                                createInputField(this, inputFieldData.label, inputFieldData.inputType,
                                    ongoingInstructions, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey]);
                            }
                        }
                        else if (modelPropertyKey === "nextQuestionId") {
                            if (correspondingNode.type === Config.TYPE_ANSWER) {
                                if (questions.length !== 0) {
                                    createInputField(this, inputFieldData.label, inputFieldData.inputType,
                                        questions, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey]);
                                }
                            }
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
        let inputFields = this.inputFieldsContainer.querySelectorAll("input");

        for (let inputField of inputFields) {
            if (inputField.getAttribute("type") === "text") {
                inputField.select();
                return;
            }
        }
    }
}

function createInputField(that, label, type, values, modelProperty, currentModelValue) {
    let inputField,
    inputElement,
    labelElement;

    inputField = document.createElement("div");
    inputField.innerHTML = INPUT_FIELD_TEMPLATE_STRING;
    inputField = inputField.firstElementChild;
    inputField.firstElementChild.innerHTML = label;

    if (type === "radio" || type === "checkbox") {
        for (let value of values) {
            labelElement = document.createElement("label");
            labelElement.innerHTML = value.label;
            labelElement.classList.add("radio-label");
            inputElement = document.createElement("input");
            inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
            inputElement.setAttribute("type", type);
            inputElement.setAttribute("name", modelProperty);
            inputElement.setAttribute("value", value.value);
            if (currentModelValue !== null) {
                if (currentModelValue === value.value 
                    || currentModelValue instanceof Array 
                    && currentModelValue.includes(value.value)) {
                    inputElement.setAttribute("checked", "true");
                }
            }
            inputElement.addEventListener("click", onInputChanged.bind(that));
            
            labelElement.insertAdjacentElement("afterbegin", inputElement);
            inputField.appendChild(labelElement);
        }
    }
    else if (type === "image" || type === "video") {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", "file");
        inputElement.setAttribute("accept", type + "/*");
        inputElement.setAttribute("name", modelProperty);
        inputElement.value = currentModelValue;
        inputElement.addEventListener("click", onInputChanged.bind(that));
        inputField.appendChild(inputElement);
    }
    else if (type === "time") {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", type);
        inputElement.setAttribute("name", modelProperty);
        if (currentModelValue.absoluteStartAtHour < 10) { // eslint-disable-line no-magic-numbers
            currentModelValue.absoluteStartAtHour = "0" + currentModelValue.absoluteStartAtHour;
        }
        if (currentModelValue.absoluteStartAtMinute < 10) { // eslint-disable-line no-magic-numbers
            currentModelValue.absoluteStartAtMinute = "0" + currentModelValue.absoluteStartAtMinute;
        }
        inputElement.value = currentModelValue.absoluteStartAtHour + ":" + currentModelValue.absoluteStartAtMinute;
        inputElement.addEventListener("keyup", onInputChanged.bind(that));
        inputField.appendChild(inputElement);
    }
    else {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", type);
        inputElement.setAttribute("name", modelProperty);
        inputElement.value = currentModelValue;
        inputElement.addEventListener("keyup", onInputChanged.bind(that));
        inputField.appendChild(inputElement);
    }

    that.inputFieldsContainer.appendChild(inputField);
}

function onInputChanged(event) {
    let data,
    inputChangeEvent,
    properties = {},
    correspondingModelProperty = event.target.getAttribute("name"),
    checkboxElements,
    stepType,
    questionType,
    addNodeEvent,
    removeNodeEvent;

    if (correspondingModelProperty === "absoluteStartAtHour") {
        if (event.target.value !== "") {
            properties.absoluteStartAtHour = event.target.value.substr(0, 2) * 1; // eslint-disable-line no-magic-numbers
            properties.absoluteStartAtMinute = event.target.value.substr(3, 2) * 1; // eslint-disable-line no-magic-numbers
        }
        else {
            return;
        }
    }
    else if (correspondingModelProperty === "absoluteStartDaysOffset") {
        if (event.target.value !== "") {
            properties.absoluteStartDaysOffset = event.target.value - 1;
        }
        else {
            return;
        }
    }
    else if (correspondingModelProperty === Config.TYPE_STEP) {
        stepType = event.target.value;
    }
    else if (correspondingModelProperty === Config.TYPE_QUESTION) {
        questionType = event.target.value;
    }
    else if (event.target.type === "checkbox") {
        checkboxElements = event.target.parentElement.parentElement.querySelectorAll("input");
        properties[correspondingModelProperty] = [];
        for (let checkboxElement of checkboxElements) {
            if (checkboxElement.checked === true) {
                properties[correspondingModelProperty].push(checkboxElement.value);
            }
        }
    }
    else if (event.target.type === "number"
            || correspondingModelProperty === "waitForStep"
            || correspondingModelProperty === "nextQuestionId") {
        properties[correspondingModelProperty] = event.target.value * 1;
    }
    else {
        properties[correspondingModelProperty] = event.target.value;
    }

    data = {
        correspondingNode: this.correspondingNode,
        newModelProperties: properties,
    };
    if (correspondingModelProperty === Config.TYPE_STEP || correspondingModelProperty === Config.TYPE_QUESTION) {
        data.stepType = stepType;
        data.questionType = questionType;
        if (this.correspondingNode.previousNode !== undefined) {
            data.target = this.correspondingNode.previousNode;
            addNodeEvent = new Event(Config.EVENT_ADD_NEXT_NODE, data);
        }
        else if (this.correspondingNode.nextNode !== undefined) {
            data.target = this.correspondingNode.nextNode;
            addNodeEvent = new Event(Config.EVENT_ADD_PREV_NODE, data);
        }
        else {
            data.target = this.correspondingNode.parentNode;
            addNodeEvent = new Event(Config.EVENT_ADD_CHILD_NODE, data);
        }
        removeNodeEvent = new Event(Config.EVENT_REMOVE_NODE, data);
        this.notifyAll(removeNodeEvent);
        this.notifyAll(addNodeEvent);
    }
    else {
        inputChangeEvent = new Event(Config.EVENT_INPUT_CHANGED, data);
        this.notifyAll(inputChangeEvent);
    }
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