/* eslint-env browser */

class Question {

    constructor(properties) {
        if (new.target === Question) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        // Unique
        this.id = properties.id;
        // TODO: JSON value should be named "@type"
        this.type = properties.type;
        // Unique
        this.name = properties.name;
        this.text = properties.text;
        this.hint = properties.hint;
        this.nextQuestionId = properties.nextQuestionId;
    }
}

export default Question;