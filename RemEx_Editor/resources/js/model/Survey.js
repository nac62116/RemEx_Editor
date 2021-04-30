/* eslint-env browser */

import Config from "../utils/Config.js";

class Survey {

    constructor(id) {
        // Unique
        this.id = id;
        // Unique
        this.name = undefined;
        this.maxDurationInMin = undefined;
        this.isRelative = undefined;
        this.relativeStartTimeInMin = undefined;
        this.absoluteStartAtMinute = undefined;
        this.absoluteStartAtHour = undefined;
        this.absoluteStartDaysOffset = undefined;
        this.notificationDurationInMin = undefined;
        this.nextSurveyId = 0;
        this.steps = [];
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getMaxDurationInMin() {
        return this.maxDurationInMin;
    }

    setMaxDurationInMin(maxDurationInMin) {
        this.maxDurationInMin = maxDurationInMin;
    }

    getIsRelative() {
        return this.isRelative;
    }

    setIsRelative(isRelative) {
        this.isRelative = isRelative;
    }

    getRelativeStartTimeInMin() {
        return this.relativeStartTimeInMin;
    }

    setRelativeStartTimeInMin(relativeStartTimeInMin) {
        this.relativeStartTimeInMin = relativeStartTimeInMin;
    }

    getAbsoluteStartAtMinute() {
        return this.absoluteStartAtMinute;
    }

    setAbsoluteStartAtMinute(absoluteStartAtMinute) {
        this.absoluteStartAtMinute = absoluteStartAtMinute;
    }

    getAbsoluteStartAtHour() {
        return this.absoluteStartAtHour;
    }

    setAbsoluteStartAtHour(absoluteStartAtHour) {
        this.absoluteStartAtHour = absoluteStartAtHour;
    }

    getAbsoluteStartDaysOffset() {
        return this.absoluteStartDaysOffset;
    }

    setAbsoluteStartDaysOffset(absoluteStartDaysOffset) {
        this.absoluteStartDaysOffset = absoluteStartDaysOffset;
    }

    getNotificationDurationInMin() {
        return this.notificationDurationInMin;
    }

    setNotificationDurationInMin(notificationDurationInMin) {
        this.notificationDurationInMin = notificationDurationInMin;
    }

    getNextSurveyId() {
        return this.nextSurveyId;
    }

    setNextSurveyId(nextSurveyId) {
        this.nextSurveyId = nextSurveyId;
    }

    getStepCount() {
        return this.steps.length;
    }

    getCurrentStepIds() {
        let stepIds = [];
        for (let step of this.steps) {
            stepIds.push(step.getId());
        }
        return stepIds;
    }

    getStepById(stepId) {
        for (let step of this.steps) {
            if (step.getId() === stepId) {
                return step;
            }
        }
        return null;
    }

    addStep(step) {
        if (!this.steps.includes(step)) {
            this.steps.push(step);
        }
    }

    removeStep(step) {
        let index = this.steps.indexOf(step);
        if (index !== -1) {
            this.steps.splice(index, 1);
        }
    }

    isValid(surveys, previousSurvey, nextSurvey) {
        if (this.name === "" || this.name === undefined) {
            // TODO: Define the Config values
            return Config.SURVEY_NAME_EMPTY;
        }
        // TODO: Calculate the optimal duration for a survey depending on its steps
        if (this.maxDurationInMin === undefined || this.maxDurationInMin <= 0) {
            return Config.SURVEY_DURATION_INVALID;
        }
        if (this.isRelative === undefined || (this.relativeStartTimeInMin === undefined && (this.absoluteStartAtMinute === undefined || this.absoluteStartAtHour === undefined || this.absoluteStartDaysOffset === undefined))) {
            return Config.SURVEY_TIME_NOT_SET;
        }
        if (this.relativeStartTimeInMin <= 0) {
            return Config.RELATIVE_SURVEY_TIME_INVALID;
        }
        if ((this.absoluteStartAtMinute < 0 || this.absoluteStartAtMinute >= 60) || (this.absoluteStartAtHour < 0 || this.absoluteStartAtHour > 24) || this.absoluteStartDaysOffset < 0) {
            return Config.ABSOLUTE_SURVEY_TIME_INVALID;
        }
        if (this.notificationDurationInMin === undefined || this.notificationDurationInMin <= 0) {
            return Config.SURVEY_NOTIFICATION_DURATION_INVALID;
        }
        for (let survey of surveys) {
            if (survey.getName() === this.name) {
                return Config.SURVEY_NAME_NOT_UNIQUE;
            }
        }
        if (isOverlapping(this, previousSurvey, nextSurvey)) {
            return Config.SURVEY_OVERLAPS;
        }
        return true;
    }
}

function isOverlapping(that, previousSurveys, nextSurvey) {
    let isOverlapping;
    if (previousSurveys.length !== 0) {
        isOverlapping = isOverlappingPreviousSurvey(that, previousSurveys);
    }
    if (nextSurvey !== null) {
        isOverlapping = isOverlappingNextSurvey(that, nextSurvey);
    }
    return false;
}

function isOverlappingPreviousSurvey(that, previousSurveys) {
    let previousSurvey, result;
    if (that.isRelative) {
        previousSurvey = previousSurveys[previousSurveys.length - 1];
        if ((previousSurvey.getMaxDurationInMin() + previousSurvey.getNotificationDurationInMin()) > that.relativeStartTimeInMin) {
            return true;
        }
    }
    else {
        result = getTimeIntervalFromLastAbsoluteSurvey(previousSurveys);
        // If there is no last absolute survey (all previous surveys are relative) or there is no previous survey at all. So overlapping has to be checked in the RemEx Android application, because there the experiment start time is set (and with that relative surveys can resolve there absolute start time)
        if (result.lastAbsoluteSurvey !== undefined) {
            // If the start time of the last absolute survey plus the time of all relative surveys in between is greater than the start time of this survey, this survey is overlapping with the previous surveys.
            if ((result.lastAbsoluteSurvey.getAbsoluteStartAtMinute + result.lastAbsoluteSurvey.getAbsoluteStartAtHour * 60 + result.lastAbsoluteSurvey.getAbsoluteStartDaysOffset * 24 * 60 + result.timeIntervalInMin) > (that.getAbsoluteStartAtMinute + that.getAbsoluteStartAtHour * 60 + that.getAbsoluteStartDaysOffset * 24 * 60)) {
                return true;
            }
        }
    }
    return false;
}

function getTimeIntervalFromLastAbsoluteSurvey(previousSurveys) {
    let result = {
        timeIntervalInMin: 0,
        lastAbsoluteSurvey: undefined
    }
    for (let i = previousSurveys.length - 1; i >= 0; i--) {
        result.timeIntervalInMin += previousSurveys[i].getMaxDurationInMin() + previousSurveys[i].getNotificationDurationInMin();
        if (!previousSurveys[i].getIsRelative()) {
            result.lastAbsoluteSurvey = previousSurveys[i];
            break;
        }
    }
    return result;
}

function isOverlappingNextSurvey(that, nextSurvey) {
    //TODO
}

export default Survey;