/* eslint-env browser */

import Config from "../../utils/Config.js";
import Question from "./Question.js";

class TimeIntervalQuestion extends Question {

    constructor(id, nextQuestionId) {
        super(id, Config.QUESTION_TYPE_TIME_INTERVAL, nextQuestionId);
        this.timeIntervalTypes = [];
    }

    getTimeIntervalTypes() {
        return this.timeIntervalTypes;
    }

    addTimeIntervalType(timeIntervalType) {
        if (!this.timeIntervalTypes.includes(timeIntervalType)) {
            this.timeIntervalTypes.push(timeIntervalType);
        }
    }

    removeTimeIntervalType(timeIntervalType) {
        let index = this.timeIntervalTypes.indexOf(timeIntervalType);
        if (index !== -1) {
            this.timeIntervalTypes.splice(index, 1);
        }
    }
}

export default TimeIntervalQuestion;