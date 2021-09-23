import Config from "./Config.js";

class SvgFactory {

    createTreeViewElement() {
        let treeViewElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        background = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        //treeViewElement.setAttribute("viewBox", "0 0 " + containerWidth + " " + containerHeight);
        treeViewElement.setAttribute("width", Config.TREE_VIEW_WIDTH);
        treeViewElement.setAttribute("height", Config.TREE_VIEW_HEIGHT);
        background.setAttribute("width", Config.TREE_VIEW_BACKGROUND_WIDTH);
        background.setAttribute("height", Config.TREE_VIEW_BACKGROUND_HEIGHT);
        background.setAttribute("fill", Config.TREE_VIEW_BACKGROUND_COLOR);
        background.setAttribute("fill-opacity", Config.TREE_VIEW_BACKGROUND_OPACITY);
        treeViewElement.appendChild(background);
        return treeViewElement;
    }

    createRootNodeElements(/* TODO: nodeIcon */) {
        let rootNodeElements = createMinimumNode();
        
        rootNodeElements.addChildButton = createAddNodeButton(Config.NODE_ADD_CHILD_BUTTON_ID);

        return rootNodeElements;
    }

    createStandardNodeElements() {
        let standardNodeElements = createMinimumNode();

        standardNodeElements.inputPath = createNodeInputPath();
        standardNodeElements.addNextButton = createAddNodeButton(Config.NODE_ADD_NEXT_BUTTON_ID);
        standardNodeElements.addPreviousButton = createAddNodeButton(Config.NODE_ADD_PREV_BUTTON_ID);
        standardNodeElements.addChildButton = createAddNodeButton(Config.NODE_ADD_CHILD_BUTTON_ID);

        return standardNodeElements;
    }

    createLeafNodeElements() {
        let leafNodeElements = createMinimumNode();

        leafNodeElements.inputPath = createNodeInputPath();
        leafNodeElements.addNextButton = createAddNodeButton(Config.NODE_ADD_NEXT_BUTTON_ID);
        leafNodeElements.addPreviousButton = createAddNodeButton(Config.NODE_ADD_PREV_BUTTON_ID);

        return leafNodeElements;
    }

    createTimelineNodeElements() {
        let timelineNodeElements = this.createStandardNodeElements();

        timelineNodeElements.timelineElements = createTimelineElements();

        return timelineNodeElements;
    }

    createTimelineLabel() {
        let timelineLabel = {},
        stroke = createTimelineLabelStroke(),
        description = createTimelineLabelDescription();

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
        let element;
        return element;
    }

    createInputViewElement() {
        let element;
        return element;
    }

    createInfoViewElement() {
        let element;
        return element;
    }
}

function createMinimumNode() {
    let minimumNode = {
        nodeBody: createNodeBody(),
        nodeDescription: createNodeDescription(),
    };
    //TODO: insert node icon

    return minimumNode;
}

function createNodeBody() {
    let nodeBody = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    nodeBody.setAttribute("id", Config.NODE_BODY_ID);
    nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH);
    nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT);
    nodeBody.setAttribute("rx", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("ry", Config.NODE_BODY_BORDER_RADIUS);
    nodeBody.setAttribute("fill", Config.NODE_BODY_FILL_COLOR);
    nodeBody.setAttribute("stroke-width", Config.NODE_BODY_STROKE_WIDTH);
    nodeBody.setAttribute("stroke", Config.NODE_BODY_STROKE_COLOR);
    nodeBody.setAttribute("fill-opacity", Config.NODE_BODY_FILL_OPACITY_DEEMPHASIZED);
    nodeBody.setAttribute("stroke-opacity", Config.NODE_BODY_STROKE_OPACITY_DEEMPHASIZED);
    // nodeBody.setAttribute("focusable", false);

    return nodeBody;
}

function createNodeDescription() {
    let nodeDescription = document.createElementNS("http://www.w3.org/2000/svg", "text");

    nodeDescription.setAttribute("id", Config.NODE_DESCRIPTION_FIRST_LINE_ID);
    nodeDescription.setAttribute("text-anchor", Config.NODE_DESCRIPTION_TEXT_ANCHOR);
    nodeDescription.setAttribute("fill", Config.NODE_DESCRIPTION_COLOR);
    nodeDescription.setAttribute("font-family", Config.NODE_DESCRIPTION_FONT_FAMILY);
    nodeDescription.setAttribute("font-size", Config.NODE_DESCRIPTION_FONT_SIZE);
    nodeDescription.setAttribute("font-weight", Config.NODE_DESCRIPTION_FONT_WEIGHT);
    nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    //nodeDescription.setAttribute("focusable", false);

    return nodeDescription;
}

function createNodeInputPath() {
    let inputPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    inputPath.setAttribute("stroke-width", Config.NODE_INPUT_PATH_STROKE_WIDTH);
    inputPath.setAttribute("stroke", Config.NODE_INPUT_PATH_STROKE_COLOR);
    inputPath.setAttribute("stroke-opacity", Config.NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED);
    inputPath.setAttribute("fill", "transparent");

    return inputPath;
}

function createAddNodeButton(id) {
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
    description.setAttribute("x", Config.TIMELINE_DESCRIPTION_X);
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

export default new SvgFactory();