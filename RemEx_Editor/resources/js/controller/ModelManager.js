import Config from "../utils/Config.js";
import Storage from "../utils/Storage.js";
import Experiment from "../model/Experiment.js";
import ExperimentGroup from "../model/ExperimentGroup.js";
import Survey from "../model/Survey.js";

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
        else if (type === Config.TYPE_SURVEY) {
            createNewSurvey(id, properties, experiment);
        }
        else {
            throw "Error: The node type \"" + type + "\" is not defined.";
        }
        Storage.save(experiment);
    }

    shortenExperiment(id, type) {
        let experiment = Storage.load();

        if (type === Config.TYPE_EXPERIMENT_GROUP) {
            removeExperimentGroup(id, experiment);
        }
        else if (type === Config.TYPE_SURVEY) {
            removeSurvey(id, experiment);
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
            newNodeDescription = properties.name;
            experiment.name = properties.name;
        }
        else if (type === Config.TYPE_EXPERIMENT_GROUP) {
            newNodeDescription = updateExperimentGroup(id, properties, experiment);
        }
        else if (type === Config.TYPE_SURVEY) {
            newNodeDescription = updateSurvey(id, properties, experiment);
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
            data.name = experiment.name;
        }
        else if (node.type === Config.TYPE_EXPERIMENT_GROUP) {
            data = getExperimentGroupData(node.id, experiment);
        }
        else if (node.type === Config.TYPE_SURVEY) {
            data = getSurveyData(node.id, experiment);
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

function createNewSurvey(id, properties, experiment) {
    let survey = new Survey();
    
    survey.id = id;
    survey.name = properties.name;
    survey.absoluteStartAtMinute = properties.absoluteStartAtMinute;
    survey.absoluteStartAtHour = properties.absoluteStartAtHour;
    survey.absoluteStartDaysOffset = properties.absoluteStartDaysOffset;
    survey.nextSurveyId = properties.nextNode.id;

    for (let group of experiment.groups) {
        if (group.id === properties.parentNode.id) {
            group.surveys.push(survey);
        }
    }
    experiment.groups.push(survey);

    return experiment;
}

function removeExperimentGroup(id, experiment) {
    let indexInGroupList;

    for (let group of experiment.groups) {
        if (group.id === id) {
            indexInGroupList = experiment.groups.indexOf(group);
            experiment.groups.splice(indexInGroupList, 1);
            break;
        }
    }
}

function removeSurvey(id, experiment) {
    let indexInSurveyList;

    for (let group of experiment.groups) {
        for (let survey of group.surveys) {
            if (survey.id === id) {
                indexInSurveyList = group.surveys.indexOf(survey);
                experiment.groups.splice(indexInSurveyList, 1);
                break;
            }
        }
    }
}

function updateExperimentGroup(id, properties, experiment) {
    let newNodeDescription;

    for (let group of experiment.groups) {
        if (group.id === id) {
            newNodeDescription = properties.name;
            group.name = properties.name;
            break;
        }
    }
    return newNodeDescription;
}

function updateSurvey(id, properties, experiment) {
    let newNodeDescription;

    for (let group of experiment.groups) {
        for (let survey of group.surveys) {
            if (survey.id === id) {
                newNodeDescription = properties.description;
                survey.name = properties.name;
                survey.maxDurationInMin = properties.maxDurationInMin;
                survey.isRelative = properties.isRelative;
                survey.relativeStartTimeInMin = properties.relativeStartTimeInMin;
                survey.absoluteStartAtMinute = properties.absoluteStartAtMinute;
                survey.absoluteStartAtHour = properties.absoluteStartAtHour;
                survey.absoluteStartDaysOffset = properties.absoluteStartDaysOffset;
                survey.notificationDurationInMin = properties.notificationDurationInMin;
                survey.nextSurveyId = properties.nextSurveyId;
                break;
            }
        }
    }
    return newNodeDescription;
}

function getExperimentGroupData(id, experiment) {
    let data = {};

    for (let group of experiment.groups) {
        if (group.id === id) {
            data.name = group.name;
        }
    }
    return data;
}

function getSurveyData(id, experiment) {
    let data = {};

    for (let group of experiment.groups) {
        for (let survey of group.surveys) {
            if (survey.id === id) {
                data.name = survey.name;
                data.maxDurationInMin = survey.maxDurationInMin;
                data.isRelative = survey.isRelative;
                data.relativeStartTimeInMin = survey.relativeStartTimeInMin;
                data.absoluteStartAtMinute = survey.absoluteStartAtMinute;
                data.absoluteStartAtHour = survey.absoluteStartAtHour;
                data.absoluteStartDaysOffset = survey.absoluteStartDaysOffset;
                data.notificationDurationInMin = survey.notificationDurationInMin;
                data.nextSurveyId = survey.nextSurveyId;
            }
        }
    }
    return data;
}

export default new ModelManager();