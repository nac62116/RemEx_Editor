import Config from "../utils/Config.js";

class Survey {

    constructor(id, nextSurveyId) {
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
        this.nextSurveyId = nextSurveyId;
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
        this.maxDurationInMin = Math.round(maxDurationInMin);
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
        this.relativeStartTimeInMin = Math.round(relativeStartTimeInMin);
    }

    getAbsoluteStartAtMinute() {
        return this.absoluteStartAtMinute;
    }

    setAbsoluteStartAtMinute(absoluteStartAtMinute) {
        this.absoluteStartAtMinute = Math.round(absoluteStartAtMinute);
    }

    getAbsoluteStartAtHour() {
        return this.absoluteStartAtHour;
    }

    setAbsoluteStartAtHour(absoluteStartAtHour) {
        this.absoluteStartAtHour = Math.round(absoluteStartAtHour);
    }

    getAbsoluteStartDaysOffset() {
        return this.absoluteStartDaysOffset;
    }

    setAbsoluteStartDaysOffset(absoluteStartDaysOffset) {
        this.absoluteStartDaysOffset = Math.round(absoluteStartDaysOffset);
    }

    getNotificationDurationInMin() {
        return this.notificationDurationInMin;
    }

    setNotificationDurationInMin(notificationDurationInMin) {
        this.notificationDurationInMin = Math.round(notificationDurationInMin);
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

    isValid(surveys, previousSurveys, nextSurvey) {
        for (let survey of surveys) {
            if (survey.getName() === this.name) {
                return Config.SURVEY_NAME_NOT_UNIQUE;
            }
        }
        if (isOverlapping(this, previousSurveys, nextSurvey)) {
            return Config.SURVEY_OVERLAPS;
        }
        return true;
    }
}

function isOverlapping(that, previousSurveys, nextSurvey) {
    let isOverlapping = false,
    previousSurveysIncludingThisSurvey;
    if (previousSurveys.length !== 0) {
        // Checking if this survey instance (represented by "that") is overlapping with the previous surveys
        isOverlapping = isOverlappingPreviousSurvey(that, previousSurveys);
    }
    if (nextSurvey !== null) {
        // Checking if this survey instance is overlapping with the next survey. That can be accomplished by doing the same check as above ("isOverlappingPreviousSuvrey()") for the next survey and adding this survey instance to the previous surveys list
        previousSurveysIncludingThisSurvey = previousSurveys;
        previousSurveysIncludingThisSurvey.push(that);
        isOverlapping = isOverlappingPreviousSurvey(nextSurvey, previousSurveysIncludingThisSurvey);
    }
    return isOverlapping;
}

function isOverlappingPreviousSurvey(surveyToCheck, previousSurveys) {
    let previousSurvey,
    result;
    if (surveyToCheck.isRelative) {
        previousSurvey = previousSurveys[previousSurveys.length - 1];
        if ((previousSurvey.getMaxDurationInMin() + previousSurvey.getNotificationDurationInMin()) > surveyToCheck.relativeStartTimeInMin) {
            return true;
        }
    }
    else {
        result = getTimeIntervalFromLastAbsoluteSurvey(previousSurveys);
        // If there is no last absolute survey (all previous surveys are relative) or there is no previous survey at all. So overlapping has to be checked in the RemEx Android application, because there the experiment start time is set (and with that relative surveys can resolve there absolute start time)
        if (result.lastAbsoluteSurvey !== undefined) {
            // If the start time of the last absolute survey plus the time of all relative surveys in between is greater than the start time of this survey, this survey is overlapping with the previous surveys.
            if ((result.lastAbsoluteSurvey.getAbsoluteStartAtMinute + result.lastAbsoluteSurvey.getAbsoluteStartAtHour * 60 + result.lastAbsoluteSurvey.getAbsoluteStartDaysOffset * 24 * 60 + result.timeIntervalInMin) > (surveyToCheck.getAbsoluteStartAtMinute + surveyToCheck.getAbsoluteStartAtHour * 60 + surveyToCheck.getAbsoluteStartDaysOffset * 24 * 60)) { // eslint-disable-line
                return true;
            }
        }
    }
    return false;
}

function getTimeIntervalFromLastAbsoluteSurvey(previousSurveys) {
    let result = {
        timeIntervalInMin: 0,
        lastAbsoluteSurvey: undefined,
    };
    for (let i = previousSurveys.length - 1; i >= 0; i--) {
        result.timeIntervalInMin += previousSurveys[i].getMaxDurationInMin() + previousSurveys[i].getNotificationDurationInMin();
        if (!previousSurveys[i].getIsRelative()) {
            result.lastAbsoluteSurvey = previousSurveys[i];
            break;
        }
    }
    return result;
}

export default Survey;