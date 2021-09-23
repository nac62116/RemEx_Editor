import Config from "../../utils/Config.js";

class Question {

    constructor(type) {
        if (new.target === Question) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        // Unique
        this.id = null;
        // TODO: JSON value should be named "@type"
        this.type = type;
        // Unique
        this.name = null;
        this.text = null;
        this.hint = null;
        this.nextQuestionId = null;
    }
    // TODO: Outsource to InputValidationManager
    isValid(questions) {
        for (let question of questions) {
            if (question.getName() === this.name) {
                return Config.QUESTION_NAME_NOT_UNIQUE;
            }
        }
        return true;
    }
}

export default Question;