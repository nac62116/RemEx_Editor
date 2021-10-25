import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TextQuestion extends Question {

    constructor() {
        TextQuestion.instanceCount = (TextQuestion.instanceCount || 0) + 1;
        super(Config.QUESTION_TYPE_TEXT, "Neue Textfrage " + TextQuestion.instanceCount);
    }
}

export default TextQuestion;