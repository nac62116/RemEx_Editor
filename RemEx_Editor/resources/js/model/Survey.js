import Config from "../utils/Config.js";

class Survey {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_SURVEY;
        this.name = Config.NEW_SURVEY_NAME + id;
        this.maxDurationInMin = Config.NEW_SURVEY_MAX_DURATION;
        this.absoluteStartAtMinute = Config.NEW_SURVEY_START_MINUTE;
        this.absoluteStartAtHour = Config.NEW_SURVEY_START_HOUR;
        this.absoluteStartDaysOffset = Config.NEW_SURVEY_START_DAYSOFFSET;
        this.notificationDurationInMin = Config.NEW_SURVEY_NOTIFICATION_DURATION;
        this.nextSurveyId = null;
        this.previousSurveyId = null;
        this.steps = [];
    }
}

export default Survey;