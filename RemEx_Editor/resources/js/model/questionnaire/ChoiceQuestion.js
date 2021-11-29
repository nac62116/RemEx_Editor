import Config from "../../utils/Config.js";
import Question from "./Question.js";

class ChoiceQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_CHOICE, "Neue Auswahlfrage " + id);
        this.choiceType = Config.CHOICE_TYPE_SINGLE_CHOICE;
        this.answers = [];
    }
}

export default ChoiceQuestion;