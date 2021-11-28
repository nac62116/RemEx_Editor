import Config from "../../utils/Config.js";

class Answer {

    constructor() {
        Answer.instanceCount = (Answer.instanceCount || 0) + 1;
        this.id = null;
        this.type = Config.TYPE_ANSWER;
        this.code = "Code " + Answer.instanceCount;
        this.text = "Antworttext";
        this.nextQuestionId = null;
    }
}

export default Answer;