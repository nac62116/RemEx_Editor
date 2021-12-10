import Config from "../../utils/Config.js";
import Question from "./Question.js";

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

class LikertQuestion extends Question {

    constructor(id) {
        super(id, Config.QUESTION_TYPE_LIKERT, Config.NEW_LIKERT_QUESTION_NAME + id);
        this.scaleMinimumLabel = Config.NEW_LIKERT_QUESTION_SCALE_MIN_LABEL;
        this.scaleMaximumLabel = Config.NEW_LIKERT_QUESTION_SCALE_MAX_LABEL;
        this.initialValue = Config.NEW_LIKERT_QUESTION_INITIAL_VALUE;
        this.itemCount = Config.NEW_LIKERT_QUESTION_ITEM_COUNT;
    }
}

export default LikertQuestion;