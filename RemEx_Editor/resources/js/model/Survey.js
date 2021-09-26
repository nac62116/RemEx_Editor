import Config from "../utils/Config.js";

class Survey {

    constructor() {
        // Unique
        this.id = null;
        // Unique
        this.name = null;
        this.maxDurationInMin = null;
        this.absoluteStartAtMinute = null;
        this.absoluteStartAtHour = null;
        this.absoluteStartDaysOffset = null;
        this.notificationDurationInMin = null;
        this.nextSurveyId = null;
        this.steps = [];
    }
    // TODO: Outsource to InputValidationManager
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