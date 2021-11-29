import Config from "../utils/Config.js";
import Step from "./Step.js";

class BreathingExercise extends Step {

    constructor(id) {
        super(id, Config.STEP_TYPE_BREATHING_EXERCISE, "Neue Atemübung " + id);
        this.durationInMin = 1;
        this.breathingFrequencyInSec = 5;
        this.mode = Config.BREATHING_MODE_MOVING_CIRCLE;
    }
}

export default BreathingExercise;