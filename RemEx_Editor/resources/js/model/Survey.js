import Config from "../utils/Config.js";

class Survey {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_SURVEY;
        this.name = "Neue Befragung " + id;
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