/* eslint-env browser */

import Config from "../utils/Config.js";
import Step from "./Step.js";

class Instruction extends Step {

    constructor(id, name, nextStepId) {
        super(id, name, Config.STEP_TYPE_INSTRUCTION, nextStepId);
        // Max characters: 50
        this.header = undefined;
        // Max characters: 350 (with image), 500 (without image)
        this.text = undefined;
        // Either image or video or none of both in one Instruction
        this.imageFileName = null;
        this.videoFileName = null;
        this.durationInMin = null;
        // Max characters: 500
        this.waitingText = null;
        this.isFinished = false;
    }

    getHeader() {
        return this.header;
    }

    setHeader(header) {
        this.header = header;
    }

    getText() {
        return this.text;
    }

    setText(text) {
        this.text = text;
    }

    getImageFileName() {
        return this.imageFileName;
    }

    setImageFileName(imageFileName) {
        this.imageFileName = imageFileName;
    }

    getVideoFileName() {
        return this.videoFileName;
    }

    setVideoFileName(videoFileName) {
        this.videoFileName = videoFileName;
    }

    getDurationInMin() {
        return this.durationInMin;
    }

    setDurationInMin(durationInMin) {
        this.durationInMin = Math.round(durationInMin);
    }

    getWaitingText() {
        return this.waitingText;
    }

    setWaitingText(waitingText) {
        this.waitingText = waitingText;
    }
}

export default Instruction;