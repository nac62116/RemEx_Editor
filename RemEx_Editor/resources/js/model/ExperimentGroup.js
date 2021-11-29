import Config from "../utils/Config.js";

class ExperimentGroup {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_EXPERIMENT_GROUP;
        this.name = "Neue Experiment Gruppe " + id;
        this.startTimeInMillis = 0;
        this.surveys = [];
    }
}

export default ExperimentGroup;