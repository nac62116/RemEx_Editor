import Config from "./Config.js";

class SvgFactory {

    createTreeViewElement(containerWidth, containerHeight) {
        let treeViewElement = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        background = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        treeViewElement.setAttribute("viewBox", "0 0 " + containerWidth + " " + containerHeight);
        background.setAttribute("x", "-150%");
        background.setAttribute("y", "-350%");
        background.setAttribute("width", "400%");
        background.setAttribute("height", "800%");
        background.setAttribute("fill", Config.TREE_VIEW_BACKGROUND_COLOR);
        background.setAttribute("fill-opacity", Config.TREE_VIEW_BACKGROUND_OPACITY);
        treeViewElement.appendChild(background);
        return treeViewElement;
    }

    createRootNodeElements(/* TODO: nodeIcon */) {
        let rootNodeElements = createMinimumNode(false);
        
        rootNodeElements.addChildButton = createAddNodeButton(Config.NODE_ADD_CHILD_BUTTON_ID);

        return rootNodeElements;
    }

    createStandardNodeElements() {
        let standardNodeElements = createMinimumNode(false);

        standardNodeElements.inputPath = createNodeInputPath();
        standardNodeElements.addNextButton = createAddNodeButton(Config.NODE_ADD_NEXT_BUTTON_ID);
        standardNodeElements.addPreviousButton = createAddNodeButton(Config.NODE_ADD_PREV_BUTTON_ID);
        standardNodeElements.addChildButton = createAddNodeButton(Config.NODE_ADD_CHILD_BUTTON_ID);

        return standardNodeElements;
    }

    createLeafNodeElements() {
        let leafNodeElements = createMinimumNode(false);

        leafNodeElements.inputPath = createNodeInputPath();
        leafNodeElements.addNextButton = createAddNodeButton(Config.NODE_ADD_NEXT_BUTTON_ID);
        leafNodeElements.addPreviousButton = createAddNodeButton(Config.NODE_ADD_PREV_BUTTON_ID);

        return leafNodeElements;
    }

    createDeflateableNodeElements() {
        let deflateableNodeElements = createMinimumNode(false);

        deflateableNodeElements.inputPath = createNodeInputPath();
        deflateableNodeElements.addChildButton = createAddNodeButton(Config.NODE_ADD_CHILD_BUTTON_ID);

        return deflateableNodeElements;
    }

    createTimelineElement() {
        let element;
        return element;
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

function createMinimumNode(isDeflateable) {
    let minimumNode = {
        nodeBody: createNodeBody(isDeflateable),
        nodeDescription: createNodeDescription(isDeflateable),
    };
    //TODO: insert node icon

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
    // nodeBody.setAttribute("focusable", false);

    return nodeBody;
}

function createNodeDescription(isDeflateable) {
    let nodeDescription = document.createElementNS("http://www.w3.org/2000/svg", "text"),
    secondLine,
    thirdLine;

    nodeDescription.setAttribute("id", Config.NODE_DESCRIPTION_FIRST_LINE_ID);
    nodeDescription.setAttribute("text-anchor", Config.NODE_DESCRIPTION_TEXT_ANCHOR);
    nodeDescription.setAttribute("fill", Config.NODE_DESCRIPTION_COLOR);
    nodeDescription.setAttribute("font-family", Config.NODE_DESCRIPTION_FONT_FAMILY);
    nodeDescription.setAttribute("font-size", Config.NODE_DESCRIPTION_FONT_SIZE);
    nodeDescription.setAttribute("font-weight", Config.NODE_DESCRIPTION_FONT_WEIGHT);
    nodeDescription.setAttribute("fill-opacity", Config.NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED);
    //nodeDescription.setAttribute("focusable", false);
    secondLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    secondLine.setAttribute("id", Config.NODE_DESCRIPTION_SECOND_LINE_ID);
    secondLine.setAttribute("dy", Config.LINE_SPACING);
    thirdLine.setAttribute("id", Config.NODE_DESCRIPTION_THIRD_LINE_ID);
    thirdLine.setAttribute("dy", Config.LINE_SPACING_TWO_LINES);
    if (isDeflateable) {
        nodeDescription.setAttribute("display", "none");
        secondLine.setAttribute("display", "none");
        thirdLine.setAttribute("display", "none");
    }
    nodeDescription.appendChild(secondLine);
    nodeDescription.appendChild(thirdLine);

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
    return addButton;
}

export default new SvgFactory();