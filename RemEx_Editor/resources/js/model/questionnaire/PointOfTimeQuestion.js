import Config from "../../utils/Config.js";
import Question from "./Question.js";

class PointOfTimeQuestion extends Question {

    constructor() {
        super(Config.QUESTION_TYPE_POINT_OF_TIME, "Neue Zeitpunktfrage");
        this.pointOfTimeTypes = [Config.POINT_OF_TIME_TYPE_DATE];
    }
}

export default PointOfTimeQuestion;