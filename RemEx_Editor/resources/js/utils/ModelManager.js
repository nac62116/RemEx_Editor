import Config from "./Config.js";
import Storage from "./Storage.js";
import IndexedDB from "./IndexedDB.js";
import Experiment from "../model/Experiment.js";
import ExperimentGroup from "../model/ExperimentGroup.js";
import Survey from "../model/Survey.js";
import IdManager from "./IdManager.js";
import Instruction from "../model/Instruction.js";
import BreathingExercise from "../model/BreathingExercise.js";
import Questionnaire from "../model/Questionnaire.js";
import ChoiceQuestion from "../model/questionnaire/ChoiceQuestion.js";
import LikertQuestion from "../model/questionnaire/LikertQuestion.js";
import PointOfTimeQuestion from "../model/questionnaire/PointOfTimeQuestion.js";
import TextQuestion from "../model/questionnaire/TextQuestion.js";
import TimeIntervalQuestion from "../model/questionnaire/TimeIntervalQuestion.js";
import Answer from "../model/questionnaire/Answer.js";

class ModelManager {

    constructor() {
        this.usedResourceFileNames = [];
    }
    
    initExperiment() {
        let experiment,
        properties = {};

        // TODO Remove this
        Storage.clear();

        experiment = Storage.load();
        if (experiment === undefined) {
            IndexedDB.clearDatabase();
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

    saveExperiment(experiment) {
        Storage.save(experiment);
    }

    removeExperiment() {
        Storage.clear();
        IndexedDB.clearDatabase();
        this.usedResourceFileNames = [];
    }

    getExperiment() {
        return Storage.load();
    }

    extendExperiment(parentNode, initialProperties, stepType, questionType) {
        let properties = getNewModelProperties(parentNode, stepType, questionType),
        newData;

        if (parentNode.type === Config.TYPE_EXPERIMENT) {
            newData = createNewExperimentGroup(properties);
        }
        else if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            for (let key in initialProperties) {
                if (Object.prototype.hasOwnProperty.call(initialProperties, key)) {
                    properties[key] = initialProperties[key];
                }
            }
            newData = createNewSurvey(properties);
        }
        else if (parentNode.type === Config.TYPE_SURVEY) {
            newData = createNewStep(properties);
        }
        else if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            newData = createNewQuestion(properties);
        }
        else if (parentNode.type === Config.QUESTION_TYPE_CHOICE) {
            newData = createNewAnswer(properties);
        }
        else {
            throw "The node type " + parentNode.type + " is not defined.";
        }
        return newData;
    }

    shortenExperiment(id, parentId, childIds) {
        let experiment = Storage.load(),
        data = this.getDataFromNodeId(id, experiment),
        parentData = this.getDataFromNodeId(parentId, experiment),
        index;

        IdManager.removeId(id);
        for (let childId of childIds) {
            IdManager.removeId(childId);
        }
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
            throw "The model data was not shorten properly.";
        }
        Storage.save(experiment);
    }

    updateExperiment(properties) {
        let experiment = Storage.load(),
        data = this.getDataFromNodeId(properties.id, experiment);
        
        // TODO
        for (let key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                data[key] = properties[key];
                if (key === "imageFileName" || key === "videoFileName") {
                    if (!this.usedResourceFileNames.includes(properties[key])) {
                        this.usedResourceFileNames.push(properties[key]);
                    }
                }
            }
        }
        Storage.save(experiment);
    }

    getIds(experiment) {
        let ids = [];

        for (let group of experiment.groups) {
            ids.push(group.id);
            for (let survey of group.surveys) {
                ids.push(survey.id);
                for (let step of survey.steps) {
                    ids.push(step.id);
                    if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                        for (let question of step.questions) {
                            ids.push(question.id);
                            if (question.type === Config.QUESTION_TYPE_CHOICE) {
                                for (let answer of question.answers) {
                                    ids.push(answer.id);
                                }
                            }
                        }
                    }
                }
            }
        }
        return ids;
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

    addResource(resourceFile) {
        let resource = IndexedDB.getResource(resourceFile.name),
        promise;

        return new Promise(function(resolve, reject) {
            resource.then(function(result) {
                if (result !== undefined && result !== resourceFile) {
                    reject(Config.SAME_FILE_NAME_ALERT);
                }
                else if (result !== undefined && result === resourceFile) {
                    resolve(true);
                }
                else {
                    promise = IndexedDB.addResource(resourceFile);
                    promise.then(
                        function() {
                            resolve(true);
                        },
                        function(error) {
                            reject(error);
                        }
                    );
                }
            });
        });
    }

    removeResource(fileName) {
        let experiment = Storage.load();

        for (let group of experiment.groups) {
            for (let survey of group.surveys) {
                for (let step of survey.steps) {
                    if (step.type === Config.STEP_TYPE_INSTRUCTION) {
                        if (step.imageFileName === fileName || step.videoFileName === fileName) {
                            console.log("No removal due to ", step);
                            return;
                        }
                    }
                }
            }
        }
        IndexedDB.deleteResource(fileName);
        console.log("Removal");
        this.usedResourceFileNames.splice(this.usedResourceFileNames.indexOf(fileName), 1);
    }

    getResource(fileName) {
        return IndexedDB.getResource(fileName);
    }

    getAllResources() {
        let encodedResources = [],
        resource;
        for (let fileName of this.usedResourceFileNames) {
            resource = IndexedDB.getResource(fileName);
            if (resource !== null) {
                encodedResources.push(resource);
            }
        }
        return encodedResources;
    }

    getNameCodeTable(experiment) {
        let nameCodeTable = "";

        for (let group of experiment.groups) {
            for (let survey of group.surveys) {
                for (let step of survey.steps) {
                    if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                        for (let question of step.questions) {
                            if (question.type === Config.QUESTION_TYPE_LIKERT) {

                                nameCodeTable += question.name + ":\n";
                                nameCodeTable += "  " + question.scaleMinimumLabel + ": 1\n";
                                nameCodeTable += "  " + question.scaleMaximumLabel + ": " + question.itemCount + "\n\n";
                            }
                            if (question.type === Config.QUESTION_TYPE_CHOICE) {
                                nameCodeTable += question.name + ":\n";
                                for (let answer of question.answers) {
                                    nameCodeTable += "  " + answer.text + ": " + answer.code + "\n";
                                }
                                nameCodeTable += "\n";
                            }
                        }
                    }
                }
            }
        }
        return nameCodeTable;
    }
}

