/* eslint-env browser */

import Config from "../utils/Config.js";

class ExperimentGroup {

    constructor() {
        // Unique
        this.name = undefined;
        this.startTimeInMillis = 0;
        this.surveys = [];
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    // TODO: What happens when you click on an experiment group (getSurveyCount(), getSurveyTimes()?)

    getCurrentSurveyIds() {
        let surveyIds = [];
        for (let survey of this.surveys) {
            surveyIds.push(survey.getId());
        }
        return surveyIds;
    }

    getSurveyById(surveyId) {
        for (let survey of this.surveys) {
            if (survey.getId() === surveyId) {
                return survey;
            }
        }
        return null;
    }

    addSurvey(survey) {
        if (!this.surveys.includes(survey)) {
            this.surveys.push(survey);
        }
    }

    removeSurvey(survey) {
        let index = this.surveys.indexOf(survey);
        if (index !== -1) {
            this.surveys.splice(index, 1);
        }
    }

    isValid(groups) {
        if (this.name === "" || this.name === undefined) {
            return Config.EXPERIMENT_GROUP_NAME_EMPTY;
        }
        for (let group of groups) {
            if (group.getName() === this.name) {
                return Config.EXPERIMENT_GROUP_NAME_NOT_UNIQUE;
            }
        }
        return true;
    }
}

export default ExperimentGroup;