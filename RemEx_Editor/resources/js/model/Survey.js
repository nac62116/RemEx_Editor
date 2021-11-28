import Config from "../utils/Config.js";

class Survey {

    constructor() {
        Survey.instanceCount = (Survey.instanceCount || 0) + 1;
        this.id = null;
        this.type = Config.TYPE_SURVEY;
        this.name = "Neue Befragung " + Survey.instanceCount;
        this.maxDurationInMin = 1;
        this.absoluteStartAtMinute = null;
        this.absoluteStartAtHour = null;
        this.absoluteStartDaysOffset = null;
        this.notificationDurationInMin = 1;
        this.nextSurveyId = null;
        this.previousSurveyId = null;
        this.steps = [];
    }
}

export default Survey;