import Config from "../utils/Config.js";
import Step from "./Step.js";

class Questionnaire extends Step {

    constructor() {
        Questionnaire.instanceCount = (Questionnaire.instanceCount || 0) + 1;
        super(Config.STEP_TYPE_QUESTIONNAIRE, "Neuer Fragebogen " + Questionnaire.instanceCount);
        this.questions = [];
    }
}

export default Questionnaire;