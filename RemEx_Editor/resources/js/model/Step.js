/* eslint-env browser */

import Config from "../utils/Config.js";

class Step {

    constructor(id, type) {
        if (new.target === Step) {
            throw new TypeError(Config.STEP_CONSTRUCTOR_ERROR);
        }
        // Unique
        this.id = id;
        // TODO: JSON value should be named "@type"
        this.type = type;
        this.waitForStep = 0;
        this.nextStepId = 0;
    }
}

export default Step;