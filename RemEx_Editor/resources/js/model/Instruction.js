import Config from "../utils/Config.js";
import Step from "./Step.js";

class Instruction extends Step {

    constructor(id) {
        super(id, Config.STEP_TYPE_INSTRUCTION, Config.NEW_INSTRUCTION_NAME + id);
        this.header = Config.NEW_INSTRUCTION_HEADER;
        this.text = Config.NEW_INSTRUCTION_TEXT;
        this.imageFileName = null;
        this.videoFileName = null;
        this.durationInMin = Config.NEW_INSTRUCTION_DURATION;
        this.waitingText = Config.NEW_INSTRUCTION_WAITING_TEXT;
        this.isFinished = false;
    }
}

export default Instruction;