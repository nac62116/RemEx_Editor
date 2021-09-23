import Config from "../../utils/Config.js";
import Question from "./Question.js";

class PointOfTimeQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_POINT_OF_TIME);
        this.pointOfTimeTypes = [];
    }
}

export default PointOfTimeQuestion;