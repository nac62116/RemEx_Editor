import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TimeIntervalQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_TIME_INTERVAL, "Neue Zeitraumfrage " + id);
        this.timeIntervalTypes = [Config.TIME_INTERVAL_TYPE_DAYS];
    }
}

export default TimeIntervalQuestion;