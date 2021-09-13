import Config from "../../utils/Config.js";
import Question from "./Question.js";

class ChoiceQuestion extends Question {

    constructor(id, nextQuestionId) {
        super(id, Config.QUESTION_TYPE_CHOICE, nextQuestionId);
        this.choiceType = undefined;
        this.answers = [];
    }

    getChoiceType() {
        return this.choiceType;
    }

    setChoiceType(choiceType) {
        this.choiceType = choiceType;
    }

    getAnswers() {
        return this.answers;
    }

    addAnswer(answer) {
        if (!this.answers.includes(answer)) {
            this.answers.push(answer);
        }
    }

    removeAnswer(answer) {
        let index = this.answers.indexOf(answer);
        if (index !== -1) {
            this.answers.splice(index, 1);
        }
    }
}

export default ChoiceQuestion;