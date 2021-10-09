import Config from "../../utils/Config.js";
import Question from "./Question.js";

class LikertQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_LIKERT, "Neue Likertfrage");
        this.scaleMinimumLabel = "Sehr schlecht";
        this.scaleMaximumLabel = "Sehr gut";
        this.initialValue = 3;
        this.itemCount = 5;
    }
}

export default LikertQuestion;