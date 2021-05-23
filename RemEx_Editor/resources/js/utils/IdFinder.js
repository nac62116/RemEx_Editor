/* eslint-env browser */

import Config from "./Config.js";

// Class to find unique ids for surveys, steps, questions...

class IdFinder {

    constructor() {
        this.currentSurveyIds = [];
        this.currentStepIds = [];
        this.currentQuestionIds = [];
    }

    setCurrentSurveyIds(currentSurveyIds) {
        this.currentSurveyIds = currentSurveyIds;
    }

    getUnusedSurveyId() {
        return getUnusedId(this.currentSurveyIds)
    }

    setCurrentStepIds(currentStepIds) {
        this.currentStepIds = currentStepIds;
    }

    getUnusedStepId() {
        return getUnusedId(this.currentStepIds)
    }

    setCurrentQuestionIds(currentQuestionIds) {
        this.currentQuestionIds = currentQuestionIds;
    }

    getUnusedQuestionId() {
        return getUnusedId(this.currentQuestionIds)
    }
}

function getUnusedId(ids) {
    let id = 0;
    while (true) {
        if (!ids.includes(id)) {
            return id;
        }
        else {
            // Id already in use.
        }
        if (id === Config.MAX_ID_SIZE) {
            return Config.MAX_ID_ALERT;
        }
        else {
            // Id is inside the given boundary.
        }
        id++;
    }
}

export default new IdFinder();