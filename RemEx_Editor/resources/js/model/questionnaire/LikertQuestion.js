import Config from "../../utils/Config.js";
import Question from "./Question.js";

class LikertQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_LIKERT, Config.NEW_LIKERT_QUESTION_NAME + id);
        this.scaleMinimumLabel = Config.NEW_LIKERT_QUESTION_SCALE_MIN_LABEL;
        this.scaleMaximumLabel = Config.NEW_LIKERT_QUESTION_SCALE_MAX_LABEL;
        this.initialValue = Config.NEW_LIKERT_QUESTION_INITIAL_VALUE;
        this.itemCount = Config.NEW_LIKERT_QUESTION_ITEM_COUNT;
    }
}

export default LikertQuestion;