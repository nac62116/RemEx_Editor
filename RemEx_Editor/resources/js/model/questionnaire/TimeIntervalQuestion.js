import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TimeIntervalQuestion extends Question {

    constructor() {
        TimeIntervalQuestion.instanceCount = (TimeIntervalQuestion.instanceCount || 0) + 1;
        super(Config.QUESTION_TYPE_TIME_INTERVAL, "Neue Zeitraumfrage " + TimeIntervalQuestion.instanceCount);
        this.timeIntervalTypes = [Config.TIME_INTERVAL_TYPE_DAYS];
    }
}

export default TimeIntervalQuestion;