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
        id;


//###
        // Remove this
        Storage.clear();
//###


        experiment = Storage.load();
        if (experiment === undefined) {
            id = IdManager.getUnusedId();
            experiment = createNewExperiment(id);
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
        IdManager.removeIds();
        Storage.clear();
        IndexedDB.clearDatabase();
        this.usedResourceFileNames = [];
    }

    getExperiment() {
        return Storage.load();
    }

    extendExperiment(parentNode, initialProperties) {
        let properties = {},
        newData;

        if (initialProperties !== undefined && initialProperties.id !== undefined) {
            properties.id = initialProperties.id;
        }
        else {
            properties.id = IdManager.getUnusedId();
        }

        for (let key in initialProperties) {
            if (Object.prototype.hasOwnProperty.call(initialProperties, key)) {
                properties[key] = initialProperties[key];
            }
        }
        if (parentNode.type === Config.TYPE_EXPERIMENT) {
            newData = createNewExperimentGroup(properties);
        }
        else if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            newData = createNewSurvey(properties, parentNode);
        }
        else if (parentNode.type === Config.TYPE_SURVEY) {
            newData = createNewStep(properties, parentNode);
        }
        else if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            newData = createNewQuestion(properties, parentNode);
        }
        else if (parentNode.type === Config.QUESTION_TYPE_CHOICE) {
            newData = createNewAnswer(properties, parentNode);
        }
        else {
            console.log("The node type " + parentNode.type + " is not defined.");
        }
        return newData;
    }

    shortenExperiment(node, parentNode) {
        let experiment = Storage.load(),
        nodeData = this.getDataById(node.id, experiment),
        parentData = this.getDataById(parentNode.id, experiment),
        index;

        if (parentData.groups !== undefined) {
            index = parentData.groups.indexOf(nodeData);
            parentData.groups.splice(index, 1);
        }
        else if (parentData.surveys !== undefined) {
            index = parentData.surveys.indexOf(nodeData);
            parentData.surveys.splice(index, 1);
        }
        else if (parentData.steps !== undefined) {
            index = parentData.steps.indexOf(nodeData);
            parentData.steps.splice(index, 1);
        }
        else if (parentData.questions !== undefined) {
            index = parentData.questions.indexOf(nodeData);
            parentData.questions.splice(index, 1);
        }
        else if (parentData.answers !== undefined) {
            index = parentData.answers.indexOf(nodeData);
            parentData.answers.splice(index, 1);
        }
        else {
            console.log("The model data was not shorten properly.");
        }
        removeIds(nodeData);
        Storage.save(experiment);
    }

    updateExperiment(properties) {
        let experiment = Storage.load(),
        nodeData = this.getDataById(properties.id, experiment);
        
        for (let key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                nodeData[key] = properties[key];
                if (key === "imageFileName" || key === "videoFileName") {
                    if (!this.usedResourceFileNames.includes(properties[key])) {
                        this.usedResourceFileNames.push(properties[key]);
                    }
                }
            }
        }
        Storage.save(experiment);
    }

    setIds(experiment) {
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
        IdManager.setIds(ids);
    }

    getDataById(id, experiment) {
        let tmpExperiment;
        if (experiment === undefined) {
            tmpExperiment = Storage.load();
        }
        else {
            tmpExperiment = experiment;
        }
        if (tmpExperiment.id === id) {
            return tmpExperiment;
        }
        if (tmpExperiment.groups !== undefined) {
            for (let group of tmpExperiment.groups) {
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
        return undefined;
    }

    updateSurveyLinks(timelineNodeData) {
        let timeSurveyMap = new Map(),
        timeInMin,
        times = [],
        lastSurvey;

        for (let survey of timelineNodeData.surveys) {
            timeInMin = survey.absoluteStartDaysOffset * 24 * 60 + survey.absoluteStartAtHour * 60 + survey.absoluteStartAtMinute; // eslint-disable-line no-magic-numbers
            times.push(timeInMin);
            timeSurveyMap.set(timeInMin, survey);
        }
        // Ascending sort
        times.sort(function(a, b){return a - b;});
        for (let i = 0; i < times.length; i++) {
            // First iteration with length === 1
            if (i === 0 && i === times.length - 1) {
                lastSurvey = timeSurveyMap.get(times[i]);
                lastSurvey.previousSurveyId = null;
                lastSurvey.nextSurveyId = null;
            }
            // First iteration
            else if (i === 0) {
                timeSurveyMap.get(times[i]).previousSurveyId = null;
                timeSurveyMap.get(times[i]).nextSurveyId = timeSurveyMap.get(times[i + 1]).id;
            }
            // Last iteration
            else if (i === times.length - 1) {
                lastSurvey = timeSurveyMap.get(times[i]);
                lastSurvey.previousSurveyId = timeSurveyMap.get(times[i - 1]).id;
                lastSurvey.nextSurveyId = null;
            }
            // All other iterations
            else {
                timeSurveyMap.get(times[i]).previousSurveyId = timeSurveyMap.get(times[i - 1]).id;
                timeSurveyMap.get(times[i]).nextSurveyId = timeSurveyMap.get(times[i + 1]).id;
            }
        }
        this.updateExperiment(timelineNodeData);
        return lastSurvey;
    }

    updateStepLinks(stepData, previousStepData, nextStepData) {

        if (previousStepData !== undefined) {
            stepData.previousStepId = previousStepData.id;
            previousStepData.nextStepId = stepData.id;
            this.updateExperiment(previousStepData);
        }

        if (nextStepData !== undefined) {
            stepData.nextStepId = nextStepData.id;
            nextStepData.previousStepId = stepData.id;
            this.updateExperiment(nextStepData);
        }

        this.updateExperiment(stepData);
    }

    removeWaitForStepLinks(stepData, stepToWaitForData) {
        let experiment = Storage.load();

        removeWaitForStepLinks(this, stepData, stepToWaitForData, experiment);
    }

    updateQuestionLinks(questionData, previousQuestionData, nextQuestionData, questionToRemoveData, updatePreviousAnswerLinks) {

        if (previousQuestionData !== undefined) {
            questionData.previousQuestionId = previousQuestionData.id;
            previousQuestionData.nextQuestionId = questionData.id;
            // Answers of a choice question can link to different questions.
            // We have to update the links of those answers too.
            if (previousQuestionData.type === Config.QUESTION_TYPE_CHOICE) {
                for (let answer of previousQuestionData.answers) {
                    if (updatePreviousAnswerLinks) {
                        if (nextQuestionData !== undefined) {
                            if (answer.nextQuestionId === nextQuestionData.id) {
                                answer.nextQuestionId = questionData.id;
                            }
                        }
                        else {
                            answer.nextQuestionId = questionData.id;
                        }
                    }
                    if (questionToRemoveData !== undefined
                        && answer.nextQuestionId === questionToRemoveData.id) {
                            answer.nextQuestionId = questionData.id;
                    }
                }
            }
            this.updateExperiment(previousQuestionData);
        }

        if (nextQuestionData !== undefined) {
            questionData.nextQuestionId = nextQuestionData.id;
            nextQuestionData.previousQuestionId = questionData.id;
            // Answers of a choice question can link to different questions.
            // We have to update the links of those answers too.
            if (questionData.type === Config.QUESTION_TYPE_CHOICE) {
                for (let answer of questionData.answers) {
                    if (answer.nextQuestionId === null 
                        || (questionToRemoveData !== undefined
                            && answer.nextQuestionId === questionToRemoveData.id)) {
                        answer.nextQuestionId = nextQuestionData.id;
                    }
                }
            }
            this.updateExperiment(nextQuestionData);
        }
        if (questionData !== undefined) {
            this.updateExperiment(questionData);
        }
    }

    getPastOngoingInstructions(stepNode) {
        let experiment = Storage.load(),
        pastOngoingInstructions = [];

        pastOngoingInstructions = getPastOngoingInstructions(this, stepNode.previousNode, experiment, pastOngoingInstructions);

        return pastOngoingInstructions;
    }

    getPastAndFutureQuestions(questionNode, exceptionNode) {
        let experiment = Storage.load(),
        pastAndFutureQuestions = [];

        pastAndFutureQuestions = getPastAndFutureQuestions(this, questionNode, exceptionNode, experiment, pastAndFutureQuestions);

        return pastAndFutureQuestions;
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

    removeSubtreeResources(node) {
        let experiment = Storage.load();

        removeSubtreeResources(this, node, experiment);
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

function removeWaitForStepLinks(that, stepData, stepToWaitForData, experiment) {
    let nextStepData = that.getDataById(stepData.nextStepId, experiment);

    if (stepData === undefined) {
        return;
    }
    if (stepData.waitForStep === stepToWaitForData.id) {
        stepData.waitForStep = 0;
        that.updateExperiment(stepData);
    }
    removeWaitForStepLinks(that, nextStepData, stepToWaitForData, experiment);
}

function removeSubtreeResources(that, node, experiment) {
    let nodeData = that.getDataById(node.id, experiment);
    if (node === undefined) {
        return;
    }
    if (nodeData.imageFileName !== undefined && nodeData.imageFileName !== null) {
        that.removeResource(nodeData.imageFileName);
    }
    if (nodeData.videoFileName !== undefined && nodeData.videoFileName !== null) {
        that.removeResource(nodeData.videoFileName);
    }
    for (let childNode of node.childNodes) {
        removeSubtreeResources(that, childNode, experiment);
    }
}

function createNewExperiment(id) {
    let experiment = new Experiment();

    experiment.id = id;

    return experiment;
}

function createNewExperimentGroup(properties) {
    let experiment = Storage.load(),
    group = new ExperimentGroup();
    
    for (let key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            group[key] = properties[key];
        }
    }
    experiment.groups.push(group);
    Storage.save(experiment);

    return group;
}

function createNewSurvey(properties, parentNode) {
    let experiment = Storage.load(),
    survey = new Survey();
    
    for (let key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            survey[key] = properties[key];
        }
    }

    for (let group of experiment.groups) {
        if (group.id === parentNode.id) {
            group.surveys.push(survey);
            break;
        }
    }
    Storage.save(experiment);

    return survey;
}

function createNewStep(properties, parentNode) {
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
        console.log("The step type " + properties.type + " is not defined.");
    }
    for (let key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            step[key] = properties[key];
        }
    }
    for (let group of experiment.groups) {
        if (group.id === parentNode.parentNode.id) {
            for (let survey of group.surveys) {
                if (survey.id === parentNode.id) {
                    survey.steps.push(step);
                    break;
                }
            }
        }
    }
    Storage.save(experiment);

    return step;
}

