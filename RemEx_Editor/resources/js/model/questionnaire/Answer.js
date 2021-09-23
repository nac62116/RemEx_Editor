import Config from "../../utils/Config.js";

class Answer {

    constructor() {
        this.id = null;
        // Unique
        this.code = null;
        this.text = null;
        this.nextQuestionId = null;
    }
    // TODO: Outsource to InputValidationManager
    isValid(answers) {
        for (let answer of answers) {
            if (answer.getCode() === this.code) {
                return Config.ANSWER_CODE_NOT_UNIQUE;
            }
        }
        return true;
    }
}

export default Answer;