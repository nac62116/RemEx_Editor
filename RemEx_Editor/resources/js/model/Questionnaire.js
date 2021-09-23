import Config from "../utils/Config.js";
import Step from "./Step.js";

class Questionnaire extends Step {

    constructor() {
        super(Config.STEP_TYPE_QUESTIONNAIRE);
        this.questions = [];
    }
}

export default Questionnaire;