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
        this.timelineElement = createTimelineElement(this);
        updateScaleLabels(this.timeSpanInDays);
        this.treeViewElement.appendChild(this.timelineElement);
    }

    show() {
        //
    }

    hide() {
        //
    }

    insertSurveyNode(node) {
        //
    }

    removeSurveyNode(node) {
        //
    }

    rescale(surveyNodes) {
        //
    }
}

function createTimelineElement(that) {
    let timelineElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    timelineDescription = createTimelineDescription(),
    timeline = createTimeline(that);

    timelineElement.setAttribute("viewBox", "0 0 " + that.width + " " + Config.NODE_HEIGHT);
    timelineElement.setAttribute("width", that.width);
    timelineElement.setAttribute("height", Config.NODE_HEIGHT);
    timelineElement.appendChild(timelineDescription);
    timelineElement.appendChild(timeline);
    return timelineElement;
}

function createTimelineDescription() {
    let timelineDescription = document.createElementNS("http://www.w3.org/2000/svg", "text");
    timelineDescription.setAttribute("id", Config.TIMELINE_DESCRIPTION_ID);
    timelineDescription.setAttribute("x", Config.TIMELINE_DESCRIPTION_X);
    timelineDescription.setAttribute("y", Config.TIMELINE_DESCRIPTION_Y);
    timelineDescription.setAttribute("text-anchor", Config.TIMELINE_DESCRIPTION_TEXT_ANCHOR);
    timelineDescription.setAttribute("fill", Config.TIMELINE_DESCRIPTION_COLOR);
    timelineDescription.setAttribute(Config.EMPHASIZE_FILL_OPACITY_BY, Config.TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZE_BY);
    timelineDescription.setAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY, Config.TIMELINE_DESCRIPTION_STROKE_OPACITY_EMPHASIZE_BY);
    timelineDescription.setAttribute("font-family", Config.TIMELINE_DESCRIPTION_FONT_FAMILY);
    timelineDescription.setAttribute("font-size", Config.TIMELINE_DESCRIPTION_FONT_SIZE);
    timelineDescription.setAttribute("font-weight", Config.TIMELINE_DESCRIPTION_FONT_WEIGHT);
    timelineDescription.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    timelineDescription.setAttribute("stroke-opacity", Config.TIMELINE_DESCRIPTION_STROKE_OPACITY_DEEMPHASIZED);
    return timelineDescription;
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
    timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_DEEMPHASIZED);
    timeline.setAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY, Config.TIMELINE_STROKE_OPACITY_EMPHASIZE_BY);
    return timeline;
}

function updateScaleLabels(that, timeSpanInDays) {
    if (timeSpanInDays === 1) {
        for (let labelX = 0; labelX <= that.width; labelX += that.width / 24) {
            if (i % 3 === 0) {
                createLabelStroke(that, labelX, true);
                createlabelDescription(that, labelX, true);
            }
            else {
                createLabelStroke(that, labelX, false);
                createlabelDescription(that, labelX, false);
            }
        }
    }
    else if (timeSpanInDays <= 3) {
        //
    }
    else if (timeSpanInDays <= 7) {
        //
    }
    else {
        //
    }
}

function createLabelStroke(that, strokeX, isGreater) {
    let labelStroke = document.createElementNS("http://www.w3.org/2000/svg", "line");
    labelStroke.setAttribute("x1", strokeX);
    labelStroke.setAttribute("x2", strokeX);
    labelStroke.setAttribute("stroke", Config.TIMELINE_COLOR);
    labelStroke.setAttribute("stroke-opacity", Config.LABEL_STROKE_OPACITY_DEEMPHASIZED);
    labelStroke.setAttribute(Config.EMPHASIZE_STROKE_OPACITY_BY, Config.LABEL_STROKE_OPACITY_EMPHASIZE_BY);
    if (isGreater) {
        labelStroke.setAttribute("y1", that.center.y - Config.LABEL_STROKE_HEIGHT_GREATER / 2);
        labelStroke.setAttribute("y2", that.center.y + Config.LABEL_STROKE_HEIGHT_GREATER / 2);
        labelStroke.setAttribute("stroke-width", Config.LABEL_STROKE_WIDTH_GREATER);
    }
    else {
        labelStroke.setAttribute("y1", that.center.y - Config.LABEL_STROKE_HEIGHT_NORMAL / 2);
        labelStroke.setAttribute("y2", that.center.y + Config.LABEL_STROKE_HEIGHT_NORMAL / 2);
        labelStroke.setAttribute("stroke-width", Config.LABEL_STROKE_WIDTH_NORMAL);
    }
    that.timelineElement.appendChild(labelStroke);
}

function createlabelDescription(that, descriptionX, isGreater) {
    let timelineDescription = document.createElementNS("http://www.w3.org/2000/svg", "text");
    timelineDescription.setAttribute("x", descriptionX);
    timelineDescription.setAttribute("font-family", Config.LABEL_DESCRIPTION_FONT_FAMILY);
    timelineDescription.setAttribute("text-anchor", Config.LABEL_DESCRIPTION_TEXT_ANCHOR);
    timelineDescription.setAttribute("fill", Config.LABEL_DESCRIPTION_COLOR);
    timelineDescription.setAttribute("font-weight", Config.LABEL_DESCRIPTION_FONT_WEIGHT);
    timelineDescription.setAttribute("fill-opacity", Config.LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    timelineDescription.setAttribute(Config.EMPHASIZE_FILL_OPACITY_BY, Config.LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZE_BY);
    if (isGreater) {
        timelineDescription.setAttribute("y", Config.LABEL_DESCRIPTION_CENTER_OFFSET_Y_NORMAL);
        timelineDescription.setAttribute("font-size", Config.LABEL_DESCRIPTION_FONT_SIZE_NORMAL);
    }
    else {
        timelineDescription.setAttribute("y", Config.LABEL_DESCRIPTION_CENTER_OFFSET_Y_GREATER);
        timelineDescription.setAttribute("font-size", Config.LABEL_DESCRIPTION_FONT_SIZE_GREATER);
    }
    that.timelineElement.appendChild(timelineDescription);
}

export default new TimelineView();