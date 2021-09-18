import Config from "../../utils/Config.js";

class TimelineView {

    constructor(treeViewContainer, treeViewWidth) {
        this.treeViewContainer = treeViewContainer;
        this.treeViewElement = this.treeViewContainer.firstElementChild;
        this.center = {
            x: undefined,
            y: undefined,
        };
        this.top = {
            x: undefined,
            y: undefined,
        };
        this.bottom = {
            x: undefined,
            y: undefined,
        };
        this.width = treeViewWidth * Config.TIMELINE_WIDTH_RATIO;
        this.timeSpanInDays = Config.TIMELINE_INITIAL_TIME_SPAN_IN_DAYS;
        this.isEmphasized = false;
        this.surveyNodes = [];
        this.timelineElement = createTimelineElement(this);
        rescale(this);
        this.treeViewElement.appendChild(this.timelineElement);
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
    }

    insertSurveyNode(node) {
        this.surveyNodes.push(node);
        rescale(this);
    }

    removeSurveyNode(node) {
        let indexOfNode = this.surveyNodes.indexOf(node);

        this.surveyNodes.splice(indexOfNode, 1);
        rescale(this);
    }
}

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
    timelineEnd = that.width - Config.TIMELINE_DISTANCE_FROM_TREE_VIEW_BORDER;
    timeline.setAttribute("id", Config.TIMELINE_ID);
    timeline.setAttribute("x1", Config.TIMELINE_DISTANCE_FROM_TREE_VIEW_BORDER);
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
    return timelineDescription;
}

function rescale(that) {
    //calculateTimeSpanInDays(that);
    updateScaleLabels(that);
    //updateNodePositions(that);
}

function updateScaleLabels(that) {
    let labelDescriptions,
    numberOfLabelsPerDay,
    isGreaterFrequency;
    if (that.timeSpanInDays === 1) {
        labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_HALF_HOURLY;
        numberOfLabelsPerDay = Config.TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ONE_DAY;
        isGreaterFrequency = Config.TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ONE_DAY;
        createLabels(that, labelDescriptions, that.timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency);
    }
    else if (that.timeSpanInDays <= 3) {
        labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_HOURLY;
        numberOfLabelsPerDay = Config.TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_THREE_DAYS;
        isGreaterFrequency = Config.TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_THREE_DAYS;
        createLabels(that, labelDescriptions, that.timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency);
    }
    else if (that.timeSpanInDays <= 7) {
        labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_QUARTER_DAILY;
        numberOfLabelsPerDay = Config.TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ONE_WEEK;
        isGreaterFrequency = Config.TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ONE_WEEK; //4
        createLabels(that, labelDescriptions, that.timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency);
    }
    else {
        labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_DAILY;
        numberOfLabelsPerDay = Config.TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ABOVE_ONE_WEEK;
        isGreaterFrequency = Config.TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ABOVE_ONE_WEEK;
        createLabels(that, labelDescriptions, that.timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency);
    }
}

function createLabels(that, labelDescriptions, timeSpanInDays, numberOfLabelsPerDay, isGreaterFrequency) {
    let labelDescription,
    labelDescriptionCounter = 0,
    dayCounter = 1,
    dayLabelPrefix = "Tag ";
    for (let labelX = 0; labelX <= that.width; labelX += that.width / timeSpanInDays * numberOfLabelsPerDay) {
        labelDescription = dayLabelPrefix + dayCounter + " " + labelDescriptions[labelDescriptionCounter];
        if (isGreaterFrequency !== undefined && labelX % isGreaterFrequency === 0) {
            createLabelStroke(that, labelX, true);
            createlabelDescription(that, labelDescription, labelX, true);
        }
        else {
            createLabelStroke(that, labelX, false);
            createlabelDescription(that, labelDescription, labelX, false);
        }
        if (labelDescriptionCounter >= labelDescriptions.length) {
            labelDescriptionCounter = 0;
            dayCounter += 1;
        }
        else {
            labelDescriptionCounter += 1;
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
        labelStroke.setAttribute("y1", that.center.y - Config.TIMELINE_LABEL_STROKE_HEIGHT_GREATER / 2);
        labelStroke.setAttribute("y2", that.center.y + Config.TIMELINE_LABEL_STROKE_HEIGHT_GREATER / 2);
        labelStroke.setAttribute("stroke-width", Config.TIMELINE_LABEL_STROKE_WIDTH_GREATER);
    }
    else {
        labelStroke.setAttribute("y1", that.center.y - Config.TIMELINE_LABEL_STROKE_HEIGHT_NORMAL / 2);
        labelStroke.setAttribute("y2", that.center.y + Config.TIMELINE_LABEL_STROKE_HEIGHT_NORMAL / 2);
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
    let timelineDescription = document.createElementNS("http://www.w3.org/2000/svg", "text");
    timelineDescription.innerHTML = description;
    timelineDescription.setAttribute("id", Config.TIMELINE_LABEL_DESCRIPTION_ID);
    timelineDescription.setAttribute("x", descriptionX);
    timelineDescription.setAttribute("font-family", Config.TIMELINE_LABEL_DESCRIPTION_FONT_FAMILY);
    timelineDescription.setAttribute("text-anchor", Config.TIMELINE_LABEL_DESCRIPTION_TEXT_ANCHOR);
    timelineDescription.setAttribute("fill", Config.TIMELINE_LABEL_DESCRIPTION_COLOR);
    timelineDescription.setAttribute("font-weight", Config.TIMELINE_LABEL_DESCRIPTION_FONT_WEIGHT);
    if (isGreater) {
        timelineDescription.setAttribute("y", Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_NORMAL);
        timelineDescription.setAttribute("font-size", Config.TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_NORMAL);
    }
    else {
        timelineDescription.setAttribute("y", Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_GREATER);
        timelineDescription.setAttribute("font-size", Config.TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_GREATER);
    }
    if (that.isEmphasized) {
        timelineDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    }
    else {
        timelineDescription.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    }
    that.timelineElement.appendChild(timelineDescription);
}

export default new TimelineView();