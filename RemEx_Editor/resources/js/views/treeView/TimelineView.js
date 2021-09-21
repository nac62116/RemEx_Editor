import Config from "../../utils/Config.js";
import {Observable, Event} from "../../utils/Observable.js";

class TimelineView extends Observable {

    constructor() {
        super();
        this.center = {
            x: undefined,
            y: undefined,
        };
        this.top = {
            x: undefined,
            y: undefined,
        };
        this.topLeft = {
            x: undefined,
            y: undefined,
        };
        this.bottom = {
            x: undefined,
            y: undefined,
        };
        this.height = Config.NODE_HEIGHT;
        this.width = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID).clientWidth * Config.TIMELINE_WIDTH_RATIO;
        this.timeSpanInDays = Config.TIMELINE_INITIAL_TIME_SPAN_IN_DAYS;
        this.labelDescriptionsType = Config.TIMELINE_LABEL_DESCRIPTIONS_TYPE_HALF_HOURLY;
        this.isEmphasized = false;
        this.parentNode = undefined;
        this.surveyNodes = [];
        this.timePositionPairs = new Map();
        this.timelineElement = createTimelineElement(this);
        this.timelineElement.addEventListener("click", onClick.bind(this));
        this.timelineElement.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.timelineElement.addEventListener("mouseleave", onMouseLeave.bind(this));
    }

    init(parentNode) {
        this.parentNode = parentNode;
    }

    show() {
        for (let element of this.timelineElement.children) {
            element.removeAttribute("display");
        }
    }

    hide() {
        for (let element of this.timelineElement.children) {
            element.setAttribute("display", "none");
        }
    }

    emphasize() {
        let timeline = this.timelineElement.querySelector("#" + Config.TIMELINE_ID),
        timelineDescription = this.timelineElement.querySelector("#" + Config.TIMELINE_DESCRIPTION_ID),
        labelStrokes = this.timelineElement.querySelectorAll("#" + Config.TIMELINE_LABEL_STROKE_ID),
        labelDescriptions = this.timelineElement.querySelectorAll("#" + Config.TIMELINE_LABEL_DESCRIPTION_ID);

        timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_EMPHASIZED);
        timelineDescription.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
        for (let labelStroke of labelStrokes) {
            labelStroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_EMPHASIZED);
        }
        for (let labelDescription of labelDescriptions) {
            labelDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
        }
        this.isEmphasized = true;
    }

    deemphasize() {
        let timeline = this.timelineElement.querySelector("#" + Config.TIMELINE_ID),
        timelineDescription = this.timelineElement.querySelector("#" + Config.TIMELINE_DESCRIPTION_ID),
        labelStrokes = this.timelineElement.querySelectorAll("#" + Config.TIMELINE_LABEL_STROKE_ID),
        labelDescriptions = this.timelineElement.querySelectorAll("#" + Config.TIMELINE_LABEL_DESCRIPTION_ID);

        timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_DEEMPHASIZED);
        timelineDescription.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
        for (let labelStroke of labelStrokes) {
            labelStroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_DEEMPHASIZED);
        }
        for (let labelDescription of labelDescriptions) {
            labelDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
        }
        this.isEmphasized = false;
    }

    insertSurveyNode(node) {
        this.surveyNodes.push(node);
    }

    removeSurveyNode(node) {
        let indexOfNode = this.surveyNodes.indexOf(node);

        this.surveyNodes.splice(indexOfNode, 1);
    }

    getNextSurveyNode(clickedTime) {
        let nextSurveyNode = getNearestSurveyNode(clickedTime, true);
        return nextSurveyNode;
    }

    getPreviousSurveyNode(clickedTime) {
        let previousSurveyNode = getNearestSurveyNode(clickedTime, false);
        return previousSurveyNode;
    }

    getParentNode() {
        return this.parentNode;
    }

    rescale() {
        let timeSpanInDays = calculateTimeSpanInDays(this);
        updateTimePositionPairs(this, timeSpanInDays);
        updateScaleLabels(this, timeSpanInDays);
        updateSurveyPositions(this);
    }

    updatePosition(centerX, centerY) {
        this.center.x = centerX;
        this.center.y = centerY;
        this.top.x = centerX;
        this.top.y = centerY - this.height / 2;
        this.topLeft.x = centerX - this.width / 2;
        this.topLeft.y = centerY - this.height / 2;
        this.bottom.x = centerX;
        this.bottom.y = centerY + this.height / 2;
        this.timelineElement.setAttribute("x", this.topLeft.x);
        this.timelineElement.setAttribute("y", this.topLeft.y);
        updateSurveyPositions(this);
    }
}

