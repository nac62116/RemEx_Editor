/* eslint-env browser */

import Config from "../utils/Config.js";
import Step from "./Step.js";

class Questionnaire extends Step {

    constructor(id, nextStepId) {
        super(id, Config.STEP_TYPE_QUESTIONNAIRE, nextStepId);
        this.questions = [];
    }

    getQuestionCount() {
        return this.questions.length;
    }

    getCurrentQuestionIds() {
        let questionIds = [];
        for (let question of this.questions) {
            questionIds.push(question.getId());
        }
        return questionIds;
    }

    getQuestionById(questionId) {
        for (let question of this.questions) {
            if (question.getId() === questionId) {
                return question;
            }
        }
        return null;
    }

    addQuestion(question) {
        if (!this.questions.includes(question)) {
            this.questions.push(question);
        }
    }

    removeQuestion(question) {
        let index = this.questions.indexOf(question);
        if (index !== -1) {
            this.questions.splice(index, 1);
        }
    }
}

export default Questionnaire;