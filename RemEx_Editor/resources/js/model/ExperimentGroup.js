class ExperimentGroup {

    constructor() {
        ExperimentGroup.instanceCount = (ExperimentGroup.instanceCount || 0) + 1;
        this.id = null;
        this.name = "Neue Experiment Gruppe " + ExperimentGroup.instanceCount;
        this.startTimeInMillis = 0;
        this.surveys = [];
    }
}

export default ExperimentGroup;