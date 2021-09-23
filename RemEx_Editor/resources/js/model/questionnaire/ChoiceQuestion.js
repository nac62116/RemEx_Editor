import Config from "../../utils/Config.js";
import Question from "./Question.js";

class ChoiceQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_CHOICE);
        this.choiceType = null;
        this.answers = [];
    }
}

export default ChoiceQuestion;