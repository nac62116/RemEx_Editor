import Config from "../utils/Config.js";
import Step from "./Step.js";

class BreathingExercise extends Step {

    constructor() {
        BreathingExercise.instanceCount = (BreathingExercise.instanceCount || 0) + 1;
        super(Config.STEP_TYPE_BREATHING_EXERCISE, "Neue Atemübung " + BreathingExercise.instanceCount);
        this.durationInMin = 1;
        this.breathingFrequencyInSec = 5;
        this.mode = Config.BREATHING_MODE_MOVING_CIRCLE;
    }
}

export default BreathingExercise;