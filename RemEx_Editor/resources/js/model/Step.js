import Config from "../utils/Config.js";

class Step {

    constructor(id, type, name) {
        // Can't be instantiated
        if (new.target === Step) {
            throw new TypeError(Config.STEP_CONSTRUCTOR_ERROR);
        }
        this.id = id;
        this.name = name;
        this.type = type;
        this.waitForStep = 0;
        this.nextStepId = null;
        this.previousStepId = null;
    }
}

export default Step;