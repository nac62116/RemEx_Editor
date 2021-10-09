class Question {

    constructor(type, name) {
        if (new.target === Question) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.id = null;
        // TODO: JSON value should be named "@type"
        this.type = type;
        this.name = name;
        this.text = "Text";
        this.hint = "Tipp";
        this.nextQuestionId = null;
    }
}

export default Question;