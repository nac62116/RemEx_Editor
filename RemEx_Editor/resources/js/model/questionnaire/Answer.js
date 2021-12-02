import Config from "../../utils/Config.js";

class Answer {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_ANSWER;
        this.code = Config.NEW_ANSWER_CODE + id;
        this.text = Config.NEW_ANSWER_TEXT;
        this.nextQuestionId = null;
    }
}

export default Answer;