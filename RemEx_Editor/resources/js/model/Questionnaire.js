import Config from "../utils/Config.js";
import Step from "./Step.js";

class Questionnaire extends Step {

    constructor(id) {
        super(id, Config.STEP_TYPE_QUESTIONNAIRE, Config.NEW_QUESTIONNAIRE_NAME + id);
        this.questions = [];
    }
}

export default Questionnaire;