import Config from "../utils/Config.js";
import SvgFactory from "../utils/SvgFactory.js";
import RootNode from "./nodeView/RootNode.js";

class WhereAmIView {

    init(whereAmIViewContainer) {
        this.whereAmIViewElement = whereAmIViewContainer.firstElementChild;
        this.rootPoint = {
            x: this.whereAmIViewElement.clientWidth / 2, // eslint-disable-line no-magic-numbers
            y: Config.WHERE_AM_I_VIEW_ROOT_POINT_Y,
        };
        this.representationMap = new Map();
    }

    update(currentSelection) {
        let rootPointOffsetY = 0,
        representingNodeElements,
        representingNode;

        while (this.whereAmIViewElement.lastChild) {
            this.whereAmIViewElement.removeChild(this.whereAmIViewElement.lastChild);
        }
        this.representationMap.clear();
        for (let i = currentSelection.length - 1; i >= 0; i--) {
            representingNodeElements = SvgFactory.createRootNodeElements();
            representingNodeElements.nodeBody.setAttribute("height", Config.WHERE_AM_I_NODE_HEIGHT);
            representingNode = new RootNode(representingNodeElements, undefined, undefined, currentSelection[i].description);
            representingNode.updatePosition(this.rootPoint.x, this.rootPoint.y + rootPointOffsetY, true);
            representingNode.nodeElements.nodeDescription.setAttribute("x", representingNode.center.x);
            representingNode.nodeElements.nodeDescription.setAttribute("y", representingNode.center.y - Config.WHERE_AM_I_NODE_DESCRIPTION_CENTER_OFFSET_Y);
            for (let newLine of representingNode.nodeElements.nodeDescription.children) {
                newLine.setAttribute("x", representingNode.center.x);
                newLine.setAttribute("y", representingNode.center.y - Config.WHERE_AM_I_NODE_DESCRIPTION_CENTER_OFFSET_Y);
            }
            representingNode.addEventListener(Config.EVENT_NODE_MOUSE_ENTER, onRepresentingNodeMouseEnter.bind(this));
            representingNode.addEventListener(Config.EVENT_NODE_MOUSE_LEAVE, onRepresentingNodeMouseLeave.bind(this));
            representingNode.addEventListener(Config.EVENT_NODE_CLICKED, onRepresentingNodeClicked.bind(this));

            this.representationMap.set(representingNode, currentSelection[i]);
            this.whereAmIViewElement.appendChild(representingNodeElements.nodeBody);
            this.whereAmIViewElement.appendChild(representingNodeElements.nodeDescription);
            if (representingNodeElements.inputPath !== undefined) {
                this.whereAmIViewElement.appendChild(representingNodeElements.inputPath);
            }
            rootPointOffsetY += Config.WHERE_AM_I_NODE_DISTANCE;
        }
    }
}

function onRepresentingNodeMouseEnter(event) {
    event.data.target.emphasize();
}

function onRepresentingNodeMouseLeave(event) {
    event.data.target.deemphasize();
}

function onRepresentingNodeClicked(event) {
    let representingNode = event.data.target,
    actualNode = this.representationMap.get(representingNode);

    actualNode.click();
}

export default new WhereAmIView();