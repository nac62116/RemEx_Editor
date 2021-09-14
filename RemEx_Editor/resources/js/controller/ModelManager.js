import Config from "../utils/Config.js";
import Storage from "../utils/Storage.js";
import Experiment from "../model/Experiment.js";
import ExperimentGroup from "../model/ExperimentGroup.js";

class ModelManager {

    initExperiment() {
        let experiment,
        properties = {};

        Storage.clear(); // TODO: Remove this

        experiment = Storage.load();
        if (experiment === undefined) {
            properties.name = Config.NEW_EXPERIMENT_NAME;
            experiment = createNewExperiment(properties);
            Storage.save(experiment);
        }
        else {
            // Experiment is already created
        }

        return experiment;
    }

    extendExperiment(id, type, properties) {
        let experiment = Storage.load();

        if (type === Config.TYPE_EXPERIMENT) {
            createNewExperiment(properties);
        }
        else if (type === Config.TYPE_EXPERIMENT_GROUP) {
            createNewExperimentGroup(id, properties, experiment);
        }
        else {
            throw "Error: The node type \"" + type + "\" is not defined.";
        }
        Storage.save(experiment);
    }

    shortenExperiment(id, type) {
        let indexInGroupList,
        experiment = Storage.load();

        if (type === Config.TYPE_EXPERIMENT_GROUP) {
            for (let group of experiment.groups) {
                if (group.id === id) {
                    indexInGroupList = experiment.groups.indexOf(group);
                    experiment.groups.splice(indexInGroupList, 1);
                    break;
                }
            }
        }
        else if (type === Config.TYPE_SURVEY) {
            // TODO
        }
        else {
            throw "ModelManager.js: The node type \"" + type + "\" is not defined.";
        }
        Storage.save(experiment);
    }

    updateExperiment(id, type, properties) {
        let experiment = Storage.load(),
        newNodeDescription;

        if (type === Config.TYPE_EXPERIMENT) {
            newNodeDescription = properties.experimentName;
            experiment.name = properties.experimentName;
        }
        else if (type === Config.TYPE_EXPERIMENT_GROUP) {
            for (let group of experiment.groups) {
                if (group.id === id) {
                    newNodeDescription = properties.experimentGroupName;
                    group.name = properties.experimentGroupName;
                    break;
                }
            }
        }
        // TODO
        else {
            throw "ModelManager.js: The node type \"" + type + "\" is not defined.";
        }
        Storage.save(experiment);
        return newNodeDescription;
    }

    getDataFromNode(node) {
        let data = {},
        experiment = Storage.load();
    
        if (node.type === Config.TYPE_EXPERIMENT) {
            data.experimentName = experiment.name;
        }
        else if (node.type === Config.TYPE_EXPERIMENT_GROUP) {
            for (let group of experiment.groups) {
                if (group.id === node.id) {
                    data.experimentGroupName = group.name;
                }
            }
        }
        // TODO
        else {
            throw "ModelManager.js: The node type \"" + node.type + "\" is not defined.";
        }
        return data;
    }
}

function createNewExperiment(properties) {
    let experiment = new Experiment();

    Storage.clear();
    experiment.name = properties.name;

    return experiment;
}

function createNewExperimentGroup(id, properties, experiment) {
    let group = new ExperimentGroup();
    
    group.id = id;
    group.name = properties.name;
    experiment.groups.push(group);

    return experiment;
}

export default new ModelManager();