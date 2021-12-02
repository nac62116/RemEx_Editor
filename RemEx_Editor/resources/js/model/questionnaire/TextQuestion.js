import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TextQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_TEXT, Config.NEW_TEXT_QUESTION_NAME + id);
    }
}

export default TextQuestion;