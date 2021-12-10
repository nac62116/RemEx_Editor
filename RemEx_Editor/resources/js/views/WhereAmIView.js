import Config from "../utils/Config.js";
import SvgFactory from "../utils/SvgFactory.js";
import RootNode from "./nodeView/RootNode.js";

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

class WhereAmIView {

    init(whereAmIViewContainer) {
        this.whereAmIViewElement = whereAmIViewContainer.firstElementChild;
        this.rootPoint = {
            x: whereAmIViewContainer.clientWidth / 2, // eslint-disable-line no-magic-numbers
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
        if (currentSelection !== undefined) {
            for (let i = currentSelection.length - 1; i >= 0; i--) {
                representingNodeElements = SvgFactory.createRootNodeElements(undefined);
                representingNodeElements.nodeBody.setAttribute("height", Config.WHERE_AM_I_NODE_HEIGHT);
                representingNode = new RootNode(representingNodeElements, undefined, undefined, currentSelection[i].description);
                representingNode.updatePosition(this.rootPoint.x, this.rootPoint.y + rootPointOffsetY);
                representingNode.nodeElements.nodeDescription.setAttribute("x", representingNode.center.x);
                representingNode.nodeElements.nodeDescription.setAttribute("y", representingNode.center.y - Config.WHERE_AM_I_NODE_DESCRIPTION_CENTER_OFFSET_Y);
                for (let newLine of representingNode.nodeElements.nodeDescription.children) {
                    newLine.setAttribute("x", representingNode.center.x);
                    newLine.setAttribute("y", representingNode.center.y - Config.WHERE_AM_I_NODE_DESCRIPTION_CENTER_OFFSET_Y);
                }
                representingNode.addEventListener(Config.EVENT_NODE_MOUSE_ENTER, onRepresentingNodeMouseEnter.bind(this));
                representingNode.addEventListener(Config.EVENT_NODE_MOUSE_LEAVE, onRepresentingNodeMouseLeave.bind(this));
                representingNode.addEventListener(Config.EVENT_NODE_CLICKED, onRepresentingNodeClicked.bind(this));
                if (i === 0) {
                    representingNode.emphasize();
                    representingNode.focus();
                }
    
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
}

function onRepresentingNodeMouseEnter(event) {
    if (!event.data.target.isFocused) {
        event.data.target.emphasize();
    }
}

function onRepresentingNodeMouseLeave(event) {
    if (!event.data.target.isFocused) {
        event.data.target.deemphasize();
    }
}

function onRepresentingNodeClicked(event) {
    let representingNode = event.data.target,
    actualNode = this.representationMap.get(representingNode);

    actualNode.click();
}

export default new WhereAmIView();