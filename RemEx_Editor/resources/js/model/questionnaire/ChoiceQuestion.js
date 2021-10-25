import Config from "../../utils/Config.js";
import Question from "./Question.js";

class ChoiceQuestion extends Question {

    constructor() {
        ChoiceQuestion.instanceCount = (ChoiceQuestion.instanceCount || 0) + 1;
        super(Config.QUESTION_TYPE_CHOICE, "Neue Auswahlfrage " + ChoiceQuestion.instanceCount);
        this.choiceType = Config.CHOICE_TYPE_SINGLE_CHOICE;
        this.answers = [];
    }
}

export default ChoiceQuestion;