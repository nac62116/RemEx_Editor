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

/*
MIT License

Copyright (c) 2021 Colin Nash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

class ModelManager {
    
    initExperiment() {
        let experiment,
        id;

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
        if (parentNode.type === Config.TYPE_EXPERIMENT_GROUP) {
            newData = createNewSurvey(properties, parentNode);
        }
        if (parentNode.type === Config.TYPE_SURVEY) {
            newData = createNewStep(properties, parentNode);
        }
        if (parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            newData = createNewQuestion(properties, parentNode);
        }
        if (parentNode.type === Config.QUESTION_TYPE_CHOICE) {
            newData = createNewAnswer(properties, parentNode);
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
            //console.log("The model data was not shorten properly.");
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
            }
        }
        Storage.save(experiment);
    }

    setIds(experiment) {
        let ids = [];

        ids.push(experiment.id);
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

    extendExperimentWithCopy(nodeData, parentNodeData, suffix) {
        let newData,
        idLinkMap = new Map();

        idLinkMap = getIdLinkMap(nodeData, idLinkMap);
        newData = getNewCopy(nodeData, idLinkMap, suffix);

        newData.id = IdManager.getUnusedId();
        if (newData.type === Config.TYPE_ANSWER) {
            if (suffix === undefined) {
                newData.code = newData.code + " (Kopie)";
            }
            else {
                newData.code = newData.code + " " + suffix;
            }
        }
        else {
            if (suffix === undefined) {
                newData.name = newData.name + " (Kopie)";
            }
            else {
                newData.name = newData.name + " " + suffix;
            }
        }
        
        if (parentNodeData.type === Config.TYPE_EXPERIMENT) {
            parentNodeData.groups.push(newData);
        }
        if (parentNodeData.type === Config.TYPE_EXPERIMENT_GROUP) {
            parentNodeData.surveys.push(newData);
        }
        if (parentNodeData.type === Config.TYPE_SURVEY) {
            parentNodeData.steps.push(newData);
        }
        if (parentNodeData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            parentNodeData.questions.push(newData);
        }
        if (parentNodeData.type === Config.QUESTION_TYPE_CHOICE) {
            parentNodeData.answers.push(newData);
        }

        this.updateExperiment(parentNodeData);

        return newData;
    }

    updateSurveyLinks(timelineNodeData) {
        let timeSurveyDataMap = new Map(),
        timeInMin,
        times = [],
        lastSurvey;

        for (let survey of timelineNodeData.surveys) {
            timeInMin = survey.absoluteStartDaysOffset * 24 * 60 + survey.absoluteStartAtHour * 60 + survey.absoluteStartAtMinute; // eslint-disable-line no-magic-numbers
            times.push(timeInMin);
            timeSurveyDataMap.set(timeInMin, survey);
        }
        // Ascending sort
        times.sort(function(a, b){return a - b;});
        for (let i = 0; i < times.length; i++) {
            // First iteration with length === 1
            if (i === 0 && i === times.length - 1) {
                lastSurvey = timeSurveyDataMap.get(times[i]);
                lastSurvey.previousSurveyId = null;
                lastSurvey.nextSurveyId = null;
            }
            // First iteration
            else if (i === 0) {
                timeSurveyDataMap.get(times[i]).previousSurveyId = null;
                timeSurveyDataMap.get(times[i]).nextSurveyId = timeSurveyDataMap.get(times[i + 1]).id;
            }
            // Last iteration
            else if (i === times.length - 1) {
                lastSurvey = timeSurveyDataMap.get(times[i]);
                lastSurvey.previousSurveyId = timeSurveyDataMap.get(times[i - 1]).id;
                lastSurvey.nextSurveyId = null;
            }
            // All other iterations
            else {
                timeSurveyDataMap.get(times[i]).previousSurveyId = timeSurveyDataMap.get(times[i - 1]).id;
                timeSurveyDataMap.get(times[i]).nextSurveyId = timeSurveyDataMap.get(times[i + 1]).id;
            }
        }
        this.updateExperiment(timelineNodeData);
        return lastSurvey;
    }

    getLastSurveyData(timelineNodeData) {
        let timeSurveyDataMap = new Map(),
        timeInMin,
        times = [],
        lastSurvey;

        for (let survey of timelineNodeData.surveys) {
            timeInMin = survey.absoluteStartDaysOffset * 24 * 60 + survey.absoluteStartAtHour * 60 + survey.absoluteStartAtMinute; // eslint-disable-line no-magic-numbers
            times.push(timeInMin);
            timeSurveyDataMap.set(timeInMin, survey);
        }
        // Ascending sort
        times.sort(function(a, b){return a - b;});
        lastSurvey = timeSurveyDataMap.get(times[times.length - 1]);
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

    updateQuestionLinks(questionData, previousQuestionData, nextQuestionData, exceptionQuestion, updatePreviousAnswerLinks) {

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
                    if (exceptionQuestion !== undefined
                        && answer.nextQuestionId === exceptionQuestion.id) {
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
                        || (exceptionQuestion !== undefined
                            && answer.nextQuestionId === exceptionQuestion.id)) {
                        answer.nextQuestionId = nextQuestionData.id;
                    }
                }
            }
            this.updateExperiment(nextQuestionData);
        }
        else {
            questionData.nextQuestionId = null;
            if (questionData.type === Config.QUESTION_TYPE_CHOICE) {
                for (let answer of questionData.answers) {
                    if (exceptionQuestion !== undefined 
                        && answer.nextQuestionId === exceptionQuestion.id) {
                            answer.nextQuestionId = null;
                    }
                }
            }
        }
        this.updateExperiment(questionData);
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
            resource.then(function(existingResource) {
                if (existingResource !== undefined 
                    && existingResource.lastModified !== resourceFile.lastModified
                    && existingResource.size !== resourceFile.size
                    && existingResource.type !== resourceFile.type) {
                    reject(Config.SAME_FILE_NAME_ALERT);
                }
                else if (existingResource !== undefined 
                    && existingResource.lastModified === resourceFile.lastModified
                    && existingResource.size === resourceFile.size
                    && existingResource.type === resourceFile.type) {
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
                            return;
                        }
                    }
                }
            }
        }
        IndexedDB.deleteResource(fileName);
    }

    getResource(fileName) {
        return IndexedDB.getResource(fileName);
    }

    getAllResources(experiment) {
        let usedResourceFileNames = [],
        errorFileNames = "",
        resources = [],
        resource;

        for (let group of experiment.groups) {
            for (let survey of group.surveys) {
                for (let step of survey.steps) {
                    if (step.type === Config.STEP_TYPE_INSTRUCTION) {
                        if (step.imageFileName !== null) {
                            if (!usedResourceFileNames.includes(step.imageFileName)) {
                                usedResourceFileNames.push(step.imageFileName);
                            }
                        }
                        if (step.videoFileName !== null) {
                            if (!usedResourceFileNames.includes(step.videoFileName)) {
                                usedResourceFileNames.push(step.videoFileName);
                            }
                        }
                    }
                }
            }
        }
        for (let fileName of usedResourceFileNames) {
            resource = IndexedDB.getResource(fileName);
            if (resource !== undefined) {
                resources.push(resource);
            }
            else {
                errorFileNames = errorFileNames + "; " + fileName;
            }
        }
        if (errorFileNames.length !== 0) {
            alert(Config.MISSING_RESOURCES_IN_DB + " (" + errorFileNames.substr(0, errorFileNames.length - 1) + ")");
        }
        return resources;
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

function getIdLinkMap(nodeData, idLinkMap) {
    let id;

    if (nodeData.type === Config.TYPE_EXPERIMENT) {
        for (let group of nodeData.groups) {
            getIdLinkMap(group, idLinkMap);
        }
    }
    if (nodeData.type === Config.TYPE_EXPERIMENT_GROUP) {
        for (let survey of nodeData.surveys) {
            getIdLinkMap(survey, idLinkMap);
        }
    }
    if (nodeData.type === Config.TYPE_SURVEY) {
        if (nodeData.nextSurveyId !== null) {
            id = idLinkMap.get(nodeData.nextSurveyId);
            if (id === undefined) {
                id = IdManager.getUnusedId();
                idLinkMap.set(nodeData.nextSurveyId, id);
            }
            nodeData.nextSurveyId = id;
        }
        if (nodeData.previousSurveyId !== null) {
            id = idLinkMap.get(nodeData.previousSurveyId);
            if (id === undefined) {
                id = IdManager.getUnusedId();
                idLinkMap.set(nodeData.previousSurveyId, id);
            }
            nodeData.previousSurveyId = id;
        }
        for (let step of nodeData.steps) {
            getIdLinkMap(step, idLinkMap);
        }
    }
    if (nodeData.type === Config.STEP_TYPE_BREATHING_EXERCISE
        || nodeData.type === Config.STEP_TYPE_INSTRUCTION
        || nodeData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        if (nodeData.nextStepId !== null) {
            id = idLinkMap.get(nodeData.nextStepId);
            if (id === undefined) {
                id = IdManager.getUnusedId();
                idLinkMap.set(nodeData.nextStepId, id);
            }
            nodeData.nextStepId = id;
        }
        if (nodeData.previousStepId !== null) {
            id = idLinkMap.get(nodeData.previousStepId);
            if (id === undefined) {
                id = IdManager.getUnusedId();
                idLinkMap.set(nodeData.previousStepId, id);
            }
            nodeData.previousStepId = id;
        }
        if (nodeData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            for (let question of nodeData.questions) {
                getIdLinkMap(question, idLinkMap);
            }
        }
    }
    if (nodeData.type === Config.QUESTION_TYPE_CHOICE
        || nodeData.type === Config.QUESTION_TYPE_LIKERT
        || nodeData.type === Config.QUESTION_TYPE_POINT_OF_TIME
        || nodeData.type === Config.QUESTION_TYPE_TEXT
        || nodeData.type === Config.QUESTION_TYPE_TIME_INTERVAL) {
        if (nodeData.nextQuestionId !== null) {
            id = idLinkMap.get(nodeData.nextQuestionId);
            if (id === undefined) {
                id = IdManager.getUnusedId();
                idLinkMap.set(nodeData.nextQuestionId, id);
            }
            nodeData.nextQuestionId = id;
        }
        if (nodeData.previousQuestionId !== null) {
            id = idLinkMap.get(nodeData.previousQuestionId);
            if (id === undefined) {
                id = IdManager.getUnusedId();
                idLinkMap.set(nodeData.previousQuestionId, id);
            }
            nodeData.previousQuestionId = id;
        }
        if (nodeData.type === Config.QUESTION_TYPE_CHOICE) {
            for (let answer of nodeData.answers) {
                getIdLinkMap(answer, idLinkMap);
            }
        }
        
    }
    if (nodeData.type === Config.TYPE_ANSWER) {
        if (nodeData.nextQuestionId !== null) {
            id = idLinkMap.get(nodeData.nextQuestionId);
            if (id === undefined) {
                id = IdManager.getUnusedId();
                idLinkMap.set(nodeData.nextQuestionId, id);
            }
            nodeData.nextQuestionId = id;
        }
    }

    return idLinkMap;
}

function getNewCopy(nodeData, idLinkMap, suffix) {
    let newData = nodeData,
    id;

    if (newData.type === Config.TYPE_EXPERIMENT_GROUP) {
        for (let survey of newData.surveys) {
            if (idLinkMap.get(survey.id) !== undefined) {
                id = idLinkMap.get(survey.id);
            }
            else {
                id = IdManager.getUnusedId();
            }
            survey.id = id;
            if (suffix === undefined) {
                survey.name = survey.name + " (Kopie)";
            }
            else {
                survey.name = survey.name + " " + suffix;
            }
            getNewCopy(survey, idLinkMap);
        }
    }
    if (newData.type === Config.TYPE_SURVEY) {
        for (let step of newData.steps) {
            if (idLinkMap.get(step.id) !== undefined) {
                id = idLinkMap.get(step.id);
            }
            else {
                id = IdManager.getUnusedId();
            }
            step.id = id;
            if (suffix === undefined) {
                step.name = step.name + " (Kopie)";
            }
            else {
                step.name = step.name + " " + suffix;
            }
            getNewCopy(step, idLinkMap);
        }
    }
    if (newData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        for (let question of newData.questions) {
            if (idLinkMap.get(question.id) !== undefined) {
                id = idLinkMap.get(question.id);
            }
            else {
                id = IdManager.getUnusedId();
            }
            question.id = id;
            if (suffix === undefined) {
                question.name = question.name + " (Kopie)";
            }
            else {
                question.name = question.name + " " + suffix;
            }
            getNewCopy(question, idLinkMap);
        }
    }
    if (newData.type === Config.QUESTION_TYPE_CHOICE) {
        for (let answer of newData.answers) {
            if (idLinkMap.get(answer.id) !== undefined) {
                id = idLinkMap.get(answer.id);
            }
            else {
                id = IdManager.getUnusedId();
            }
            answer.id = id;
            if (suffix === undefined) {
                answer.code = answer.code + " (Kopie)";
            }
            else {
                answer.code = answer.code + " " + suffix;
            }
        }
    }
    return newData;
}

function removeWaitForStepLinks(that, stepData, stepToWaitForData, experiment) {
    let nextStepData;

    if (stepData === undefined) {
        return;
    }
    nextStepData = that.getDataById(stepData.nextStepId, experiment);
    if (stepData.waitForStep === stepToWaitForData.id) {
        stepData.waitForStep = 0;
        that.updateExperiment(stepData);
    }
    removeWaitForStepLinks(that, nextStepData, stepToWaitForData, experiment);
}

function removeSubtreeResources(that, node, experiment) {
    let nodeData;
    if (node === undefined) {
        return;
    }
    nodeData = that.getDataById(node.id, experiment);
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
    let experiment = new Experiment(id);

    return experiment;
}

function createNewExperimentGroup(properties) {
    let experiment = Storage.load(),
    group = new ExperimentGroup(properties.id);
    
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
    survey = new Survey(properties.id);
    
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
        step = new Instruction(properties.id);
    }
    else if (properties.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
        step = new BreathingExercise(properties.id);
    }
    else if (properties.type === Config.STEP_TYPE_QUESTIONNAIRE) {
        step = new Questionnaire(properties.id);
    }
    else {
        //console.log("The step type " + properties.type + " is not defined.");
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
        question = new ChoiceQuestion(properties.id);
    }
    else if (properties.type === Config.QUESTION_TYPE_LIKERT) {
        question = new LikertQuestion(properties.id);
    }
    else if (properties.type === Config.QUESTION_TYPE_POINT_OF_TIME) {
        question = new PointOfTimeQuestion(properties.id);
    }
    else if (properties.type === Config.QUESTION_TYPE_TEXT) {
        question = new TextQuestion(properties.id);
    }
    else if (properties.type === Config.QUESTION_TYPE_TIME_INTERVAL) {
        question = new TimeIntervalQuestion(properties.id);
    }
    else {
        //console.log("The question type " + properties.type + " is not defined.");
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
    answer = new Answer(properties.id);
    
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