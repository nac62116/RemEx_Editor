import StandardNode from "./StandardNode.js";
import {Observable, Event} from "../../utils/Observable.js";
import Config from "../../utils/Config.js";

class TimelineNode extends StandardNode {

    constructor(nodeElements, id, type, description, parentNode, timelineEventListener) {
        super(nodeElements, id, type, description, parentNode);
        this.timeline = new TimelineView(nodeElements.timelineElements);
        for (let listener of timelineEventListener) {
            this.timeline.addEventListener(listener.eventType, listener.callback);
        }
    }

    focus() {
        super.focus();
        this.timeline.show();
    }

    defocus() {
        super.defocus();
        this.timeline.hide();
    }

    updatePosition(centerX, centerY, makeStatic) {
        super.updatePosition(centerX, centerY, makeStatic);
        this.timeline.updatePosition(centerX, centerY);
    }
}

class TimelineView extends Observable {

    constructor(timelineElements) {
        super();
        this.timelineElements = timelineElements;
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
        this.height = Config.NODE_BODY_HEIGHT;
        this.timeSpanInDays = Config.TIMELINE_INITIAL_TIME_SPAN_IN_DAYS;
        this.labelDescriptionsType = Config.TIMELINE_LABEL_DESCRIPTIONS_TYPE_HALF_HOURLY;
        this.timePositionPairs = new Map();
        this.timelineElements.timeline.addEventListener("click", onClick.bind(this));
        this.timelineElements.timeline.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.timelineElements.timeline.addEventListener("mouseleave", onMouseLeave.bind(this));
    }

    show() {
        this.timelineElements.timeline.removeAttribute("display");
        this.timelineElements.description.removeAttribute("display");
        // TODO Labels
    }

    hide() {
        this.timelineElements.timeline.setAttribute("display", "none");
        this.timelineElements.description.setAttribute("display", "none");
        // TODO Labels
    }

    updatePosition(correspondingNodeCenterX, correspondingNodeCenterY) {
        this.center.x = correspondingNodeCenterX;
        this.center.y = correspondingNodeCenterY + Config.NODE_DISTANCE_VERTICAL;
        this.timelineElements.timeline.setAttribute("y1", this.center.y);
        this.timelineElements.timeline.setAttribute("y2", this.center.y);
        this.timelineElements.description.setAttribute("y", this.center.y - Config.TIMELINE_DESCRIPTION_CENTER_OFFSET_Y);
        // TODO Labels
    }
}

// Event callback functions

function onMouseEnter() {
    emphasize(this);
}

function emphasize(that) {
    that.timelineElements.timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_EMPHASIZED);
    that.timelineElements.description.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    // TODO Labels
    /*
    for (let labelStroke of labelStrokes) {
        labelStroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_EMPHASIZED);
    }
    for (let labelDescription of labelDescriptions) {
        labelDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    }*/
}

function onMouseLeave() {
    deemphasize(this);
}

function deemphasize(that) {
    that.timelineElements.timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_DEEMPHASIZED);
    that.timelineElements.description.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    // TODO Labels
    /*
    for (let labelStroke of labelStrokes) {
        labelStroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_DEEMPHASIZED);
    }
    for (let labelDescription of labelDescriptions) {
        labelDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    }*/
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

function createLabels(that, labelDescriptions, timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency) {
    let labelDescription = [],
    labelDescriptionCounter = 0,
    dayCounter = 1;
    
    for (let labelX = 0 + Config.TIMELINE_X1; labelX <= that.width - Config.TIMELINE_X1; labelX += that.width / (timeSpanInDays * numberOfLabelsPerDay)) {
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

export default TimelineNode;