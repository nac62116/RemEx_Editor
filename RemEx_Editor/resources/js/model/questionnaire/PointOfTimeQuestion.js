import Config from "../../utils/Config.js";
import Question from "./Question.js";

class PointOfTimeQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_POINT_OF_TIME, Config.NEW_POINT_OF_TIME_QUESTION_NAME + id);
        this.pointOfTimeTypes = [Config.POINT_OF_TIME_TYPE_DATE];
    }
}

export default PointOfTimeQuestion;