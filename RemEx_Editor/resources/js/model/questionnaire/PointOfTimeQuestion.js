import Config from "../../utils/Config.js";
import Question from "./Question.js";

class PointOfTimeQuestion extends Question {

    constructor() {
        PointOfTimeQuestion.instanceCount = (PointOfTimeQuestion.instanceCount || 0) + 1;
        super(Config.QUESTION_TYPE_POINT_OF_TIME, "Neue Zeitpunktfrage " + PointOfTimeQuestion.instanceCount);
        this.pointOfTimeTypes = [Config.POINT_OF_TIME_TYPE_DATE];
    }
}

export default PointOfTimeQuestion;