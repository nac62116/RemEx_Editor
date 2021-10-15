class Question {

    constructor(type, name) {
        if (new.target === Question) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.id = null;
        this.type = type;
        this.name = name;
        this.text = "Text";
        this.hint = "Hinweis";
        this.nextQuestionId = null;
    }
}

export default Question;