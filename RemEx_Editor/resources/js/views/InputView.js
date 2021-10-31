import Config from "../utils/Config.js";
import {Observable, Event as ControllerEvent} from "../utils/Observable.js";
import RootNode from "./nodeView/RootNode.js";

const INPUT_FIELD_TEMPLATE_STRING = document.querySelector("#" + Config.INPUT_FIELD_TEMPLATE_ID).innerHTML.trim();

class InputView extends Observable {

    init(inputViewContainer) {
        this.inputViewContainer = inputViewContainer;
        this.inputFieldsContainer = inputViewContainer.querySelector("#" + Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.header = inputViewContainer.querySelector("#" + Config.INPUT_VIEW_HEADER_ID);
        this.deleteButton = inputViewContainer.querySelector("#" + Config.INPUT_VIEW_DELETE_BUTTON_ID);
        this.deleteButton.addEventListener("click", onRemoveNodeButtonClicked.bind(this));
        this.alertElement = inputViewContainer.querySelector("#" + Config.INPUT_VIEW_ALERT_ID);
        this.loadingScreen = document.querySelector("#" + Config.LOADING_SCREEN_ID);
        this.correspondingNode = undefined;
        this.currentFileName = undefined;
    }

    show(correspondingNode, correspondingModelObject, ongoingInstructions, questions, encodedResource) {
        let correspondingModelValues = {};

        this.correspondingNode = correspondingNode;
        this.header.innerHTML = correspondingNode.description;
        this.inputFieldsContainer.remove();
        this.inputFieldsContainer = document.createElement("div");
        this.inputFieldsContainer.setAttribute("id", Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.inputFieldsContainer.setAttribute("class", Config.INPUT_FIELD_CONTAINER_CSS_CLASS_NAME);
        this.inputViewContainer.appendChild(this.inputFieldsContainer);

        if (correspondingNode.parentNode !== undefined) {
            if (correspondingNode.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
                createInputField(this, Config.INPUT_FIELD_SURVEY_FREQUENCY_DATA.label, Config.INPUT_FIELD_SURVEY_FREQUENCY_DATA.inputType, Config.INPUT_FIELD_SURVEY_FREQUENCY_DATA.values, Config.INPUT_SURVEY_FREQUENCY, correspondingNode.type, encodedResource, true);
            }
            if (correspondingNode.parentNode.type === Config.TYPE_SURVEY) {
                createInputField(this, Config.INPUT_FIELD_STEP_TYPE_DATA.label, Config.INPUT_FIELD_STEP_TYPE_DATA.inputType, Config.INPUT_FIELD_STEP_TYPE_DATA.values, Config.TYPE_STEP, correspondingNode.type, encodedResource, false);
            }
            if (correspondingNode.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                createInputField(this, Config.INPUT_FIELD_QUESTION_TYPE_DATA.label, Config.INPUT_FIELD_QUESTION_TYPE_DATA.inputType, Config.INPUT_FIELD_QUESTION_TYPE_DATA.values, Config.TYPE_QUESTION, correspondingNode.type, encodedResource, false);
            }
        }
        
        for (let inputFieldData of Config.INPUT_FIELD_DATA) {
            for (let modelPropertyKey in correspondingModelObject) {
                if (Object.prototype.hasOwnProperty.call(correspondingModelObject, modelPropertyKey)) {
                    if (modelPropertyKey === inputFieldData.correspondingModelProperty) {
                        if (modelPropertyKey === "absoluteStartAtHour") {
                            correspondingModelValues[modelPropertyKey] = correspondingModelObject[modelPropertyKey];
                            correspondingModelValues.absoluteStartAtMinute = correspondingModelObject.absoluteStartAtMinute;
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, correspondingModelValues, encodedResource, false);
                            break;
                        }
                        else if (modelPropertyKey === "absoluteStartDaysOffset") {
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey] + 1, encodedResource, false);
                            break;
                        }
                        else if (modelPropertyKey === "waitForStep") {
                            if (ongoingInstructions.length !== 0) {
                                createInputField(this, inputFieldData.label, inputFieldData.inputType,
                                    ongoingInstructions, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey], encodedResource, true);
                            }
                        }
                        else if (modelPropertyKey === "nextQuestionId") {
                            if (correspondingNode.type === Config.TYPE_ANSWER) {
                                if (questions.length !== 0) {
                                    createInputField(this, inputFieldData.label, inputFieldData.inputType, questions, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey], encodedResource, true);
                                }
                            }
                        }
                        else {
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, correspondingModelObject[modelPropertyKey], encodedResource, false);
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
        this.inputViewContainer.scrollTop = 0;
        for (let inputElement of this.inputFieldsContainer.querySelectorAll("input[type=file]")) {
            if (inputElement.name === "imageFileName") {
                if (this.inputFieldsContainer.querySelector("video") !== null) {
                    for (let child of inputElement.parentElement.children) {
                        child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                    }
                }
            }
            if (inputElement.name === "videoFileName") {
                if (this.inputFieldsContainer.querySelector("img") !== null) {
                    for (let child of inputElement.parentElement.children) {
                        child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                    }
                }
            }
        }
    }

    hide() {
        this.header.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.inputFieldsContainer.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
    }

    showAlert(alert) {
        this.inputViewContainer.scrollTop = 0;
        this.alertElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        this.alertElement.innerHTML = alert;
    }

    hideAlert() {
        this.alertElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        this.alertElement.innerHTML = "";
    }

    selectFirstInput() {
        let inputElements = this.inputFieldsContainer.querySelectorAll("input");

        for (let inputElement of inputElements) {
            if (inputElement.getAttribute("type") === "text") {
                inputElement.select();
                return;
            }
        }
    }

    disableInputsExcept(modelProperty) {
        let inputElements,
        imageElement = this.inputFieldsContainer.querySelector("img"),
        videoElement = this.inputFieldsContainer.querySelector("video");

        if (typeof(modelProperty) === "string") {
            inputElements = this.inputFieldsContainer.querySelectorAll("input:not([name=" + modelProperty + "]");
        }

        if (this.inputFieldsContainer.firstElementChild.firstElementChild.innerHTML === "Typ:") {
            this.inputFieldsContainer.firstElementChild.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
        for (let inputElement of inputElements) {
            inputElement.parentElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
        this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        if (imageElement !== null) {
            imageElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
        if (videoElement !== null) {
            videoElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
        if (modelProperty === "absoluteStartDaysOffset") {
            this.inputFieldsContainer.querySelector("input[name=absoluteStartAtHour]").parentElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            this.inputFieldsContainer.querySelector("input[name=maxDurationInMin]").parentElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            this.inputFieldsContainer.querySelector("input[name=notificationDurationInMin]").parentElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }

    enableInputs() {
        let inputElements = this.inputFieldsContainer.querySelectorAll("input"),
        imageElement = this.inputFieldsContainer.querySelector("img"),
        videoElement = this.inputFieldsContainer.querySelector("video");

        this.inputFieldsContainer.firstElementChild.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        for (let inputElement of inputElements) {
            inputElement.parentElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
        if (!(this.correspondingNode instanceof RootNode)) {
            this.deleteButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
        if (imageElement !== null) {
            imageElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
        if (videoElement !== null) {
            videoElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }

    clearFileInputs() {
        let imageElement = this.inputFieldsContainer.querySelector("img"),
        videoElement = this.inputFieldsContainer.querySelector("video"),
        inputElements = this.inputFieldsContainer.querySelectorAll("input[type=file]");

        this.currentFileName = null;
        
        for (let inputElement of inputElements) {
            inputElement.value = null;
            for (let child of inputElement.parentElement.children) {
                child.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            }
        }
        if (imageElement !== null) {
            imageElement.remove();
        }
        if (videoElement !== null) {
            videoElement.remove();
        }
    }
}

function createInputField(that, label, type, values, modelProperty, currentModelValue, encodedResource, addNoSelection) {
    let inputField,
    inputElement,
    clearInputButton,
    labelElement,
    imageElement,
    videoElement,
    sourceElement,
    fileType;

    inputField = document.createElement("div");
    inputField.innerHTML = INPUT_FIELD_TEMPLATE_STRING;
    inputField = inputField.firstElementChild;
    inputField.firstElementChild.innerHTML = label;

    if (type === "radio" || type === "checkbox") {
        if (addNoSelection) {
            labelElement = document.createElement("label");
            inputElement = document.createElement("input");
            if (modelProperty === "nextQuestionId") {
                labelElement.innerHTML = "Fragebogen beenden";
                inputElement.setAttribute("value", null);
            }
            else {
                labelElement.innerHTML = "Keine Auswahl";
                inputElement.setAttribute("value", 0);
            }
            labelElement.classList.add("radio-label");
            inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
            inputElement.setAttribute("type", type);
            inputElement.setAttribute("name", modelProperty);
            if (currentModelValue === 0 || currentModelValue === null) {
                inputElement.setAttribute("checked", "true");
            }
            inputElement.addEventListener("click", onInputChanged.bind(that));
            
            labelElement.insertAdjacentElement("afterbegin", inputElement);
            inputField.appendChild(labelElement);
        }
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
    else if (type === "button") {
        labelElement = document.createElement("label");
        labelElement.classList.add("radio-label");
        for (let value of values) {
            inputElement = document.createElement("input");
            inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
            inputElement.setAttribute("type", type);
            inputElement.setAttribute("name", modelProperty);
            inputElement.setAttribute("value", value.value);

            inputElement.addEventListener("click", onInputChanged.bind(that));
            
            labelElement.insertAdjacentElement("beforeend", inputElement);
        }
        inputField.appendChild(labelElement);
    }
    else if (type === "image" || type === "video") {
        clearInputButton = document.createElement("button");
        clearInputButton.classList.add("clear-input-button");
        clearInputButton.innerHTML = "X";
        clearInputButton.addEventListener("click", onClearFileInputs.bind(that));
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", "file");
        inputElement.setAttribute("accept", type + "/*");
        inputElement.setAttribute("name", modelProperty);
        inputElement.addEventListener("change", onInputChanged.bind(that));
        inputField.appendChild(inputElement);
        inputField.appendChild(clearInputButton);
        if (currentModelValue !== null) {
            if (modelProperty === "imageFileName") {
                imageElement = document.createElement("img");
                imageElement.setAttribute("width", "auto");
                imageElement.setAttribute("height", that.inputViewContainer.clientHeight);
                imageElement.setAttribute("src", encodedResource.base64String);
            }
            else {
                fileType = encodedResource.fileName.split(".")[1];
                videoElement = document.createElement("video");
                videoElement.setAttribute("width", "auto");
                videoElement.setAttribute("height", that.inputViewContainer.clientHeight);
                videoElement.setAttribute("controls", "");
                sourceElement = document.createElement("source");
                sourceElement.setAttribute("type", "video/" + fileType);
                sourceElement.setAttribute("src", encodedResource.base64String);
                videoElement.appendChild(sourceElement);
            }
            inputElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
            that.currentFileName = encodedResource.fileName;
        }
    }
    else if (type === "time") {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", type);
        inputElement.setAttribute("name", modelProperty);
        inputElement.setAttribute("required", "required");
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
    else if (type === "number") {
        inputElement = document.createElement("input");
        inputElement.setAttribute("id", inputField.firstElementChild.getAttribute("for"));
        inputElement.setAttribute("type", type);
        inputElement.setAttribute("name", modelProperty);
        inputElement.value = currentModelValue;
        
        inputElement.addEventListener("keyup", onInputChanged.bind(that));
        inputElement.addEventListener("wheel", function (event) {
            event.preventDefault();
        });
        inputElement.addEventListener("keydown", function (event) {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
            }
        });
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

    inputField.firstElementChild.addEventListener("click", function(event) {
        event.preventDefault();
    });
    that.inputFieldsContainer.appendChild(inputField);
    if (imageElement !== undefined) {
        that.inputFieldsContainer.appendChild(imageElement);
    }
    if (videoElement !== undefined) {
        that.inputFieldsContainer.appendChild(videoElement);
    }
}

function onInputChanged(event) {
    let data = {
        correspondingNode: this.correspondingNode,
        newModelProperties: undefined,
        base64String: undefined,
    },
    inputChangeEvent,
    properties = {},
    correspondingModelProperty = event.target.getAttribute("name"),
    checkboxElements,
    inputElements,
    changeNodeEvent,
    removeNodeEvent,
    imageInputElement,
    videoInputElement,
    sourceElement;

    if (event.target.value !== "") {
        if (event.target.type === "text") {
            event.target.value = escapeHtml(event.target.value);
        }
    
        if (correspondingModelProperty === "absoluteStartAtHour") {
            properties.absoluteStartAtHour = event.target.value.substr(0, 2) * 1; // eslint-disable-line no-magic-numbers
            properties.absoluteStartAtMinute = event.target.value.substr(3, 2) * 1; // eslint-disable-line no-magic-numbers
        }
        else if (correspondingModelProperty === "absoluteStartDaysOffset") {
            if (event.target.value !== "") {
                event.target.value = escapeNegativeValues(event.target.value);
                event.target.value = escapeZeroValues(event.target.value);
                if ((event.target.value.length >= Config.SURVEY_UPPER_DAY_LIMIT_MAX_DIGITS)) {
                    event.target.value = event.target.value.substring(0, Config.SURVEY_UPPER_DAY_LIMIT_MAX_DIGITS - 1);
                }
                properties.absoluteStartDaysOffset = event.target.value - 1;
            }
            else {
                return;
            }
        }
        else if (correspondingModelProperty === "imageFileName") {
            this.loadingScreen.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            inputElements = this.inputFieldsContainer.querySelectorAll("input");
            for (let inputElement of inputElements) {
                if (inputElement.name === "videoFileName") {
                    inputElement.parentElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                    break;
                }
            }
            properties.imageFileName = event.target.files[0].name;
            this.currentFileName = event.target.files[0].name;
            data.base64String = getBase64String(event.target.files[0]);
        }
        else if (correspondingModelProperty === "videoFileName") {
            this.loadingScreen.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            inputElements = this.inputFieldsContainer.querySelectorAll("input");
            for (let inputElement of inputElements) {
                if (inputElement.name === "imageFileName") {
                    inputElement.parentElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                    break;
                }
            }
            properties.videoFileName = event.target.files[0].name;
            this.currentFileName = event.target.files[0].name;
            data.base64String = getBase64String(event.target.files[0]);
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
            if (event.target.type === "number") {
                event.target.value = escapeNegativeValues(event.target.value);
                if (!(correspondingModelProperty === "durationInMin" && this.correspondingNode.type === Config.STEP_TYPE_INSTRUCTION)) {
                    event.target.value = escapeZeroValues(event.target.value);
                }
            }
            properties[correspondingModelProperty] = event.target.value * 1;
        }
        else {
            properties[correspondingModelProperty] = event.target.value;
        }
        data.newModelProperties = properties;
    
        if (correspondingModelProperty === Config.TYPE_STEP || correspondingModelProperty === Config.TYPE_QUESTION) {
            if (correspondingModelProperty === Config.TYPE_STEP) {
                data.stepType = event.target.value;
            }
            else {
                data.questionType = event.target.value;
            }
            data.target = this.correspondingNode;
            changeNodeEvent = new ControllerEvent(Config.EVENT_CHANGE_NODE, data);
            this.notifyAll(changeNodeEvent);
        }
        else {
            if (data.base64String !== undefined) {
                data.base64String.then(function(result) {
                    if (properties.imageFileName !== undefined) {
                        imageInputElement = this.inputFieldsContainer.querySelector("img");
                        videoInputElement = this.inputFieldsContainer.querySelector("input[name=videoFileName]");
                        if (imageInputElement === null) {
                            imageInputElement = document.createElement("img");
                            imageInputElement.setAttribute("width", "auto");
                            imageInputElement.setAttribute("height", this.inputViewContainer.clientHeight);
                            imageInputElement.setAttribute("src", result);
                            event.target.parentElement.insertAdjacentElement("afterend", imageInputElement);
                        }
                        else {
                            imageInputElement.setAttribute("src", result);
                        }
                        if (videoInputElement !== null) {
                            for (let child of videoInputElement.parentElement.children) {
                                child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                            }
                        }
                    }
                    else {
                        sourceElement = this.inputFieldsContainer.querySelector("source");
                        imageInputElement = this.inputFieldsContainer.querySelector("input[name=imageFileName]");
                        if (sourceElement === null) {
                            videoInputElement = document.createElement("video");
                            videoInputElement.setAttribute("width", "auto");
                            videoInputElement.setAttribute("height", this.inputViewContainer.clientHeight);
                            videoInputElement.setAttribute("controls", "");
                            sourceElement = document.createElement("source");
                            sourceElement.setAttribute("type", event.target.files[0].type);
                            sourceElement.setAttribute("src", result);
                            videoInputElement.appendChild(sourceElement);
                            event.target.parentElement.insertAdjacentElement("afterend", videoInputElement);
                        }
                        else {
                            sourceElement.setAttribute("src", result);
                        }
                        if (imageInputElement !== null) {
                            for (let child of imageInputElement.parentElement.children) {
                                child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                            }
                        }
                    }
                    event.target.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                    data.base64String = result;
                    inputChangeEvent = new ControllerEvent(Config.EVENT_INPUT_CHANGED, data);
                    this.notifyAll(inputChangeEvent);
                }.bind(this));
            }
            else {
                inputChangeEvent = new ControllerEvent(Config.EVENT_INPUT_CHANGED, data);
                this.notifyAll(inputChangeEvent);
            }
        }
    }
    else {
        return;
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "")
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/"/g, "\"");
}

function escapeNegativeValues(unescaped) {
    return unescaped.replace(/[-]/g, "");
}

function escapeZeroValues(unescaped) {
    return unescaped.replace(/\b0/g, "1");
}

function getBase64String(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
 }

function onRemoveNodeButtonClicked() {
    let data,
    controllerEvent;

    data = {
        correspondingNode: this.correspondingNode,
    };
    controllerEvent = new ControllerEvent(Config.EVENT_REMOVE_NODE, data);
    this.notifyAll(controllerEvent);
}

function onClearFileInputs(event) {
    let data = {
        correspondingNode: this.correspondingNode,
        newModelProperties: {},
        previousFileName: this.currentFileName,
    },
    correspondingInputElement = event.target.parentElement.querySelector("input"),
    inputElements = this.inputFieldsContainer.querySelectorAll("input[type=file]"),
    imageElement = this.inputFieldsContainer.querySelector("img"),
    videoElement = this.inputFieldsContainer.querySelector("video"),
    inputChangeEvent;
    
    this.currentFileName = null;
    correspondingInputElement.value = null;
    data.newModelProperties[correspondingInputElement.getAttribute("name")] = null;

    for (let inputElement of inputElements) {
        for (let child of inputElement.parentElement.children) {
            child.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }
    if (imageElement !== null) {
        imageElement.remove();
    }
    if (videoElement !== null) {
        videoElement.remove();
    }

    inputChangeEvent = new ControllerEvent(Config.EVENT_INPUT_CHANGED, data);
    this.notifyAll(inputChangeEvent);
}

export default new InputView();