function calculateTimeSpanInDays(that) {
    let timeSpanInDays;

    if (that.surveyNodes.length !== 0) {
        for (let surveyNode of that.surveyNodes) {
            if (surveyNode.nextNode === undefined) {
                timeSpanInDays = surveyNode.description.split(" ")[1] * 1 + 1;
            }
        }
    }
    else {
        timeSpanInDays = Config.TIMELINE_INITIAL_TIME_SPAN_IN_DAYS;
    }
    return timeSpanInDays;
}

function updateTimePositionPairs(that, timeSpanInDays) {
    let timeline = that.timelineElement.querySelector("#" + Config.TIMELINE_ID),
    timelineStartX = timeline.getAttribute("x1"),
    timelineEndX = timeline.getAttribute("x2"),
    timeSpanInMinutes = timeSpanInDays * 24 * 60,
    timelineMinuteLength = (timelineEndX - timelineStartX) / timeSpanInMinutes,
    time = {
        day: 1,
        hour: 0,
        minute: 0,
    },
    timeKey = Config.TIMELINE_LABEL_DESCRIPTIONS_PREFIX + " " + time.day + " " + time.hour + ":" + time.minute + " " + Config.TIMELINE_LABEL_DESCRIPTIONS_SUFFIX;
    that.timePositionPairs = new Map();

    //console.log(timelineMinuteLength);
    /*for (let positionX = timelineStartX; positionX <= timelineEndX; positionX = positionX + timelineMinuteLength) {
        that.timePositionPairs.set(timeKey, positionX);
        time.minute += 1;
        if (time.minute === 60) {
            time.minute = 0;
            time.hour += 1;
        }
        if (time.hour === 24) {
            time.hour = 0;
            time.day += 1;
        }
    }*/
}

function updateScaleLabels(that, timeSpanInDays) {
    let labelDescriptions,
    numberOfLabelsPerDay,
    isGreaterFrequency;
    if (timeSpanInDays === 1) {
        that.labelDescriptionsType = Config.TIMELINE_LABEL_DESCRIPTIONS_TYPE_HALF_HOURLY;
        labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_HALF_HOURLY;
        numberOfLabelsPerDay = Config.TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ONE_DAY;
        isGreaterFrequency = Config.TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ONE_DAY;
    }
    else if (timeSpanInDays <= 3) {
        that.labelDescriptionsType = Config.TIMELINE_LABEL_DESCRIPTIONS_TYPE_HOURLY;
        labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_HOURLY;
        numberOfLabelsPerDay = Config.TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_THREE_DAYS;
        isGreaterFrequency = Config.TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_THREE_DAYS;
    }
    else {
        that.labelDescriptionsType = Config.TIMELINE_LABEL_DESCRIPTIONS_TYPE_DAILY;
        labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_DAILY;
        numberOfLabelsPerDay = Config.TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ABOVE_THREE_DAYS;
        isGreaterFrequency = Config.TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ABOVE_THREE_DAYS;
    }
    createLabels(that, labelDescriptions, timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency);
}

function updateSurveyPositions(that) {
    let firstSurveyNode;
    if (that.surveyNodes.length !== 0) {
        for (let surveyNode of that.surveyNodes) {
            if (surveyNode.previousNode === undefined) {
                firstSurveyNode = surveyNode;
            }
        }
        positionSurveyOnTimeline(that, firstSurveyNode);
    }
}

function positionSurveyOnTimeline(that, surveyNode) {
    let surveyX = that.timePositionPairs.get(surveyNode.description),
    surveyY = that.center.y;

    if (surveyNode === undefined) {
        return;
    }
    surveyNode.updatePosition(surveyX, surveyY, true);
    positionSurveyOnTimeline(that, surveyNode.nextNode);
}

