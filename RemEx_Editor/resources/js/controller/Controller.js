/* eslint-env broswer */

import Config from "../utils/Config.js";
import TreeNodeView from "../views/TreeNodeView.js";
import TreeView from "../views/TreeView.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO: Input checks:
// - Checking if bad characters like ", {}, etc. are automatically escaped
// - Defining max characters for several input fields
// - Input fields that allow only one type or type check after input
// - Format checks inside the views input fields (Delete the ones without usage in the model)

// ENHANCEMENT: Calculate the optimal duration for a survey depending on its steps

class Controller {

    init() {
        let treeViewContainerElement,
        testNode,
        testNode1,
        testNode2,
        testNode3,
        testNode4,
        testNode5,
        testNode6,
        parentOutputPoint;

        // TODO: Get experiment from local storage

        // Init TreeView
        treeViewContainerElement = document.querySelector("#" + Config.TREE_VIEW_CONTAINER_ID);
        TreeView.setElement(treeViewContainerElement);

        // Create test nodes
        parentOutputPoint = {
            x: TreeView.getWidth() / 2,
            y: 0,
        }
        // If description.length > 25 -> cut to 20 -> append "..."
        testNode = new TreeNodeView(1, 75, TreeView.getHeight() / 2, parentOutputPoint, Config.NODE_TYPE_EXPERIMENT, "Name");
        testNode1 = new TreeNodeView(1, 200, TreeView.getHeight() / 2, parentOutputPoint, Config.NODE_TYPE_EXPERIMENT_GROUP, "Längerer Name");
        testNode2 = new TreeNodeView(1, 325, TreeView.getHeight() / 2, parentOutputPoint, Config.NODE_TYPE_INSTRUCTION, "Ziemlich langer Name");
        testNode3 = new TreeNodeView(1, 450, TreeView.getHeight() / 2, parentOutputPoint, Config.NODE_TYPE_BREATHING_EXERCISE, "Längster erlaubter Name f...");
        testNode4 = new TreeNodeView(1, 575, TreeView.getHeight() / 2, parentOutputPoint, Config.NODE_TYPE_QUESTIONNAIRE, "1 34 678 1234 56789 123456 789");
        testNode5 = new TreeNodeView(1, 700, TreeView.getHeight() / 2, parentOutputPoint, Config.NODE_TYPE_QUESTION, "Name");
        testNode6 = new TreeNodeView(1, 825, TreeView.getHeight() / 2, parentOutputPoint, Config.NODE_TYPE_NEW, Config.NODE_TYPE_NEW_DESCRIPTION);
        TreeView.insertNodeView(testNode.getElements());
        TreeView.insertNodeView(testNode1.getElements());
        TreeView.insertNodeView(testNode2.getElements());
        TreeView.insertNodeView(testNode3.getElements());
        TreeView.insertNodeView(testNode4.getElements());
        TreeView.insertNodeView(testNode5.getElements());
        TreeView.insertNodeView(testNode6.getElements());
    }
    
}

export default new Controller();