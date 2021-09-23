import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TimeIntervalQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_TIME_INTERVAL);
        this.timeIntervalTypes = [];
    }
}

export default TimeIntervalQuestion;