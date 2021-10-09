import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TextQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_TEXT, "Neue Textfrage");
    }
}

export default TextQuestion;