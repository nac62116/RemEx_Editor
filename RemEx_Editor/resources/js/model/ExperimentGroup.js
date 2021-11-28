import Config from "../utils/Config.js";

class ExperimentGroup {

    constructor() {
        ExperimentGroup.instanceCount = (ExperimentGroup.instanceCount || 0) + 1;
        this.id = null;
        this.type = Config.TYPE_EXPERIMENT_GROUP;
        this.name = "Neue Experiment Gruppe " + ExperimentGroup.instanceCount;
        this.startTimeInMillis = 0;
        this.surveys = [];
    }
}

export default ExperimentGroup;