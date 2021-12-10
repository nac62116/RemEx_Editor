import Config from "../utils/Config.js";
import Step from "./Step.js";

/*
MIT License

Copyright (c) 2021 Colin Nash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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