/* eslint-env browser */

import Config from "../utils/Config.js";
import Step from "./Step.js";

class Instruction extends Step {

    constructor(properties) {
        super(properties.id, Config.STEP_TYPE_INSTRUCTION);
        // Max characters: 50
        this.header = properties.header;
        // Max characters: 350 (with image), 500 (without image)
        this.text = properties.text;
        // Either image or video in one Instruction
        this.imageFileName = properties.imageFileName;
        this.videoFileName = properties.videoFileName;
        this.durationInMin = properties.durationInMin;
        // Max characters: 500
        this.waitingText = properties.waitingText;
        this.isFinished = false;
    }
}

export default Instruction;