function getNearestSurveyNode(clickedTime, getNextNode) {
    let nearestSurveyNode,
    splittedSurveyDescription,
    surveyNodeTime,
    surveyNodeTimeInMinutes,
    clickedTimeInMinutes = clickedTime.day * 24 * 60 + clickedTime.hour * 60 + clickedTime.minute,
    minimumTimeDifferenceInMinutes,
    currentTimeDifferenceInMinutes;
    
    for (let surveyNode of this.surveyNodes) {
        splittedSurveyDescription = surveyNode.description.split(" ");
        surveyNodeTime = {
            day: splittedSurveyDescription[1],
            hour: splittedSurveyDescription[2].split(":")[0],
            minute: splittedSurveyDescription[2].split(":")[1],
        };
        surveyNodeTimeInMinutes = surveyNodeTime.day * 24 * 60 + surveyNodeTime.hour * 60 + surveyNodeTime.minute;
        if (getNextNode === true) {
            currentTimeDifferenceInMinutes = surveyNodeTimeInMinutes - clickedTimeInMinutes;
        }
        else {
            currentTimeDifferenceInMinutes = clickedTimeInMinutes - surveyNodeTimeInMinutes;
        }
        if (minimumTimeDifferenceInMinutes !== undefined) {
            if (currentTimeDifferenceInMinutes >= 0) {
                if (minimumTimeDifferenceInMinutes > currentTimeDifferenceInMinutes) {
                    minimumTimeDifferenceInMinutes = currentTimeDifferenceInMinutes;
                    nearestSurveyNode = surveyNode;
                }
            }
        }
        else {
            minimumTimeDifferenceInMinutes = currentTimeDifferenceInMinutes;
            nearestSurveyNode = surveyNode;
        }
    }
    return nearestSurveyNode;
}

// Event callback functions

function onMouseEnter() {
    this.emphasize();
}

function onMouseLeave() {
    this.deemphasize();
}

function onClick(event) {
    let data, time, positionX, controllerEvent;

    data = {
        time: undefined,
        positionX: undefined,
    };
    for (let timePositionPair of this.timePositionPairs) {
        time = timePositionPair[0];
        positionX = timePositionPair[1];
        if (positionX === event/*.positionX*/) {
            data.time = time;
            break;
        }
    }
    controllerEvent = new Event(Config.EVENT_TIMELINE_CLICKED, data);
    this.notifyAll(controllerEvent);
}

// Svg element creation

function createTimelineElement(that) {
    let timelineElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    timeline = createTimeline(that),
    timelineDescription = createTimelineDescription(that);

    timelineElement.setAttribute("viewBox", "0 0 " + that.width + " " + Config.NODE_HEIGHT);
    timelineElement.setAttribute("width", that.width);
    timelineElement.setAttribute("height", Config.NODE_HEIGHT);
    timelineElement.appendChild(timelineDescription);
    timelineElement.appendChild(timeline);
    return timelineElement;
}

function createTimeline(that) {
    let timeline = document.createElementNS("http://www.w3.org/2000/svg", "line"),
    timelineEnd = that.width - Config.TIMELINE_DISTANCE_FROM_BORDER;
    timeline.setAttribute("id", Config.TIMELINE_ID);
    timeline.setAttribute("x1", Config.TIMELINE_DISTANCE_FROM_BORDER);
    timeline.setAttribute("x2", timelineEnd);
    timeline.setAttribute("y1", Config.TIMELINE_Y1);
    timeline.setAttribute("y2", Config.TIMELINE_Y2);
    timeline.setAttribute("stroke", Config.TIMELINE_COLOR);
    timeline.setAttribute("stroke-width", Config.TIMELINE_STROKE_WIDTH);
    if (that.isEmphasized) {
        timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_EMPHASIZED);
    }
    else {
        timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_DEEMPHASIZED);
    }
    return timeline;
}

function createTimelineDescription(that) {
    let timelineDescription = document.createElementNS("http://www.w3.org/2000/svg", "text");
    timelineDescription.setAttribute("id", Config.TIMELINE_DESCRIPTION_ID);
    timelineDescription.setAttribute("x", Config.TIMELINE_DESCRIPTION_X);
    timelineDescription.setAttribute("y", Config.TIMELINE_DESCRIPTION_Y);
    timelineDescription.setAttribute("text-anchor", Config.TIMELINE_DESCRIPTION_TEXT_ANCHOR);
    timelineDescription.setAttribute("fill", Config.TIMELINE_DESCRIPTION_COLOR);
    timelineDescription.setAttribute("font-family", Config.TIMELINE_DESCRIPTION_FONT_FAMILY);
    timelineDescription.setAttribute("font-size", Config.TIMELINE_DESCRIPTION_FONT_SIZE);
    timelineDescription.setAttribute("font-weight", Config.TIMELINE_DESCRIPTION_FONT_WEIGHT);
    if (that.isEmphasized) {
        timelineDescription.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    }
    else {
        timelineDescription.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    }
    timelineDescription.innerHTML = Config.TIMELINE_DESCRIPTION_TEXT_FIRST_LINE;
    return timelineDescription;
}

