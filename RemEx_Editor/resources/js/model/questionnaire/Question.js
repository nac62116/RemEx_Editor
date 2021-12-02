import Config from "../../utils/Config.js";

class Question {

    constructor(id, type, name) {
        if (new.target === Question) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.id = id;
        this.type = type;
        this.name = name;
        this.text = Config.NEW_QUESTION_TEXT;
        this.hint = Config.NEW_QUESTION_HINT;
        this.nextQuestionId = null;
        this.previousQuestionId = null;
    }
}

export default Question;