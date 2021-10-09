import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TimeIntervalQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_TIME_INTERVAL, "Neue Zeitraumfrage");
        this.timeIntervalTypes = [Config.TIME_INTERVAL_TYPE_DAYS];
    }
}

export default TimeIntervalQuestion;