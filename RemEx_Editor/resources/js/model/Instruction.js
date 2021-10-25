import Config from "../utils/Config.js";
import Step from "./Step.js";

class Instruction extends Step {

    constructor() {
        Instruction.instanceCount = (Instruction.instanceCount || 0) + 1;
        super(Config.STEP_TYPE_INSTRUCTION, "Neue Instruktion " + Instruction.instanceCount);
        this.header = "Überschrift";
        this.text = "Text";
        this.imageFileName = null;
        this.videoFileName = null;
        this.durationInMin = 0;
        this.waitingText = "Wartetext";
        this.isFinished = false;
    }
}

export default Instruction;