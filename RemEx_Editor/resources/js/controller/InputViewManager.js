import Config from "../utils/Config.js";
import ExperimentInputView from "../views/InputView/ExperimentInputView.js";
import ExperimentGroupInputView from "../views/InputView/ExperimentGroupInputView.js";

class InputViewManager {

    initInputViews(eventListener) {
        this.focusedInputView = undefined;
        this.focusedInputViewData = undefined;
        this.inputViews = [];
        ExperimentInputView.init();
        ExperimentGroupInputView.init();
        for (let listener of eventListener) {
            ExperimentInputView.addEventListener(listener.eventType, listener.callback);
            ExperimentGroupInputView.addEventListener(listener.eventType, listener.callback);
        }
        this.inputViews.push(ExperimentInputView);
        this.inputViews.push(ExperimentGroupInputView);
    }

    showInputView(node, inputData, showPermanent) {
        let inputViewToShow;
    
        if (node.type === Config.TYPE_EXPERIMENT) {
            inputViewToShow = ExperimentInputView;
        }
        else if (node.type === Config.TYPE_EXPERIMENT_GROUP) {
            inputViewToShow = ExperimentGroupInputView;
        }
        // TODO
        else {
            throw "TypeError: The node type \"" + node.type + "\" is not defined.";
        }
        if (showPermanent) {
            // The input view is shown permanently
            inputViewToShow.correspondingNode = node;
            this.focusedInputView = inputViewToShow;
            this.focusedInputViewData = inputData;
        }
        else {
            // The input view is only shown while hovering over the node
        }
        for (let inputView of this.inputViews) {
            inputView.hide();
        }
        inputViewToShow.show(inputData);
    }

    showFocusedInputView() {
        for (let inputView of this.inputViews) {
            inputView.hide();
        }
        if (this.focusedInputView !== undefined) {
            this.focusedInputView.show(this.focusedInputViewData);
        }
    }

    updateFocusedInputView(inputData) {
        this.focusedInputViewData = inputData;
    }

    selectInputField() {
        for (let inputView of this.inputViews) {
            inputView.selectFirstInput();
        }
    }
}

export default new InputViewManager();