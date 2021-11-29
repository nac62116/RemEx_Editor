import Config from "../../utils/Config.js";

class Answer {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_ANSWER;
        this.code = "Code " + id;
        this.text = "Antworttext";
        this.nextQuestionId = null;
    }
}

export default Answer;