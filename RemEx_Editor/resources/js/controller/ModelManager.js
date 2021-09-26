import Config from "../utils/Config.js";
import Storage from "../utils/Storage.js";
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

    extendExperiment(parentNode, initialProperties, stepType, questionType) {
        let experiment = Storage.load(),
        properties = getNewModelProperties(parentNode, stepType, questionType),
        newData;

        if (parentNode.type === Config.TYPE_EXPERIMENT) {
            newData = createNewExperimentGroup(properties, experiment);
        }
        else if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            for (let key in initialProperties) {
                if (Object.prototype.hasOwnProperty.call(initialProperties, key)) {
                    properties.key = initialProperties.key;
                }
            }
            newData = createNewSurvey(properties, experiment);
        }
        else if (parentNode.type === Config.TYPE_SURVEY) {
            newData = createNewStep(properties, experiment);
        }
        else if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            newData = createNewQuestion(properties, experiment);
        }
        else if (parentNode.type === Config.QUESTION_TYPE_CHOICE) {
            newData = createNewAnswer(properties, experiment);
        }
        else {
            throw "The node type " + parentNode.type + " is not defined.";
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
            IdManager.removeId(id);
        }
        else if (parentData.surveys !== undefined) {
            index = parentData.surveys.indexOf(data);
            parentData.surveys.splice(index, 1);
            IdManager.removeId(id);
        }
        else if (parentData.steps !== undefined) {
            index = parentData.steps.indexOf(data);
            parentData.steps.splice(index, 1);
            IdManager.removeId(id);
        }
        else if (parentData.questions !== undefined) {
            index = parentData.questions.indexOf(data);
            parentData.questions.splice(index, 1);
            IdManager.removeId(id);
        }
        else if (parentData.answers !== undefined) {
            index = parentData.answers.indexOf(data);
            parentData.answers.splice(index, 1);
            IdManager.removeId(id);
        }
        else {
            throw "The model data was not shorten properly.";
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

function getNewModelProperties(parentNode, stepType, questionType) {
    let modelProperties = {
        id: IdManager.getUnusedId(),
        parentNode: parentNode,
    };
    
    if (parentNode.type === Config.TYPE_EXPERIMENT) {
        modelProperties.name = Config.NEW_EXPERIMENT_GROUP_NAME;
    }
    else if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
        modelProperties.name = Config.NEW_SURVEY_NAME;
    }
    else if (parentNode.type === Config.TYPE_SURVEY) {
        if (stepType === Config.STEP_TYPE_INSTRUCTION) {
            modelProperties.name = Config.NEW_INSTRUCTION_NAME;
        }
        else if (stepType === Config.STEP_TYPE_BREATHING_EXERCISE) {
            modelProperties.name = Config.NEW_BREATHING_EXERCISE_NAME;
        }
        else if (stepType === Config.STEP_TYPE_QUESTIONNAIRE) {
            modelProperties.name = Config.NEW_QUESTIONNAIRE_NAME;
        }
        else {
            throw "The step type \"" + stepType + "\" is not defined.";
        }
        modelProperties.type = stepType;
    }
    else if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        if (questionType === Config.QUESTION_TYPE_CHOICE) {
            modelProperties.name = Config.NEW_CHOICE_QUESTION_NAME;
        }
        else if (questionType === Config.QUESTION_TYPE_LIKERT) {
            modelProperties.name = Config.NEW_LIKERT_QUESTION_NAME;
        }
        else if (questionType === Config.QUESTION_TYPE_POINT_OF_TIME) {
            modelProperties.name = Config.NEW_POINT_OF_TIME_QUESTION_NAME;
        }
        else if (questionType === Config.QUESTION_TYPE_TEXT) {
            modelProperties.name = Config.NEW_TEXT_QUESTION_NAME;
        }
        else if (questionType === Config.QUESTION_TYPE_TIME_INTERVAL) {
            modelProperties.name = Config.NEW_TIME_INTERVAL_QUESTION_NAME;
        }
        else {
            throw "The question type \"" + questionType + "\" is not defined.";
        }
        modelProperties.type = questionType;
    }
    else if (parentNode.type === Config.QUESTION_TYPE_CHOICE) {
        modelProperties.name = Config.NEW_ANSWER_TEXT;
    }
    // TODO
    else {
        throw "The node type \"" + parentNode.type + "\" is not defined.";
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
        if (group.id === properties.parentNode.id) {
            group.surveys.push(survey);
            break;
        }
    }

    return survey;
}

function createNewStep(properties, experiment) {
    let step;
    
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
    step.name = properties.name;
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

    return step;
}

function createNewQuestion(properties, experiment) {
    let question;
    
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
    question.name = properties.name;
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

    return question;
}

function createNewAnswer(properties, experiment) {
    let answer = new Answer();
    
    answer.id = properties.id;
    answer.text = properties.name;
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

    return answer;
}

export default new ModelManager();