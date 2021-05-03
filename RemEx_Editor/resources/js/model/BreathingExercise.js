/* eslint-env browser */

import Config from "../utils/Config.js";
import Step from "./Step.js";

class BreathingExercise extends Step {

    constructor(id, nextStepId) {
        super(id, Config.STEP_TYPE_BREATHING_EXERCISE, nextStepId);
        // Max duration = 60
        this.durationInMin = undefined;
        this.breathingFrequencyInSec = undefined;
        this.mode = undefined;
    }
    
    getDurationInMin() {
        return this.durationInMin;
    }

    setDurationInMin(durationInMin) {
        this.durationInMin = Math.round(durationInMin);
    }

    getBreathingFrequencyInSec() {
        return this.breathingFrequencyInSec;
    }

    setBreathingFrequencyInSec(breathingFrequencyInSec) {
        this.breathingFrequencyInSec = Math.round(breathingFrequencyInSec);
    }

    getMode() {
        return this.mode;
    }

    setMode(mode) {
        this.mode = mode;
    }
}

export default BreathingExercise;