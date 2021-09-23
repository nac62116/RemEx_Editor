import Config from "../utils/Config.js";
import Step from "./Step.js";

class BreathingExercise extends Step {

    constructor() {
        super(Config.STEP_TYPE_BREATHING_EXERCISE);
        // Max duration = 60
        this.durationInMin = null;
        this.breathingFrequencyInSec = null;
        this.mode = null;
    }
}

export default BreathingExercise;