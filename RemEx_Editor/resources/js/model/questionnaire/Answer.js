import Config from "../../utils/Config.js";

class Answer {

    constructor(nextQuestionId) {
        // Unique
        this.code = undefined;
        this.text = undefined;
        this.nextQuestionId = nextQuestionId;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
    }

    getText() {
        return this.text;
    }

    setText(text) {
        this.text = text;
    }

    getNextQuestionId() {
        return this.nextQuestionId;
    }

    setNextQuestionId(nextQuestionId) {
        this.nextQuestionId = nextQuestionId;
    }

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