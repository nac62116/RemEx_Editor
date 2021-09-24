import Config from "../utils/Config.js";
import Storage from "../utils/Storage.js";
import Experiment from "../model/Experiment.js";
import ExperimentGroup from "../model/ExperimentGroup.js";
import Survey from "../model/Survey.js";
import IdManager from "./IdManager.js";

class ModelManager {

    initExperiment() {
        let experiment,
        properties = {};

        Storage.clear(); // TODO: Remove this

        experiment = Storage.load();
        if (experiment === undefined) {
            properties.id = IdManager.getUnusedId();
            properties.name = Config.NEW_EXPERIMENT_NAME;
            experiment = createNewExperiment(properties);
            Storage.save(experiment);
        }
        else {
            // Experiment is already created
        }

        return experiment;
    }

    getExperiment() {
        return Storage.load();
    }

    extendExperiment(parent) {
        let experiment = Storage.load(),
        properties = getNewModelProperties(parent),
        newData;

        if (parent.type === Config.TYPE_EXPERIMENT) {
            newData = createNewExperimentGroup(properties, experiment);
        }
        else if (parent.type === Config.TYPE_EXPERIMENT_GROUP) {
            newData = createNewSurvey(properties, experiment);
        }
        else {
            // No such type
        }
        Storage.save(experiment);
        return newData;
    }

    shortenExperiment(id, parentId) {
        let experiment = Storage.load(),
        data = this.getDataFromNodeId(id, experiment),
        parentData = this.getDataFromNodeId(parentId, experiment),
        index;

        if (parentData.groups !== undefined) {
            index = parentData.groups.indexOf(data);
            parentData.groups.splice(index, 1);
        }
        else if (parentData.surveys !== undefined) {
            index = parentData.surveys.indexOf(data);
            parentData.surveys.splice(index, 1);
        }
        else if (parentData.steps !== undefined) {
            index = parentData.steps.indexOf(data);
            parentData.steps.splice(index, 1);
        }
        else if (parentData.questions !== undefined) {
            index = parentData.questions.indexOf(data);
            parentData.questions.splice(index, 1);
        }
        else if (parentData.answers !== undefined) {
            index = parentData.answers.indexOf(data);
            parentData.answers.splice(index, 1);
        }
        else {
            // Experiment was not shortened
        }
        Storage.save(experiment);
    }

    updateExperiment(properties) {
        let experiment = Storage.load(),
        data = this.getDataFromNodeId(properties.id, experiment);

        for (let key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                data.key = properties.key;
            }
        }
        Storage.save(experiment);
    }

    getDataFromNodeId(id, experiment) {
        if (experiment.id === id) {
            return experiment;
        }
        if (experiment.groups !== undefined) {
            for (let group of experiment.groups) {
                if (group.id === id){
                    return group;
                }
                if (group.surveys !== undefined) {
                    for (let survey of group.surveys) {
                        if (survey.id === id) {
                            return survey;
                        }
                        if (survey.steps !== undefined) {
                            for (let step of survey.steps) {
                                if (step.id === id) {
                                    return step;
                                }
                                if (step.type === Config.STEP_TYPE_QUESTIONNAIRE && step.questions !== undefined) {
                                    for (let question of step.questions) {
                                        if (question.id === id) {
                                            return question;
                                        }
                                        if (question.type === Config.QUESTION_TYPE_CHOICE && question.answers !== undefined) {
                                            for (let answer of question.answers) {
                                                if (answer.id === id) {
                                                    return answer;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
}

function getNewModelProperties(parent) {
    let modelProperties = {
        id: IdManager.getUnusedId(),
        parent: parent,
    };

    if (parent.type === Config.TYPE_EXPERIMENT) {
        modelProperties.name = Config.NEW_EXPERIMENT_GROUP_NAME;
    }
    else if (parent.type === Config.TYPE_EXPERIMENT_GROUP) {
        modelProperties.name = Config.NEW_SURVEY_NAME;
        modelProperties.absoluteStartAtMinute = 0;
        modelProperties.absoluteStartAtHour = 12;
        modelProperties.absoluteStartDaysOffset = 0;
        modelProperties.maxDurationInMin = Config.NEW_SURVEY_MAX_DURATION_IN_MIN;
        modelProperties.notificationDurationInMin = Config.NEW_SURVEY_NOTIFICATION_DURATION_IN_MIN;
    }
    // TODO
    else {
        throw "TypeError: The node type \"" + parent.type + "\" is not defined.";
    }
    return modelProperties;
}

function createNewExperiment(properties) {
    let experiment = new Experiment();

    Storage.clear();
    experiment.id = properties.id;
    experiment.name = properties.name;

    return experiment;
}

function createNewExperimentGroup(properties, experiment) {
    let group = new ExperimentGroup();
    
    group.id = properties.id;
    group.name = properties.name;
    experiment.groups.push(group);

    return group;
}

function createNewSurvey(properties, experiment) {
    let survey = new Survey();
    
    survey.id = properties.id;
    survey.name = properties.name;
    survey.absoluteStartAtMinute = properties.absoluteStartAtMinute;
    survey.absoluteStartAtHour = properties.absoluteStartAtHour;
    survey.absoluteStartDaysOffset = properties.absoluteStartDaysOffset;

    for (let group of experiment.groups) {
        if (group.id === properties.parent.id) {
            group.surveys.push(survey);
            break;
        }
    }

    return survey;
}

export default new ModelManager();