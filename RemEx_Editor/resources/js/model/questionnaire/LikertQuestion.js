import Config from "../../utils/Config.js";
import Question from "./Question.js";

class LikertQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_LIKERT);
        this.scaleMinimumLabel = null;
        this.scaleMaximumLabel = null;
        this.initialValue = null;
        this.itemCount = null;
    }
}

export default LikertQuestion;