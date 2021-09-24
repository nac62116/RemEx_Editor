import LeafNode from "./LeafNode.js";
import {Observable, Event} from "../../utils/Observable.js";
import SvgFactory from "../../utils/SvgFactory.js";
import Config from "../../utils/Config.js";

class TimelineNode extends LeafNode {

    constructor(nodeElements, id, type, description, parentNode, timelineEventListener, treeViewWidth) {
        super(nodeElements, id, type, description, parentNode);
        this.timeline = new TimelineView(nodeElements.timelineElements, treeViewWidth);
        for (let listener of timelineEventListener) {
            this.timeline.addEventListener(listener.eventType, listener.callback);
        }
        this.timeNodeMap = new Map();
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

    updateTimelineLength() {
        let ascSortedTimes = this.getTimeSortedChildNodes(),
        maxTimeInMin;
        if (ascSortedTimes.length === 0) {
            maxTimeInMin = Config.ONE_DAY_IN_MIN;
        }
        else {
            maxTimeInMin = ascSortedTimes[ascSortedTimes.length - 1];
        }

        this.timeline.updateLength(maxTimeInMin);
    }

    getPositionFromTime(timeInMin, correspondingNode) {
        let position;

        this.timeNodeMap.set(timeInMin, correspondingNode);
        position = this.timeline.getPositionOnTimeline(timeInMin);

        return position;
    }

    getTimeSortedChildNodes() {
        let timeSortedChildNodes = [],
        sortedKeys = [],
        key;

        for (key of this.timeNodeMap.keys()) {
            sortedKeys.push(key);
        }
        sortedKeys.sort();
        for (key of sortedKeys) {
            timeSortedChildNodes.push(this.timeNodeMap.get(key));
        }

        return timeSortedChildNodes;
    }
}

class TimelineView extends Observable {

    constructor(timelineElements, treeViewWidth) {
        super();
        this.timelineElements = timelineElements;
        this.center = {
            x: undefined,
            y: undefined,
        };
        this.start = {
            x: undefined,
            y: undefined,
        };
        this.end = {
            x: undefined,
            y: undefined,
        };
        this.height = Config.NODE_BODY_HEIGHT;
        this.width = treeViewWidth * Config.TIMELINE_WIDTH_IN_PERCENTAGE;
        this.timelineLengthInMin = Config.ONE_DAY_IN_MIN;
        this.timelineElements.timeline.addEventListener("click", onClick.bind(this));
        this.timelineElements.timeline.addEventListener("mouseenter", onMouseEnter.bind(this));
        this.timelineElements.timeline.addEventListener("mouseleave", onMouseLeave.bind(this));
        this.timelineElements.labels = [];
    }

    show() {
        this.timelineElements.timeline.removeAttribute("display");
        this.timelineElements.description.removeAttribute("display");
        for (let label of this.timelineElements.labels) {
            label.description.removeAttribute("display");
            label.stroke.removeAttribute("display");
        }
    }

    hide() {
        this.timelineElements.timeline.setAttribute("display", "none");
        this.timelineElements.description.setAttribute("display", "none");
        for (let label of this.timelineElements.labels) {
            label.description.setAttribute("display", "none");
            label.stroke.setAttribute("display", "none");
        }
    }

    updatePosition(correspondingNodeCenterX, correspondingNodeCenterY) {
        let offsetX;
        
        if (this.center.x !== undefined) {
            offsetX = correspondingNodeCenterX - this.center.x;
        }

        this.center.x = correspondingNodeCenterX;
        this.center.y = correspondingNodeCenterY + Config.NODE_DISTANCE_VERTICAL;
        this.start.x = correspondingNodeCenterX - this.width / 2;
        this.start.y = correspondingNodeCenterY;
        this.end.x = correspondingNodeCenterX + this.width / 2;
        this.end.y = correspondingNodeCenterY;
        this.timelineElements.timeline.setAttribute("y1", this.center.y);
        this.timelineElements.timeline.setAttribute("x1", this.start.x);
        this.timelineElements.timeline.setAttribute("y2", this.center.y);
        this.timelineElements.timeline.setAttribute("x2", this.end.x);
        this.timelineElements.description.setAttribute("y", this.center.y - Config.TIMELINE_DESCRIPTION_CENTER_OFFSET_Y);
        this.timelineElements.description.setAttribute("x", this.center.x);
        for (let label of this.timelineElements.labels) {
            if (label.stroke.getAttribute("isGreater") === "true") {
                label.stroke.setAttribute("y1", this.center.y - Config.TIMELINE_LABEL_STROKE_OFFSET_Y_GREATER);
                label.stroke.setAttribute("y2", this.center.y + Config.TIMELINE_LABEL_STROKE_OFFSET_Y_GREATER);
                label.description.setAttribute("y", this.center.y - Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_GREATER);
            }
            else {
                label.stroke.setAttribute("y1", this.center.y - Config.TIMELINE_LABEL_STROKE_OFFSET_Y);
                label.stroke.setAttribute("y2", this.center.y + Config.TIMELINE_LABEL_STROKE_OFFSET_Y);
                label.description.setAttribute("y", this.center.y - Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y);
            }
            label.stroke.setAttribute("x1", label.stroke.getAttribute("x1") * 1 + offsetX);
            label.stroke.setAttribute("x2", label.stroke.getAttribute("x2") * 1 + offsetX);
            label.description.setAttribute("x", label.description.getAttribute("x") * 1 + offsetX);
            for (let newLine of label.description.children) {
                newLine.setAttribute("x", newLine.getAttribute("x") * 1 + offsetX);
            }
        }
    }

