/* eslint-env browser */

import Config from "../utils/Config.js";
import Step from "./Step.js";

class Questionnaire extends Step {

    constructor(properties) {
        super(properties.id, Config.STEP_TYPE_QUESTIONNAIRE);
        this.questions = [];
    }
}

export default Questionnaire;