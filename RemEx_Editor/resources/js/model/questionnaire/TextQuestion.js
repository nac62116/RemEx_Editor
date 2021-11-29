import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TextQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_TEXT, "Neue Textfrage " + id);
    }
}

export default TextQuestion;