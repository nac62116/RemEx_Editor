import Config from "../utils/Config.js";
import Step from "./Step.js";

class Instruction extends Step {

    constructor() {
        super(Config.STEP_TYPE_INSTRUCTION);
        // Max characters: 50
        this.header = null;
        // Max characters: 350 (with image), 500 (without image)
        this.text = null;
        // Either image or video or none of both in one Instruction
        this.imageFileName = null;
        this.videoFileName = null;
        this.durationInMin = null;
        // Max characters: 500
        this.waitingText = null;
        this.isFinished = false;
    }
}

export default Instruction;