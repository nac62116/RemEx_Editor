import Config from "../utils/Config.js";

class Step {

    constructor(id, name, type, nextStepId) {
        // Can't be instantiated
        if (new.target === Step) {
            throw new TypeError(Config.STEP_CONSTRUCTOR_ERROR);
        }
        // Unique
        this.id = id;
        this.name = name;
        // TODO: JSON value should be named "@type"
        this.type = type;
        this.waitForStep = 0;
        this.nextStepId = nextStepId;
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    getWaitForStep() {
        return this.id;
    }

    setWaitForStep(waitForStep) {
        this.waitForStep = waitForStep;
    }

    getNextStepId() {
        return this.nextStepId;
    }

    setNextStepId(nextStepId) {
        this.nextStepId = nextStepId;
    }
}

export default Step;