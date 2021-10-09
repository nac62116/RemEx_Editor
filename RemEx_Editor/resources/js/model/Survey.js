class Survey {

    constructor() {
        this.id = null;
        this.name = "Neue Befragung";
        this.maxDurationInMin = 1;
        this.absoluteStartAtMinute = null;
        this.absoluteStartAtHour = null;
        this.absoluteStartDaysOffset = null;
        this.notificationDurationInMin = 1;
        this.nextSurveyId = null;
        this.steps = [];
    }
}

export default Survey;