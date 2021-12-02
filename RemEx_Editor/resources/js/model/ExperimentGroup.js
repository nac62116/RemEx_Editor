import Config from "../utils/Config.js";

class ExperimentGroup {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_EXPERIMENT_GROUP;
        this.name = Config.NEW_EXPERIMENT_GROUP_NAME + id;
        this.startTimeInMillis = 0;
        this.surveys = [];
    }
}

export default ExperimentGroup;