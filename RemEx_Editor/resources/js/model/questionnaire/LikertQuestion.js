import Config from "../../utils/Config.js";
import Question from "./Question.js";

class LikertQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_LIKERT, "Neue Likertfrage " + id);
        this.scaleMinimumLabel = "Sehr schlecht";
        this.scaleMaximumLabel = "Sehr gut";
        this.initialValue = 1;
        this.itemCount = 5;
    }
}

export default LikertQuestion;