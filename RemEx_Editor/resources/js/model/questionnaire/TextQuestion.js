import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TextQuestion extends Question {

    constructor(id, nextQuestionId) {
        super(id, Config.QUESTION_TYPE_TEXT, nextQuestionId);
    }
}

export default TextQuestion;