import Config from "../../utils/Config.js";
import Question from "./Question.js";

class LikertQuestion extends Question {

    constructor() {
        LikertQuestion.instanceCount = (LikertQuestion.instanceCount || 0) + 1;
        super(Config.QUESTION_TYPE_LIKERT, "Neue Likertfrage " + LikertQuestion.instanceCount);
        this.scaleMinimumLabel = "Sehr schlecht";
        this.scaleMaximumLabel = "Sehr gut";
        this.initialValue = 1;
        this.itemCount = 5;
    }
}

export default LikertQuestion;