function createLabels(that, labelDescriptions, timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency) {
    let labelDescription = [],
    labelDescriptionCounter = 0,
    dayCounter = 1;
    
    for (let labelX = 0 + Config.TIMELINE_DISTANCE_FROM_BORDER; labelX <= that.width - Config.TIMELINE_DISTANCE_FROM_BORDER; labelX += that.width / (timeSpanInDays * numberOfLabelsPerDay)) {
        //console.log(labelDescriptionCounter);
        labelDescription[0] = Config.TIMELINE_LABEL_DESCRIPTIONS_PREFIX + " " + dayCounter;
        labelDescription[1] = labelDescriptions[labelDescriptionCounter] + " " + Config.TIMELINE_LABEL_DESCRIPTIONS_SUFFIX;
        if (isGreaterFrequency !== undefined && labelDescriptionCounter % isGreaterFrequency === 0) {
            createLabelStroke(that, labelX, true);
            createlabelDescription(that, labelDescription, labelX, true);
        }
        else {
            createLabelStroke(that, labelX, false);
            createlabelDescription(that, labelDescription, labelX, false);
        }
        labelDescriptionCounter += 1;
        if (labelDescriptionCounter === labelDescriptions.length) {
            labelDescriptionCounter = 0;
            dayCounter += 1;
        }
    }
}

function createLabelStroke(that, strokeX, isGreater) {
    let labelStroke = document.createElementNS("http://www.w3.org/2000/svg", "line");
    labelStroke.setAttribute("id", Config.TIMELINE_LABEL_STROKE_ID);
    labelStroke.setAttribute("x1", strokeX);
    labelStroke.setAttribute("x2", strokeX);
    labelStroke.setAttribute("stroke", Config.TIMELINE_COLOR);
    if (isGreater) {
        labelStroke.setAttribute("y1", Config.TIMELINE_LABEL_STROKE_Y1_GREATER);
        labelStroke.setAttribute("y2", Config.TIMELINE_LABEL_STROKE_Y2_GREATER);
        labelStroke.setAttribute("stroke-width", Config.TIMELINE_LABEL_STROKE_WIDTH_GREATER);
    }
    else {
        labelStroke.setAttribute("y1", Config.TIMELINE_LABEL_STROKE_Y1_NORMAL);
        labelStroke.setAttribute("y2", Config.TIMELINE_LABEL_STROKE_Y2_NORMAL);
        labelStroke.setAttribute("stroke-width", Config.TIMELINE_LABEL_STROKE_WIDTH_NORMAL);
    }
    if (that.isEmphasized) {
        labelStroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_EMPHASIZED);
    }
    else {
        labelStroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_DEEMPHASIZED);
    }
    that.timelineElement.appendChild(labelStroke);
}

function createlabelDescription(that, description, descriptionX, isGreater) {
    let labelDescription = document.createElementNS("http://www.w3.org/2000/svg", "text"),
    newLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    labelDescription.innerHTML = description[0];
    labelDescription.setAttribute("id", Config.TIMELINE_LABEL_DESCRIPTION_ID);
    labelDescription.setAttribute("x", descriptionX);
    labelDescription.setAttribute("font-family", Config.TIMELINE_LABEL_DESCRIPTION_FONT_FAMILY);
    labelDescription.setAttribute("text-anchor", Config.TIMELINE_LABEL_DESCRIPTION_TEXT_ANCHOR);
    labelDescription.setAttribute("fill", Config.TIMELINE_LABEL_DESCRIPTION_COLOR);
    labelDescription.setAttribute("font-weight", Config.TIMELINE_LABEL_DESCRIPTION_FONT_WEIGHT);
    if (isGreater) {
        labelDescription.setAttribute("y", Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_NORMAL);
        labelDescription.setAttribute("font-size", Config.TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_NORMAL);
    }
    else {
        labelDescription.setAttribute("y", Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_GREATER);
        labelDescription.setAttribute("font-size", Config.TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_GREATER);
    }
    if (that.isEmphasized) {
        labelDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    }
    else {
        labelDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    }
    newLine.setAttribute("x", descriptionX);
    newLine.setAttribute("dy", Config.LINE_SPACING);
    newLine.innerHTML = description[1];
    labelDescription.appendChild(newLine);
    that.timelineElement.appendChild(labelDescription);
}

export default new TimelineView();