function createNewQuestion(properties, parentNode) {
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
        console.log("The question type " + properties.type + " is not defined.");
    }
    for (let key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            question[key] = properties[key];
        }
    }
    for (let group of experiment.groups) {
        if (group.id === parentNode.parentNode.parentNode.id) {
            for (let survey of group.surveys) {
                if (survey.id === parentNode.parentNode.id) {
                    for (let step of survey.steps) {
                        if (step.id === parentNode.id) {
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

function createNewAnswer(properties, parentNode) {
    let experiment = Storage.load(),
    answer = new Answer();
    
    for (let key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            answer[key] = properties[key];
        }
    }
    for (let group of experiment.groups) {
        if (group.id === parentNode.parentNode.parentNode.parentNode.id) {
            for (let survey of group.surveys) {
                if (survey.id === parentNode.parentNode.parentNode.id) {
                    for (let step of survey.steps) {
                        if (step.id === parentNode.parentNode.id) {
                            for (let question of step.questions) {
                                if (question.id === parentNode.id) {
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

function removeIds(nodeData) {
    if (nodeData === undefined) {
        return;
    }

    IdManager.removeId(nodeData.id);

    if (nodeData.groups !== undefined) {
        for (let group of nodeData.groups) {
            removeIds(group);
        }
    }
    if (nodeData.surveys !== undefined) {
        for (let survey of nodeData.surveys) {
            removeIds(survey);
        }
    }
    if (nodeData.steps !== undefined) {
        for (let step of nodeData.steps) {
            removeIds(step);
        }
    }
    if (nodeData.questions !== undefined) {
        for (let question of nodeData.questions) {
            removeIds(question);
        }
    }
    if (nodeData.answers !== undefined) {
        for (let answer of nodeData.answers) {
            removeIds(answer);
        }
    }
}

function getPastOngoingInstructions(that, node, experiment, pastOngoingInstructions) {
    let pastOngoingInstruction,
    modelData;

    if (node === undefined) {
        return pastOngoingInstructions;
    }
    modelData = that.getDataById(node.id, experiment);
    if (modelData.type === Config.STEP_TYPE_INSTRUCTION 
        && modelData.durationInMin !== null 
        && modelData.durationInMin !== 0) {
        pastOngoingInstruction = {
            label: modelData.name,
            value: modelData.id,
        };
        pastOngoingInstructions.splice(0, 0, pastOngoingInstruction);
    }
    return getPastOngoingInstructions(that, node.previousNode, experiment, pastOngoingInstructions);
}

function getPastAndFutureQuestions(that, node, exceptionNode, experiment, questionsForInputView) {
    let question,
    modelData;

    if (node === undefined) {
        return questionsForInputView;
    }
    if (node !== exceptionNode) {
        modelData = that.getDataById(node.id, experiment);
        question = {
            label: modelData.name,
            value: modelData.id,
        };
        questionsForInputView.push(question);
    }
    return getPastAndFutureQuestions(that, node.nextNode, exceptionNode, experiment, questionsForInputView);
}

export default new ModelManager();