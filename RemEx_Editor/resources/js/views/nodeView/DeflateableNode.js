import Config from "../../utils/Config.js";
import StandardNode from "./StandardNode.js";

class DeflateableNode extends StandardNode {

    constructor(nodeElements, id, type, description, parentNode) {
        super(nodeElements, id, type, description, parentNode); 
    }

    show() {
        super.show();
        this.nodeElements.nodeDescription.setAttribute("display", "none");
    }

    emphasize() {
        let offsetVector = {
            x: (Config.NODE_BODY_WIDTH / 2 - Config.NODE_BODY_WIDTH_DEFLATED / 2) * -1, // eslint-disable-line no-magic-numbers
            y: (Config.NODE_BODY_HEIGHT / 2 - Config.NODE_BODY_HEIGHT_DEFLATED / 2) * -1, // eslint-disable-line no-magic-numbers
        },
        parentOutputPoint = this.parentNode.bottom,
        bezierReferencePoint = {
            x: parentOutputPoint.x,
            y: (parentOutputPoint.y + ((this.top.y + offsetVector.y - parentOutputPoint.y) / 4)), // eslint-disable-line no-magic-numbers
        };
        super.emphasize();
        if (!this.isFocused) {
            this.nodeElements.nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH);
            this.nodeElements.nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT);
            this.nodeElements.nodeBody.setAttribute("x", this.nodeElements.nodeBody.getAttribute("x") * 1 + offsetVector.x);
            this.nodeElements.nodeBody.setAttribute("y", this.nodeElements.nodeBody.getAttribute("y") * 1 + offsetVector.y);
            this.nodeElements.nodeDescription.removeAttribute("display");
            this.nodeElements.inputPath.setAttribute("d", "M " + parentOutputPoint.x + " " + parentOutputPoint.y + " Q " + bezierReferencePoint.x + " " + bezierReferencePoint.y + ", " + (parentOutputPoint.x + ((this.top.x - parentOutputPoint.x) / 2)) + " " + (parentOutputPoint.y + ((this.top.y + offsetVector.y - parentOutputPoint.y) / 2)) + " T " + this.top.x + " " + (this.top.y + offsetVector.y)); // eslint-disable-line no-magic-numbers
        }
    }

    deemphasize() {
        let offsetVector = {
            x: (Config.NODE_BODY_WIDTH / 2 - Config.NODE_BODY_WIDTH_DEFLATED / 2), // eslint-disable-line no-magic-numbers
            y: (Config.NODE_BODY_HEIGHT / 2 - Config.NODE_BODY_HEIGHT_DEFLATED / 2), // eslint-disable-line no-magic-numbers
        },
        parentOutputPoint = this.parentNode.bottom,
        bezierReferencePoint = {
            x: parentOutputPoint.x,
            y: (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 4)), // eslint-disable-line no-magic-numbers
        },
        isEmphasized = this.isEmphasized;
        super.deemphasize();
        if (!this.isFocused && isEmphasized) {
            this.nodeElements.nodeBody.setAttribute("width", Config.NODE_BODY_WIDTH_DEFLATED);
            this.nodeElements.nodeBody.setAttribute("height", Config.NODE_BODY_HEIGHT_DEFLATED);
            this.nodeElements.nodeBody.setAttribute("x", this.nodeElements.nodeBody.getAttribute("x") * 1 + offsetVector.x);
            this.nodeElements.nodeBody.setAttribute("y", this.nodeElements.nodeBody.getAttribute("y") * 1 + offsetVector.y);
            this.nodeElements.nodeDescription.setAttribute("display", "none");
            this.nodeElements.inputPath.setAttribute("d", "M " + parentOutputPoint.x + " " + parentOutputPoint.y + " Q " + bezierReferencePoint.x + " " + bezierReferencePoint.y + ", " + (parentOutputPoint.x + ((this.top.x - parentOutputPoint.x) / 2)) + " " + (parentOutputPoint.y + ((this.top.y - parentOutputPoint.y) / 2)) + " T " + (this.top.x) + " " + (this.top.y)); // eslint-disable-line no-magic-numbers
        }
    }
}

export default DeflateableNode;