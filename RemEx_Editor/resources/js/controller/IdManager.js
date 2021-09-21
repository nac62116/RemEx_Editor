import Config from "../utils/Config.js";

// Class to find unique ids for surveys, steps, questions...

class IdManager {

    constructor() {
        this.currentGroupIds = [];
        this.currentSurveyIds = [];
        this.currentStepIds = [];
        this.currentQuestionIds = [];
    }

    addId(id, type) {
        if (type === Config.TYPE_EXPERIMENT_GROUP) {
            addGroupId(this, id);
        }
        else if (type === Config.TYPE_SURVEY) {
           addSurveyId(this, id);
        }
        else if (type === Config.TYPE_BREATHING_EXERCISE
            || type === Config.TYPE_INSTRUCTION
            || type === Config.TYPE_QUESTIONNAIRE) {
            addStepId(this, id);
        }
        else if (type === Config.TYPE_QUESTION) {
            addQuestionId(this, id);
        }
        else {
            throw "IdManager.js: The node type \"" + type + "\" is not defined.";
        }
    }

    removeId(id, type) {
        if (type === Config.TYPE_EXPERIMENT_GROUP) {
            removeGroupId(this, id);
        }
        else if (type === Config.TYPE_SURVEY) {
           removeSurveyId(this, id);
        }
        else if (type === Config.TYPE_BREATHING_EXERCISE
            || type === Config.TYPE_INSTRUCTION
            || type === Config.TYPE_QUESTIONNAIRE) {
            removeStepId(this, id);
        }
        else if (type === Config.TYPE_QUESTION) {
            removeQuestionId(this, id);
        }
        else {
            throw "IdManager.js: The node type \"" + type + "\" is not defined.";
        }
    }

    getUnusedId(type) {
        let unusedId;
        if (type === Config.TYPE_EXPERIMENT_GROUP) {
            unusedId = getUnusedId(this.currentGroupIds);
        }
        else if (type === Config.TYPE_SURVEY) {
            unusedId = getUnusedId(this.currentSurveyIds);
        }
        else if (type === Config.TYPE_BREATHING_EXERCISE
            || type === Config.TYPE_INSTRUCTION
            || type === Config.TYPE_QUESTIONNAIRE) {
            unusedId = getUnusedId(this.currentStepIds);
        }
        else if (type === Config.TYPE_QUESTION) {
            unusedId = getUnusedId(this.currentQuestionIds);
        }
        else {
            throw "IdManager.js: The node type \"" + type + "\" is not defined.";
        }
        return unusedId;
    }
}

function addGroupId(that, groupId) {
    that.currentGroupIds.push(groupId);
}

function removeGroupId(that, groupId) {
    let index = that.currentGroupIds.indexOf(groupId);
    that.currentGroupIds.splice(index, 1);
}

function addSurveyId(that, surveyId) {
    that.currentSurveyIds.push(surveyId);
}

function removeSurveyId(that, surveyId) {
    let index = that.currentSurveyIds.indexOf(surveyId);
    that.currentSurveyIds.splice(index, 1);
}

function addStepId(that, stepId) {
    that.currentStepIds.push(stepId);
}

function removeStepId(that, stepId) {
    let index = that.currentGroupIds.indexOf(stepId);
    that.currentStepIds.splice(index, 1);
}

function addQuestionId(that, questionId) {
    that.currentQuestionIds.push(questionId);
}

function removeQuestionId(that, questionId) {
    let index = that.currentQuestionIds.indexOf(questionId);
    that.currentQuestionIds.splice(index, 1);
}

function getUnusedId(ids) {
    let id = 0;
    while (id !== Config.MAX_ID_SIZE) {
        if (!ids.includes(id)) {
            ids.push(id);
            return id;
        }
        // else: Id already in use.
        id++;
    }
    return Config.MAX_ID_ALERT;
}

export default new IdManager();