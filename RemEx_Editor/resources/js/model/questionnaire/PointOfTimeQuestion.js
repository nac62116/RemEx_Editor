/* eslint-env browser */

import Config from "../../utils/Config.js";
import Question from "./Question.js";

class PointOfTimeQuestion extends Question {

    constructor(id, nextQuestionId) {
        super(id, Config.QUESTION_TYPE_POINT_OF_TIME, nextQuestionId);
        this.pointOfTimeTypes = [];
    }

    getPointOfTimeTypes() {
        return this.pointOfTimeTypes;
    }

    addPointOfTimeType(pointOfTimeType) {
        if (!this.pointOfTimeTypes.includes(pointOfTimeType)) {
            this.pointOfTimeTypes.push(pointOfTimeType);
        }
    }

    removePointOfTimeType(pointOfTimeType) {
        let index = this.pointOfTimeTypes.indexOf(pointOfTimeType);
        if (index !== -1) {
            this.pointOfTimeTypes.splice(index, 1);
        }
    }
}

export default PointOfTimeQuestion;