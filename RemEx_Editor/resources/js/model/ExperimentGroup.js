import Config from "../utils/Config.js";

class ExperimentGroup {

    constructor() {
        this.id = null;
        // Unique
        this.name = null;
        this.startTimeInMillis = 0;
        this.surveys = [];
    }
    // TODO: Outsource to InputValidationManager
    isValid(groups) {
        for (let group of groups) {
            if (group.getName() === this.name) {
                return Config.EXPERIMENT_GROUP_NAME_NOT_UNIQUE;
            }
        }
        return true;
    }
}

export default ExperimentGroup;