    updateLength(timelineLengthInMin) {
        let label,
        labelSteps,
        labelDescriptions,
        position = {},
        dayCount = 1,
        descriptionCount = 0,
        descriptionLines = [],
        isGreater,
        treeView = document.querySelector("#" + Config.TREE_VIEW_ID);

        if (timelineLengthInMin <= Config.ONE_DAY_IN_MIN) {
            labelSteps = Config.ONE_HOUR_IN_MIN;
            this.timelineLengthInMin = Config.ONE_DAY_IN_MIN;
            labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_HOURLY;
        }
        else if (timelineLengthInMin <= Config.THREE_DAYS_IN_MIN) {
            labelSteps = Config.SIX_HOURS_IN_MIN;
            this.timelineLengthInMin = Config.THREE_DAYS_IN_MIN;
            labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_QUARTER_DAILY;
        }
        else if (timelineLengthInMin <= Config.SEVEN_DAYS_IN_MIN) {
            labelSteps = Config.ONE_DAY_IN_MIN;
            this.timelineLengthInMin = Config.SEVEN_DAYS_IN_MIN;
            labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_DAILY;
        }
        else {
            labelSteps = Config.SEVEN_DAYS_IN_MIN;
            this.timelineLengthInMin = timelineLengthInMin;
            labelDescriptions = Config.TIMELINE_LABEL_DESCRIPTIONS_DAILY;
        }
        for (let currentLabel of this.timelineElements.labels) {
            treeView.removeChild(currentLabel.stroke);
            treeView.removeChild(currentLabel.description);
        }
        this.timelineElements.labels = [];
        for (let timeInMin = 0; timeInMin <= timelineLengthInMin; timeInMin += labelSteps) {
            if (descriptionCount === labelDescriptions.length) {
                descriptionCount = 0;
                if (labelSteps === Config.SEVEN_DAYS_IN_MIN) {
                    dayCount += 7;
                }
                else {
                    dayCount += 1;
                }
            }
            isGreater = timeInMin % Config.ONE_DAY_IN_MIN === 0 || timeInMin % Config.ONE_HOUR_IN_MIN;
            descriptionLines[0] = Config.TIMELINE_LABEL_DESCRIPTIONS_PREFIX + " " + dayCount;
            descriptionLines[1] = labelDescriptions[descriptionCount];
            position = this.getPositionOnTimeline(timeInMin);
            label = SvgFactory.createTimelineLabel(position, descriptionLines, isGreater);
            this.timelineElements.labels.push(label);
            treeView.appendChild(label.description);
            treeView.appendChild(label.stroke);
            descriptionCount++;
        }
    }

    getPositionOnTimeline(timeInMin) {
        let position = {
            x: this.start.x + (timeInMin / this.timelineLengthInMin * (this.end.x - this.start.x)),
            y: this.center.y,
        };
        return position;
    }
}

// Event callback functions

function onMouseEnter() {
    emphasize(this);
}

function emphasize(that) {
    that.timelineElements.timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_EMPHASIZED);
    that.timelineElements.description.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
    for (let label of that.timelineElements.labels) {
        label.description.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZED);
        label.stroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_EMPHASIZED);
    }
}

function onMouseLeave() {
    deemphasize(this);
}

function deemphasize(that) {
    that.timelineElements.timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_DEEMPHASIZED);
    that.timelineElements.description.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    for (let label of that.timelineElements.labels) {
        label.description.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
        label.stroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_DEEMPHASIZED);
    }
}

function onClick(event) {
    let data, controllerEvent;

    console.log(event);
    /*data = {
        positionOnTimeline: {
            x: event.x,
            y: this.center.y,
        },
    };
    controllerEvent = new Event(Config.EVENT_TIMELINE_CLICKED, data);
    this.notifyAll(controllerEvent);*/
}

export default TimelineNode;