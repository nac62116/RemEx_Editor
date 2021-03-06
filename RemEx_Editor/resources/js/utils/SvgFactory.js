import Config from "./Config.js";

/*
MIT License

Copyright (c) 2021 Colin Nash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

class SvgFactory {

    createTreeViewElement() {
        let treeViewElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        background = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        //treeViewElement.setAttribute("viewBox", "0 0 " + containerWidth + " " + containerHeight);
        treeViewElement.setAttribute("id", Config.TREE_VIEW_ID);
        treeViewElement.setAttribute("width", Config.TREE_VIEW_WIDTH);
        treeViewElement.setAttribute("height", Config.TREE_VIEW_HEIGHT);
        treeViewElement.appendChild(background);
        return treeViewElement;
    }

    createRootNodeElements(iconSrc) {
        let rootNodeElements = createMinimumNode(false, iconSrc);
        
        rootNodeElements.addChildButton = createAddOrSwitchNodeButton(Config.NODE_ADD_CHILD_BUTTON_ID);
        rootNodeElements.addChildIcon = createAddIcon(Config.NODE_ADD_CHILD_ICON_ID);

        return rootNodeElements;
    }

    createStandardNodeElements(hasAddNeighbourButtons, hasAddChildButton, iconSrc) {
        let standardNodeElements = createMinimumNode(false, iconSrc);
        standardNodeElements.inputPath = createNodeInputPath();
        if (hasAddNeighbourButtons) {
            standardNodeElements.addNextButton = createAddOrSwitchNodeButton(Config.NODE_ADD_NEXT_BUTTON_ID);
            standardNodeElements.addNextIcon = createAddIcon(Config.NODE_ADD_NEXT_ICON_ID);
            standardNodeElements.addPreviousButton = createAddOrSwitchNodeButton(Config.NODE_ADD_PREV_BUTTON_ID);
            standardNodeElements.addPreviousIcon = createAddIcon(Config.NODE_ADD_PREV_ICON_ID);
        }
        if (hasAddChildButton) {
            standardNodeElements.addChildButton = createAddOrSwitchNodeButton(Config.NODE_ADD_CHILD_BUTTON_ID);
            standardNodeElements.addChildIcon = createAddIcon(Config.NODE_ADD_CHILD_ICON_ID);
        }

        return standardNodeElements;
    }

    createTimelineNodeElements(iconSrc) {
        let timelineNodeElements = this.createStandardNodeElements(true, false, iconSrc);
        timelineNodeElements.timelineElements = createTimelineElements();

        return timelineNodeElements;
    }

    createDeflateableNodeElements(hasAddNeighbourButtons, hasAddChildButton, iconSrc) {
        let deflateableNodeElements = this.createStandardNodeElements(hasAddNeighbourButtons, hasAddChildButton, iconSrc);
        deflateableNodeElements.nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH_DEFLATED);
        deflateableNodeElements.nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT_DEFLATED);
        deflateableNodeElements.nodeDescription.setAttribute("display", "none");

        return deflateableNodeElements;
    }

    createSwitchableNodeElements(hasAddNeighbourButtons, hasAddChildButton, iconSrc) {
        let switchableNodeElements = this.createStandardNodeElements(hasAddNeighbourButtons, hasAddChildButton, iconSrc);
        switchableNodeElements.switchRightButton = createAddOrSwitchNodeButton(Config.NODE_SWITCH_RIGHT_BUTTON_ID);
        switchableNodeElements.switchRightIcon = createSwitchIcon(Config.NODE_SWITCH_RIGHT_ICON_ID);
        switchableNodeElements.switchLeftButton = createAddOrSwitchNodeButton(Config.NODE_SWITCH_LEFT_BUTTON_ID);
        switchableNodeElements.switchLeftIcon = createSwitchIcon(Config.NODE_SWITCH_LEFT_ICON_ID);

        return switchableNodeElements;
    }

    createTimelineLabel(labelPosition, descriptionLines, isGreater) {
        let timelineLabel = {},
        stroke = createTimelineLabelStroke(labelPosition, isGreater),
        description = createTimelineLabelDescription(labelPosition, descriptionLines, isGreater);

        timelineLabel.stroke = stroke;
        timelineLabel.description = description;

        return timelineLabel;
    }

    createNewTextLine() {
        let newLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

        newLine.setAttribute("id", Config.NODE_DESCRIPTION_NEW_LINE_ID);

        return newLine;
    }

    createWhereAmIViewElement() {
        let whereAmIViewElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        background = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        whereAmIViewElement.setAttribute("id", Config.WHERE_AM_I_VIEW_ID);
        whereAmIViewElement.setAttribute("width", Config.WHERE_AM_I_VIEW_WIDTH);
        whereAmIViewElement.setAttribute("height", Config.WHERE_AM_I_VIEW_HEIGHT);
        whereAmIViewElement.appendChild(background);
        return whereAmIViewElement;
    }
}

function createMinimumNode(isDeflateable, iconSrc) {
    let minimumNode = {
        nodeBody: createNodeBody(isDeflateable),
        nodeDescription: createNodeDescription(isDeflateable),
        nodeIcon: createNodeIcon(iconSrc),
    };

    return minimumNode;
}

function createNodeBody(isDeflateable) {
    let nodeBody = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    nodeBody.setAttribute("id", Config.NODE_BODY_ID);
    if (isDeflateable) {
        nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH_DEFLATED);
        nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT_DEFLATED);
    }
    else {
        nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH);
        nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT);
    }
    nodeBody.setAttribute("rx", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("ry", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR);
    nodeBody.setAttribute("stroke-width", Config.NODE_BODY_STROKE_WIDTH);
    nodeBody.setAttribute("stroke", Config.NODE_BODY_STROKE_COLOR);
    nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
    nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);

    return nodeBody;
}

function createNodeDescription(isDeflateable) {
    let nodeDescription = document.createElementNS("http://www.w3.org/2000/svg", "text");

    nodeDescription.setAttribute("id", Config.NODE_DESCRIPTION_FIRST_LINE_ID);
    nodeDescription.setAttribute("text-anchor", Config.NODE_DESCRIPTION_TEXT_ANCHOR);
    nodeDescription.setAttribute("fill", Config.NODE_DESCRIPTION_COLOR);
    nodeDescription.setAttribute("font-family", Config.NODE_DESCRIPTION_FONT_FAMILY);
    nodeDescription.setAttribute("font-size", Config.NODE_DESCRIPTION_FONT_SIZE);
    nodeDescription.setAttribute("font-weight", Config.NODE_DESCRIPTION_FONT_WEIGHT);
    nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    if (isDeflateable) {
        nodeDescription.setAttribute("display", "none");
    }

    return nodeDescription;
}

function createNodeIcon(iconSrc) {
    let nodeIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    
    nodeIcon.setAttribute("id", Config.NODE_ICON_ID);
    nodeIcon.setAttribute("width", Config.NODE_ICON_WIDTH);
    nodeIcon.setAttribute("height", Config.NODE_ICON_HEIGHT);
    nodeIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
    if (iconSrc !== undefined) {
        nodeIcon.setAttribute("href", iconSrc);
    }

    return nodeIcon;
}

function createNodeInputPath() {
    let inputPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    inputPath.setAttribute("stroke-width", Config.NODE_INPUT_PATH_STROKE_WIDTH);
    inputPath.setAttribute("stroke", Config.NODE_INPUT_PATH_STROKE_COLOR);
    inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
    inputPath.setAttribute("fill", "transparent");

    return inputPath;
}

function createAddOrSwitchNodeButton(id) {
    let addButton = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    addButton.setAttribute("id", id);
    addButton.setAttribute("r", Config.NODE_ADD_BUTTON_RADIUS);
    addButton.setAttribute("fill", Config.NODE_ADD_BUTTON_FILL_COLOR_DEEMPHASIZED);
    addButton.setAttribute("fill-opacity", Config.NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED);
    addButton.setAttribute("stroke", Config.NODE_ADD_BUTTON_STROKE_COLOR);
    addButton.setAttribute("stroke-width", Config.NODE_ADD_BUTTON_STROKE_WIDTH);
    addButton.setAttribute("stroke-opacity", Config.NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED);
    addButton.setAttribute("display", "none");
    return addButton;
}

function createAddIcon(id) {
    let addIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    addIcon.setAttribute("id", id);
    addIcon.setAttribute("width", Config.NODE_ADD_ICON_WIDTH);
    addIcon.setAttribute("height", Config.NODE_ADD_ICON_HEIGHT);
    addIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
    addIcon.setAttribute("href", Config.NODE_ADD_ICON_SRC);

    return addIcon;
}

function createSwitchIcon(id) {
    let switchIcon = document.createElementNS("http://www.w3.org/2000/svg", "image");
    switchIcon.setAttribute("id", id);
    switchIcon.setAttribute("width", Config.NODE_SWITCH_ICON_WIDTH);
    switchIcon.setAttribute("height", Config.NODE_SWITCH_ICON_HEIGHT);
    switchIcon.setAttribute("opacity", Config.NODE_ICON_OPACITY_DEEMPHASIZED);
    switchIcon.setAttribute("href", Config.NODE_SWITCH_ICON_SRC);

    return switchIcon;
}

function createTimelineElements() {
    let timelineElements = {},
    timeline = document.createElementNS("http://www.w3.org/2000/svg", "line"),
    description = document.createElementNS("http://www.w3.org/2000/svg", "text");

    timeline.setAttribute("id", Config.TIMELINE_ID);
    timeline.setAttribute("x1", Config.TIMELINE_X1);
    timeline.setAttribute("x2", Config.TIMELINE_X2);
    timeline.setAttribute("stroke", Config.TIMELINE_COLOR);
    timeline.setAttribute("stroke-width", Config.TIMELINE_STROKE_WIDTH);
    timeline.setAttribute("stroke-opacity", Config.TIMELINE_STROKE_OPACITY_DEEMPHASIZED);
    timeline.setAttribute("display", "none");

    description.setAttribute("id", Config.TIMELINE_DESCRIPTION_ID);
    description.setAttribute("text-anchor", Config.TIMELINE_DESCRIPTION_TEXT_ANCHOR);
    description.setAttribute("fill", Config.TIMELINE_DESCRIPTION_COLOR);
    description.setAttribute("font-family", Config.TIMELINE_DESCRIPTION_FONT_FAMILY);
    description.setAttribute("font-size", Config.TIMELINE_DESCRIPTION_FONT_SIZE);
    description.setAttribute("font-weight", Config.TIMELINE_DESCRIPTION_FONT_WEIGHT);
    description.setAttribute("fill-opacity", Config.TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    description.setAttribute("display", "none");
    description.innerHTML = Config.TIMELINE_DESCRIPTION_TEXT;

    timelineElements.timeline = timeline;
    timelineElements.description = description;
    
    return timelineElements;
}

function createTimelineLabelStroke(labelPosition, isGreater) {
    let stroke = document.createElementNS("http://www.w3.org/2000/svg", "line");

    stroke.setAttribute("id", Config.TIMELINE_LABEL_STROKE_ID);
    stroke.setAttribute("x1", labelPosition.x);
    stroke.setAttribute("x2", labelPosition.x);
    stroke.setAttribute("stroke", Config.TIMELINE_COLOR);
    if (isGreater) {
        stroke.setAttribute("y1", labelPosition.y - Config.TIMELINE_LABEL_STROKE_OFFSET_Y_GREATER);
        stroke.setAttribute("y2", labelPosition.y + Config.TIMELINE_LABEL_STROKE_OFFSET_Y_GREATER);
        stroke.setAttribute("stroke-width", Config.TIMELINE_LABEL_STROKE_WIDTH_GREATER);
    }
    else {
        stroke.setAttribute("y1", labelPosition.y - Config.TIMELINE_LABEL_STROKE_OFFSET_Y);
        stroke.setAttribute("y2", labelPosition.y + Config.TIMELINE_LABEL_STROKE_OFFSET_Y);
        stroke.setAttribute("stroke-width", Config.TIMELINE_LABEL_STROKE_WIDTH_NORMAL);
    }
    stroke.setAttribute("stroke-opacity", Config.TIMELINE_LABEL_STROKE_OPACITY_DEEMPHASIZED);
    stroke.setAttribute("isGreater", isGreater);

    return stroke;
}

function createTimelineLabelDescription(labelPosition, descriptionLines, isGreater) {
    let description = document.createElementNS("http://www.w3.org/2000/svg", "text"),
    newLine;
    description.innerHTML = descriptionLines[0];
    description.setAttribute("id", Config.TIMELINE_LABEL_DESCRIPTION_ID);
    description.setAttribute("x", labelPosition.x);
    description.setAttribute("font-family", Config.TIMELINE_LABEL_DESCRIPTION_FONT_FAMILY);
    description.setAttribute("text-anchor", Config.TIMELINE_LABEL_DESCRIPTION_TEXT_ANCHOR);
    description.setAttribute("fill", Config.TIMELINE_LABEL_DESCRIPTION_COLOR);
    description.setAttribute("font-weight", Config.TIMELINE_LABEL_DESCRIPTION_FONT_WEIGHT);
    if (isGreater) {
        description.setAttribute("y", labelPosition.y - Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_GREATER);
        description.setAttribute("font-size", Config.TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_GREATER);
    }
    else {
        description.setAttribute("y", labelPosition.y - Config.TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y);
        description.setAttribute("font-size", Config.TIMELINE_LABEL_DESCRIPTION_FONT_SIZE);
    }
    description.setAttribute("fill-opacity", Config.TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    description.setAttribute("isGreater", isGreater);
    newLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    newLine.setAttribute("x", labelPosition.x);
    newLine.setAttribute("dy", Config.LINE_SPACING_SMALL);
    newLine.innerHTML = descriptionLines[1];
    description.appendChild(newLine);
    return description;
}

export default new SvgFactory();