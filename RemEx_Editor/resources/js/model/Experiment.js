import Config from "../utils/Config.js";

class Experiment {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_EXPERIMENT;
        this.name = Config.NEW_EXPERIMENT_NAME;
        this.groups = [];
    }
}

export default Experiment;