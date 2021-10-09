import Config from "../../utils/Config.js";
import Question from "./Question.js";

class ChoiceQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_CHOICE, "Neue Auswahlfrage");
        this.choiceType = Config.CHOICE_TYPE_SINGLE_CHOICE;
        this.answers = [];
    }
}

export default ChoiceQuestion;