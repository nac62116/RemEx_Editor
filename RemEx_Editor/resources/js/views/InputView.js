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
        this.correspondingNode = undefined;
        this.currentFileName = null;
    }

    show(node, dataModel, parentDataModel, ongoingInstructions, questions) {
        let correspondingModelValues = {};

        this.correspondingNode = node;
        this.header.innerHTML = node.description;
        this.inputFieldsContainer.remove();
        this.inputFieldsContainer = document.createElement("div");
        this.inputFieldsContainer.setAttribute("id", Config.INPUT_VIEW_FIELDS_CONTAINER_ID);
        this.inputFieldsContainer.setAttribute("class", Config.INPUT_FIELD_CONTAINER_CSS_CLASS_NAME);
        this.inputViewContainer.appendChild(this.inputFieldsContainer);

        if (node.parentNode !== undefined) {
            if (node.parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
                createInputField(this, Config.INPUT_FIELD_SURVEY_FREQUENCY_DATA.label, Config.INPUT_FIELD_SURVEY_FREQUENCY_DATA.inputType, Config.INPUT_FIELD_SURVEY_FREQUENCY_DATA.values, Config.INPUT_SURVEY_FREQUENCY, node.type, true);
            }
            if (node.parentNode.type === Config.TYPE_SURVEY) {
                createInputField(this, Config.INPUT_FIELD_STEP_TYPE_DATA.label, Config.INPUT_FIELD_STEP_TYPE_DATA.inputType, Config.INPUT_FIELD_STEP_TYPE_DATA.values, Config.TYPE_STEP, node.type, false);
            }
            if (node.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                createInputField(this, Config.INPUT_FIELD_QUESTION_TYPE_DATA.label, Config.INPUT_FIELD_QUESTION_TYPE_DATA.inputType, Config.INPUT_FIELD_QUESTION_TYPE_DATA.values, Config.TYPE_QUESTION, node.type, false);
            }
        }
        
        for (let inputFieldData of Config.INPUT_FIELD_DATA) {
            for (let modelPropertyKey in dataModel) {
                if (Object.prototype.hasOwnProperty.call(dataModel, modelPropertyKey)) {
                    if (modelPropertyKey === inputFieldData.correspondingModelProperty) {
                        if (modelPropertyKey === "absoluteStartAtHour") {
                            correspondingModelValues[modelPropertyKey] = dataModel[modelPropertyKey];
                            correspondingModelValues.absoluteStartAtMinute = dataModel.absoluteStartAtMinute;
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, correspondingModelValues, false);
                            break;
                        }
                        else if (modelPropertyKey === "absoluteStartDaysOffset") {
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, dataModel[modelPropertyKey] + 1, false);
                            break;
                        }
                        else if (modelPropertyKey === "waitForStep") {
                            if (ongoingInstructions.length !== 0) {
                                createInputField(this, inputFieldData.label, inputFieldData.inputType,
                                ongoingInstructions, inputFieldData.correspondingModelProperty, dataModel[modelPropertyKey], true);
                            }
                        }
                        else if (modelPropertyKey === "nextQuestionId") {
                            if (node.type === Config.TYPE_ANSWER) {
                                if (questions.length !== 0 && parentDataModel.choiceType === Config.CHOICE_TYPE_SINGLE_CHOICE) {
                                    createInputField(this, inputFieldData.label, inputFieldData.inputType, questions, inputFieldData.correspondingModelProperty, dataModel[modelPropertyKey], true);
                                }
                            }
                        }
                        else {
                            createInputField(this, inputFieldData.label, inputFieldData.inputType, inputFieldData.values, inputFieldData.correspondingModelProperty, dataModel[modelPropertyKey], false);
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

    disableInputsExcept(modelProperty) {
        let imageElement = this.inputFieldsContainer.querySelector("img"),
        videoElement = this.inputFieldsContainer.querySelector("video");

        this.deleteButton.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        for (let child of this.inputFieldsContainer.children) {
            if (child.title !== modelProperty) {
                child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                hideChildrenElements(child);
            }
        }
        if (imageElement !== null) {
            imageElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
        if (videoElement !== null) {
            videoElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }

    enableInputs() {
        let imageElement = this.inputFieldsContainer.querySelector("img"),
        imageInputField = this.inputFieldsContainer.querySelector("div[title=imageFileName]"),
        videoElement = this.inputFieldsContainer.querySelector("video"),
        videoInputField = this.inputFieldsContainer.querySelector("div[title=videoFileName]");

        if (!(this.correspondingNode instanceof RootNode)) {
            this.deleteButton.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        }
        for (let child of this.inputFieldsContainer.children) {
            child.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            showChildrenElements(child);
        }
        if (imageElement !== null) {
            imageElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            imageInputField.querySelector("input").classList.add(Config.HIDDEN_CSS_CLASS_NAME);
            videoInputField.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
        if (videoElement !== null) {
            videoElement.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
            videoInputField.querySelector("input").classList.add(Config.HIDDEN_CSS_CLASS_NAME);
            imageInputField.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }

    setImageResource(resourceFile, correspondingNodeId) {
        let imageElement = this.inputFieldsContainer.querySelector("img"),
        reader = new FileReader();

        if (imageElement !== null && correspondingNodeId === this.correspondingNode.id) {
            reader.onload = function (event) {
                imageElement.setAttribute("src", event.target.result);
            };
            reader.readAsDataURL(resourceFile);
        }
        this.currentFileName = resourceFile.name;
    }

    setVideoResource(resourceFile, correspondingNodeId) {
        let videoElement = this.inputFieldsContainer.querySelector("video"),
        fileType,
        sourceElement,
        reader = new FileReader();

        if (videoElement !== null && correspondingNodeId === this.correspondingNode.id) {
            reader.onload = function (event) {
                fileType = resourceFile.name.split(".")[1];
                sourceElement = document.createElement("source");
                sourceElement.setAttribute("type", "video/" + fileType);
                sourceElement.setAttribute("src", event.target.result);
                videoElement.appendChild(sourceElement);
            };
            reader.readAsDataURL(resourceFile);
        }
        this.currentFileName = resourceFile.name;
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

function hideChildrenElements(childElement) {
    if (childElement.children === undefined || childElement.children.length === 0) {
        return;
    }
    for (let child of childElement.children) {
        child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        hideChildrenElements(child);
    }
}

function showChildrenElements(childElement) {
    if (childElement.children === undefined || childElement.children.length === 0) {
        return;
    }
    for (let child of childElement.children) {
        child.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
        showChildrenElements(child);
    }
}

function createInputField(that, label, type, values, modelProperty, currentModelValue, addNoSelection) {
    let inputField,
    inputElement,
    clearInputButton,
    labelElement,
    imageElement,
    videoElement;
    
    inputField = document.createElement("div");
    inputField.innerHTML = INPUT_FIELD_TEMPLATE_STRING;
    inputField = inputField.firstElementChild;
    inputField.firstElementChild.innerHTML = label;
    if (modelProperty === "absoluteStartAtHour"
        || modelProperty === "maxDurationInMin"
        || modelProperty === "notificationDurationInMin") {
            inputField.title = "absoluteStartDaysOffset";
    }
    else {
        inputField.title = modelProperty;
    }
    
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
                imageElement.setAttribute("width", that.inputViewContainer.clientWidth * Config.INPUT_RESOURCE_CONTAINER_WIDTH_RATIO);
                imageElement.setAttribute("height", "auto");
            }
            else {
                videoElement = document.createElement("video");
                videoElement.setAttribute("width", that.inputViewContainer.clientWidth * Config.INPUT_RESOURCE_CONTAINER_WIDTH_RATIO);
                videoElement.setAttribute("height", "auto");
                videoElement.setAttribute("controls", "");
                
            }
            inputElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
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
    console.log(that.inputFieldsContainer);
}

function onInputChanged(event) {
    let data = {
        correspondingNode: this.correspondingNode,
        newDataProperties: undefined,
        resourceFile: undefined,
    },
    inputChangeEvent,
    uploadResourceEvent,
    properties = {},
    correspondingModelProperty = event.target.getAttribute("name"),
    checkboxElements,
    inputElements,
    changeNodeEvent,
    imageInputElement,
    videoElement,
    sourceElement,
    reader = new FileReader();

    if (event.target.value !== "") {
        properties.id = this.correspondingNode.id;
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
            inputElements = this.inputFieldsContainer.querySelectorAll("input");
            for (let inputElement of inputElements) {
                if (inputElement.name === "videoFileName") {
                    inputElement.parentElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                    break;
                }
            }
            properties.imageFileName = event.target.files[0].name;
            this.currentFileName = event.target.files[0].name;
            data.resourceFile = event.target.files[0];
        }
        else if (correspondingModelProperty === "videoFileName") {
            inputElements = this.inputFieldsContainer.querySelectorAll("input");
            for (let inputElement of inputElements) {
                if (inputElement.name === "imageFileName") {
                    inputElement.parentElement.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                    break;
                }
            }
            properties.videoFileName = event.target.files[0].name;
            this.currentFileName = event.target.files[0].name;
            data.resourceFile = event.target.files[0];
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
        data.newDataProperties = properties;
    
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
            if (data.resourceFile !== undefined) {
                event.target.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                if (data.resourceFile.size >= Config.MAX_RESOURCE_FILE_SIZE) {
                    alert(Config.FILE_TOO_LARGE + " (" + data.resourceFile.name + ")"); // eslint-disable-line no-alert
                    this.currentFileName = null;
                    this.clearFileInputs();
                    return;
                }
                if (!Config.ACCEPTED_RESOURCE_MIME_TYPES.includes(data.resourceFile.type)) {
                    alert(Config.FILE_TYPE_NOT_SUPPORTED + " (" + data.resourceFile.name + ")"); // eslint-disable-line no-alert
                    this.currentFileName = null;
                    this.clearFileInputs();
                    return;
                }
                if (properties.imageFileName !== undefined) {
                    reader.onload = function (fileReaderEvent) {
                        imageInputElement = this.inputFieldsContainer.querySelector("img");
                        videoElement = this.inputFieldsContainer.querySelector("input[name=videoFileName]");
                        if (imageInputElement === null) {
                            imageInputElement = document.createElement("img");
                            imageInputElement.setAttribute("width", this.inputViewContainer.clientWidth * Config.INPUT_RESOURCE_CONTAINER_WIDTH_RATIO);
                            imageInputElement.setAttribute("height", "auto");
                            imageInputElement.setAttribute("src", fileReaderEvent.target.result);
                            event.target.parentElement.insertAdjacentElement("afterend", imageInputElement);
                        }
                        else {
                            imageInputElement.setAttribute("src", fileReaderEvent.target.result);
                        }
                        if (videoElement !== null) {
                            for (let child of videoElement.parentElement.children) {
                                child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                            }
                        }
                        event.target.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                        inputChangeEvent = new ControllerEvent(Config.EVENT_INPUT_CHANGED, data);
                        this.notifyAll(inputChangeEvent);
                    }.bind(this);
                    reader.readAsDataURL(data.resourceFile);
                }
                else {
                    reader.onload = function (fileReaderEvent) {
                        sourceElement = this.inputFieldsContainer.querySelector("source");
                        imageInputElement = this.inputFieldsContainer.querySelector("input[name=imageFileName]");
                        if (sourceElement === null) {
                            videoElement = document.createElement("video");
                            videoElement.setAttribute("width", this.inputViewContainer.clientWidth * Config.INPUT_RESOURCE_CONTAINER_WIDTH_RATIO);
                            videoElement.setAttribute("height", "auto");
                            videoElement.setAttribute("controls", "");
                            sourceElement = document.createElement("source");
                            sourceElement.setAttribute("type", event.target.files[0].type);
                            sourceElement.setAttribute("src", fileReaderEvent.target.result);
                            videoElement.appendChild(sourceElement);
                            event.target.parentElement.insertAdjacentElement("afterend", videoElement);
                        }
                        else {
                            sourceElement.setAttribute("src", fileReaderEvent.target.result);
                        }
                        if (imageInputElement !== null) {
                            for (let child of imageInputElement.parentElement.children) {
                                child.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
                            }
                        }
                        videoElement.addEventListener("loadedmetadata", function() {
                            if (videoElement.videoHeight > Config.MAX_VIDEO_HEIGHT
                                || videoElement.videoWidth > Config.MAX_VIDEO_WIDTH) {
                                    alert(Config.VIDEO_RESOLUTION_TOO_HIGH + " (" + data.resourceFile.name + ")"); // eslint-disable-line no-alert
                                    this.currentFileName = null;
                                    this.clearFileInputs();
                                    return;
                            }
                            inputChangeEvent = new ControllerEvent(Config.EVENT_INPUT_CHANGED, data);
                            this.notifyAll(inputChangeEvent);
                        }.bind(this));
                    }.bind(this);
                    reader.readAsDataURL(data.resourceFile);
                    uploadResourceEvent = new ControllerEvent(Config.EVENT_UPLOAD_RESOURCE, null);
                    this.notifyAll(uploadResourceEvent);
                }
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
        newDataProperties: {},
        previousFileName: this.currentFileName,
    },
    correspondingInputElement = event.target.parentElement.querySelector("input"),
    inputElements = this.inputFieldsContainer.querySelectorAll("input[type=file]"),
    imageElement = this.inputFieldsContainer.querySelector("img"),
    videoElement = this.inputFieldsContainer.querySelector("video"),
    inputChangeEvent;
    
    data.newDataProperties.id = this.correspondingNode.id;
    this.currentFileName = null;
    correspondingInputElement.value = null;
    data.newDataProperties[correspondingInputElement.getAttribute("name")] = null;

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