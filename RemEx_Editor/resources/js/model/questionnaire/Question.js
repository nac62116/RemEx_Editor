import Config from "../../utils/Config.js";

class Question {

    constructor(id, type, nextQuestionId) {
        if (new.target === Question) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        // Unique
        this.id = id;
        // TODO: JSON value should be named "@type"
        this.type = type;
        // Unique
        this.name = undefined;
        this.text = undefined;
        this.hint = null;
        this.nextQuestionId = nextQuestionId;
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getText() {
        return this.text;
    }

    setText(text) {
        this.text = text;
    }

    getHint() {
        return this.hint;
    }

    setHint(hint) {
        this.hint = hint;
    }

    getNextQuestionId() {
        return this.nextQuestionId;
    }

    setNextQuestionId(nextQuestionId) {
        this.nextQuestionId = nextQuestionId;
    }

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