function getNewModelProperties(parentNode, stepType, questionType) {
    let modelProperties = {
        id: IdManager.getUnusedId(),
        parentNode: parentNode,
    };
    
    if (parentNode.type === Config.TYPE_SURVEY) {
        modelProperties.type = stepType;
    }
    if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        modelProperties.type = questionType;
    }
    return modelProperties;
}

function createNewExperiment(properties) {
    let experiment = new Experiment();

    Storage.clear();
    experiment.id = properties.id;

    return experiment;
}

function createNewExperimentGroup(properties) {
    let experiment = Storage.load(),
    group = new ExperimentGroup();
    
    group.id = properties.id;
    experiment.groups.push(group);
    Storage.save(experiment);

    return group;
}

function createNewSurvey(properties) {
    let experiment = Storage.load(),
    survey = new Survey();
    
    survey.id = properties.id;
    survey.absoluteStartAtMinute = properties.absoluteStartAtMinute;
    survey.absoluteStartAtHour = properties.absoluteStartAtHour;
    survey.absoluteStartDaysOffset = properties.absoluteStartDaysOffset;

    for (let group of experiment.groups) {
        if (group.id === properties.parentNode.id) {
            group.surveys.push(survey);
            break;
        }
    }
    Storage.save(experiment);

    return survey;
}

function createNewStep(properties) {
    let experiment = Storage.load(),
    step;
    
    if (properties.type === Config.STEP_TYPE_INSTRUCTION) {
        step = new Instruction();
    }
    else if (properties.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
        step = new BreathingExercise();
    }
    else if (properties.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        step = new Questionnaire();
    }
    else {
        throw "The step type " + properties.type + " is not defined.";
    }
    step.id = properties.id;
    for (let group of experiment.groups) {
        if (group.id === properties.parentNode.parentNode.id) {
            for (let survey of group.surveys) {
                if (survey.id === properties.parentNode.id) {
                    survey.steps.push(step);
                    break;
                }
            }
        }
    }
    Storage.save(experiment);

    return step;
}

function createNewQuestion(properties) {
    let experiment = Storage.load(),
    question;
    
    if (properties.type === Config.QUESTION_TYPE_CHOICE) {
        question = new ChoiceQuestion();
    }
    else if (properties.type === Config.QUESTION_TYPE_LIKERT) {
        question = new LikertQuestion();
    }
    else if (properties.type === Config.QUESTION_TYPE_POINT_OF_TIME) {
        question = new PointOfTimeQuestion();
    }
    else if (properties.type === Config.QUESTION_TYPE_TEXT) {
        question = new TextQuestion();
    }
    else if (properties.type === Config.QUESTION_TYPE_TIME_INTERVAL) {
        question = new TimeIntervalQuestion();
    }
    else {
        throw "The question type " + properties.type + " is not defined.";
    }
    question.id = properties.id;
    for (let group of experiment.groups) {
        if (group.id === properties.parentNode.parentNode.parentNode.id) {
            for (let survey of group.surveys) {
                if (survey.id === properties.parentNode.parentNode.id) {
                    for (let step of survey.steps) {
                        if (step.id === properties.parentNode.id) {
                            step.questions.push(question);
                            break;
                        }
                    }
                }
            }
        }
    }
    Storage.save(experiment);

    return question;
}

function createNewAnswer(properties) {
    let experiment = Storage.load(),
    answer = new Answer();
    
    answer.id = properties.id;
    for (let group of experiment.groups) {
        if (group.id === properties.parentNode.parentNode.parentNode.parentNode.id) {
            for (let survey of group.surveys) {
                if (survey.id === properties.parentNode.parentNode.parentNode.id) {
                    for (let step of survey.steps) {
                        if (step.id === properties.parentNode.parentNode.id) {
                            for (let question of step.questions) {
                                if (question.id === properties.parentNode.id) {
                                    question.answers.push(answer);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    Storage.save(experiment);

    return answer;
}

export default new ModelManager();