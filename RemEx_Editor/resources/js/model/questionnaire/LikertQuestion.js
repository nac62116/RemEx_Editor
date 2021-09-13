import Config from "../../utils/Config.js";
import Question from "./Question.js";

class LikertQuestion extends Question {

    constructor(id, nextQuestionId) {
        super(id, Config.QUESTION_TYPE_LIKERT, nextQuestionId);
        this.scaleMinimumLabel = undefined;
        this.scaleMaximumLabel = undefined;
        this.initialValue = undefined;
        this.itemCount = undefined;
    }

    getScaleMinimumLabel() {
        return this.scaleMinimumLabel;
    }

    setScaleMinimumLabel(scaleMinimumLabel) {
        this.scaleMinimumLabel = scaleMinimumLabel;
    }

    getScaleMaximumLabel() {
        return this.scaleMaximumLabel;
    }

    setScaleMaximumLabel(scaleMaximumLabel) {
        this.scaleMaximumLabel = scaleMaximumLabel;
    }

    getInitialValue() {
        return this.initialValue;
    }

    setInitialValue(initialValue) {
        this.initialValue = Math.round(initialValue);
    }

    getItemCount() {
        return this.itemCount;
    }

    setItemCount(itemCount) {
        this.itemCount = Math.round(itemCount);
    }
}

export default LikertQuestion;