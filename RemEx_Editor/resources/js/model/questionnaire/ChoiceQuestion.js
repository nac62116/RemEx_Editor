/* eslint-env browser */

import Config from "../../utils/Config.js";
import Question from "./Question.js";

class ChoiceQuestion extends Question {

    constructor(properties) {
        super(properties);
        this.header = properties.header;
    }
}

export default ChoiceQuestion;