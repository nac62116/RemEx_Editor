import Config from "../utils/Config.js";
import Step from "./Step.js";

class Questionnaire extends Step {

    constructor() {
        super(Config.STEP_TYPE_QUESTIONNAIRE, "Neuer Fragebogen");
        this.questions = [];
    }
}

export default Questionnaire;