/* eslint-env browser */

import Config from "./Config.js";

// Class to find unique ids for surveys, steps, questions...

class IdFinder {

    constructor() {
        this.currentGroupIds = [];
        this.currentSurveyIds = [];
        this.currentStepIds = [];
        this.currentQuestionIds = [];
    }

    addGroupId(groupId) {
        this.currentGroupIds.push(groupId);
    }

    getUnusedGroupId() {
        return getUnusedId(this.currentGroupIds)
    }

    addSurveyId(surveyId) {
        this.currentSurveyIds.push(surveyId);
    }

    getUnusedSurveyId() {
        return getUnusedId(this.currentSurveyIds)
    }

    addStepId(stepId) {
        this.currentStepIds.push(stepId);
    }

    getUnusedStepId() {
        return getUnusedId(this.currentStepIds)
    }

    addQuestionId(questionId) {
        this.currentQuestionIds.push(questionId);
    }

    getUnusedQuestionId() {
        return getUnusedId(this.currentQuestionIds)
    }
}

function getUnusedId(ids) {
    let id = 0;
    while (true) {
        if (!ids.includes(id)) {
            ids.push(id);
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