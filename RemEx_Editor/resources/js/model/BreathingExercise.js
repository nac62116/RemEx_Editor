/* eslint-env browser */

import Config from "../utils/Config.js";
import Step from "./Step.js";

class BreathingExercise extends Step {

    constructor(properties) {
        super(properties.id, Config.STEP_TYPE_BREATHING_EXERCISE);
        // Max duration = 60
        this.durationInMin = properties.durationInMin;
        this.breathingFrequencyInSec = properties.breathingFrequencyInSec;
        this.mode = properties.mode;
        
    }
}

export default BreathingExercise;