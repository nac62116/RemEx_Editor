class Question {

    constructor(id, type, name) {
        if (new.target === Question) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.id = id;
        this.type = type;
        this.name = name;
        this.text = "Text";
        this.hint = "Hinweis";
        this.nextQuestionId = null;
        this.previousQuestionId = null;
    }
}

export default Question;