class Answer {

    constructor() {
        Answer.instanceCount = (Answer.instanceCount || 0) + 1;
        this.id = null;
        this.code = "Code " + Answer.instanceCount;
        this.text = "Antworttext";
        this.nextQuestionId = null;
    }
}

export default Answer;