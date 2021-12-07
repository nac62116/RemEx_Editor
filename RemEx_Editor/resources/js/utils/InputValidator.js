import Config from "./Config.js";

class InputValidator {

    experimentIsValid(data, parentData, beforeSaving) {
        let result;
        if (data.type === Config.TYPE_EXPERIMENT) {
            result = this.validateExperiment(data, beforeSaving);
            if (result !== true) {
                return result;
            }
            for (let group of data.groups) {
                result = this.experimentIsValid(group, data, beforeSaving);
                if (result !== true) {
                    return result;
                }
            }
        }
        if (parentData !== undefined) {
            if (data.type === Config.TYPE_EXPERIMENT_GROUP) {
                result = this.validateExperimentGroup(data, parentData, beforeSaving);
                if (result !== true) {
                    return result;
                }
                for (let survey of data.surveys) {
                    result = this.experimentIsValid(survey, data, beforeSaving);
                    if (result !== true) {
                        return result;
                    }
                }
            }
            if (data.type === Config.TYPE_SURVEY) {
                result = this.validateSurvey(data, parentData, beforeSaving);
                if (result !== true) {
                    return result;
                }
                for (let step of data.steps) {
                    result = this.experimentIsValid(step, data, beforeSaving);
                    if (result !== true) {
                        return result;
                    }
                }
            }
            if (parentData.type === Config.TYPE_SURVEY) {
                result = this.validateStep(data, beforeSaving);
                if (result !== true) {
                    return result;
                }
                if (data.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                    for (let question of data.questions) {
                        result = this.experimentIsValid(question, data, beforeSaving);
                        if (result !== true) {
                            return result;
                        }
                    }
                }
            }
            if (parentData.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                result = this.validateQuestion(data, parentData, beforeSaving);
                if (result !== true) {
                    return result;
                }
                if (data.type === Config.QUESTION_TYPE_CHOICE) {
                    for (let answer of data.answers) {
                        result = this.experimentIsValid(answer, data, beforeSaving);
                        if (result !== true) {
                            return result;
                        }
                    }
                }
            }
            if (data.type === Config.TYPE_ANSWER) {
                result = this.validateAnswer(data, parentData);
                if (result !== true) {
                    return result;
                }
            }
        }
        return result;
    }

    validateExperiment(experiment, beforeSaving) {
        let result = true;

        if (beforeSaving) {
            // -> experiment has at least one group
            if (experiment.groups.length === 0) {
                result = {
                    invalidNodeId: experiment.id,
                    alert: Config.EXPERIMENT_AT_LEAST_ONE_GROUP,
                };
            }
        }
        return result;
    }

    validateExperimentGroup(group, experiment, beforeSaving) {
        let result = true,
        invalidInput,
        alert;

        if (beforeSaving) {
            // -> group has at least one survey
            if (group.surveys.length === 0) {
                result = {
                    invalidNodeId: group.id,
                    alert: Config.EXPERIMENT_GROUP_AT_LEAST_ONE_SURVEY,
                };
                return result;
            }
        }
        if (group.name !== undefined) {
            for (let experimentGroup of experiment.groups) {
                if (experimentGroup.name === group.name && experimentGroup.id !== group.id) {
                    invalidInput = "name";
                    alert = Config.EXPERIMENT_GROUP_NAME_NOT_UNIQUE;
                    result = {
                        invalidNodeId: group.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        return result;
    }
    
    validateSurvey(survey, group, beforeSaving) {
        let alert,
        invalidInput,
        surveyTimeInMin,
        groupSurveyTimeInMin,
        timeWindow = {},
        result = true;

        if (beforeSaving) {
            // -> survey has at least one step
            if (survey.steps.length === 0) {
                result = {
                    invalidNodeId: survey.id,
                    alert: Config.SURVEY_AT_LEAST_ONE_STEP,
                };
                return result;
            }
        }
        
        if (survey.name !== undefined) {
            for (let groupSurvey of group.surveys) {
                if (groupSurvey.name === survey.name && groupSurvey.id !== survey.id) {
                    invalidInput = "name";
                    alert = Config.SURVEY_NAME_NOT_UNIQUE;
                    result = {
                        invalidNodeId: survey.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        if (survey.absoluteStartDaysOffset !== undefined
            || survey.absoluteStartAtHour !== undefined
            || survey.absoluteStartAtMinute !== undefined) {

            surveyTimeInMin = survey.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + survey.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + survey.absoluteStartAtMinute;
            for (let groupSurvey of group.surveys) {
                if (groupSurvey.id !== survey.id) {
                    groupSurveyTimeInMin = groupSurvey.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + groupSurvey.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + groupSurvey.absoluteStartAtMinute;
                    timeWindow.start = groupSurveyTimeInMin - groupSurvey.maxDurationInMin - groupSurvey.notificationDurationInMin;
                    timeWindow.end = groupSurveyTimeInMin + groupSurvey.maxDurationInMin + groupSurvey.notificationDurationInMin;
                    if (surveyTimeInMin >= timeWindow.start && surveyTimeInMin <= timeWindow.end) {
                        alert = Config.SURVEY_OVERLAPS;
                        if (survey.absoluteStartDaysOffset !== undefined) {
                            invalidInput = "absoluteStartDaysOffset";
                        }
                        else {
                            invalidInput = "absoluteStartAtHour";
                        }
                        result = {
                            invalidNodeId: survey.id,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
        }
        if (survey.maxDurationInMin !== undefined) {
            if (survey.maxDurationInMin >= Config.SURVEY_MAX_DURATION_IN_MIN) {
                invalidInput = "maxDurationInMin";
                alert = Config.SURVEY_MAX_DURATION_IN_MIN_ALERT;
                result = {
                    invalidNodeId: survey.id,
                    invalidInput: invalidInput,
                    alert: alert,
                };
                return result;
            }
        }
        if (survey.notificationDurationInMin !== undefined) {
            if (survey.notificationDurationInMin >= Config.SURVEY_MAX_NOTIFICATION_DURATION_IN_MIN) {
                invalidInput = "notificationDurationInMin";
                alert = Config.SURVEY_MAX_NOTIFICATION_DURATION_IN_MIN_ALERT;
                result = {
                    invalidNodeId: survey.id,
                    invalidInput: invalidInput,
                    alert: alert,
                };
                return result;
            }
        }
        return result;
    }

    validateStep(step, beforeSaving) {
        let result = true,
        invalidInput,
        alert;

        if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            if (beforeSaving) {
                // -> questionnaire has at least one question
                if (step.questions.length === 0) {
                    result = {
                        invalidNodeId: step.id,
                        alert: Config.QUESTIONNAIRE_AT_LEAST_ONE_QUESTION,
                    };
                    return result;
                }
            }
        }
        if (step.type === Config.STEP_TYPE_INSTRUCTION) {
            if (step.header !== undefined) {
                if (step.header.length > Config.INSTRUCTION_HEADER_MAX_LENGTH) {
                    invalidInput = "header";
                    alert = Config.INPUT_TOO_LONG;
                    result = {
                        invalidNodeId: step.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
            if (step.text !== undefined) {
                if (step.imageFileName !== null || step.videoFileName !== null) {
                    if (step.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG;
                        result = {
                            invalidNodeId: step.id,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
                else {
                    if (step.text.length > Config.INSTRUCTION_TEXT_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG;
                        result = {
                            invalidNodeId: step.id,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
            if ((step.imageFileName !== undefined && step.imageFileName !== null)
                || (step.videoFileName !== undefined && step.videoFileName !== null)) {
                    if (step.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG_WITH_RESOURCE;
                        result = {
                            invalidNodeId: step.id,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
            }
            if (step.waitingText !== undefined) {
                if (step.waitingText.length > Config.INSTRUCTION_WAITING_TEXT_MAX_LENGTH) {
                    invalidInput = "waitingText";
                    alert = Config.INPUT_TOO_LONG;
                    result = {
                        invalidNodeId: step.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        if (step.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
            if (step.durationInMin !== undefined) {
                if (step.durationInMin > Config.BREATHING_EXERCISE_MAX_DURATION_IN_MIN) {
                    invalidInput = "durationInMin";
                    alert = Config.BREATHING_EXERCISE_DURATION_TOO_LONG;
                    result = {
                        invalidNodeId: step.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
            if (step.breathingFrequencyInSec !== undefined) {
                if (step.breathingFrequencyInSec >= Config.BREATHING_EXERCISE_MAX_FREQUENCY_IN_SEC) {
                    invalidInput = "breathingFrequencyInSec";
                    alert = Config.BREATHING_EXERCISE_MAX_FREQUENCY_ALERT;
                    result = {
                        invalidNodeId: step.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        return result;
    }

    validateQuestion(question, questionnaire, beforeSaving) {
        let result = true,
        invalidInput,
        alert;

        if (question.name !== undefined) {
            for (let questionnaireQuestion of questionnaire.questions) {
                if (questionnaireQuestion.name === question.name && questionnaireQuestion.id !== question.id) {
                    invalidInput = "name";
                    alert = Config.QUESTION_NAME_NOT_UNIQUE;
                    result = {
                        invalidNodeId: question.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        if (question.text.length > Config.QUESTION_TEXT_MAX_LENGTH) {
            invalidInput = "text";
            alert = Config.INPUT_TOO_LONG;
            result = {
                invalidNodeId: question.id,
                invalidInput: invalidInput,
                alert: alert,
            };
            return result;
        }
        if (question.hint.length > Config.QUESTION_HINT_MAX_LENGTH) {
            invalidInput = "hint";
            alert = Config.INPUT_TOO_LONG;
            result = {
                invalidNodeId: question.id,
                invalidInput: invalidInput,
                alert: alert,
            };
            return result;
        }
        if (question.type === Config.QUESTION_TYPE_CHOICE) {
            if (beforeSaving) {
                // -> choice question has at least two answers
                if (question.answers.length <= 1) {
                    result = {
                        invalidNodeId: question.id,
                        alert: Config.CHOICE_QUESTION_AT_LEAST_ONE_ANSWER,
                    };
                    return result;
                }
            }
            //
        }
        if (question.type === Config.QUESTION_TYPE_LIKERT) {
            if (question !== null && (question.scaleMinimumLabel !== undefined || question.scaleMaximumLabel !== undefined)) {
                for (let key in question) {
                    if (Object.prototype.hasOwnProperty.call(question, key)) {
                        if (question[key] !== null) {
                            if (question[key].length > Config.LIKERT_QUESTION_SCALE_LABEL_TEXT_MAX_LENGTH) {
                                invalidInput = key;
                                alert = Config.INPUT_TOO_LONG;
                                result = {
                                    invalidNodeId: question.id,
                                    invalidInput: invalidInput,
                                    alert: alert,
                                };
                                return result;
                            }
                        }
                    }
                }
            }
            if (question.initialValue !== undefined) {
                if (question.initialValue > question.itemCount) {
                    invalidInput = "initialValue";
                    alert = Config.LIKERT_QUESTION_SCALE_INITIAL_VALUE_NOT_IN_RANGE;
                    result = {
                        invalidNodeId: question.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
            if (question.itemCount !== undefined) {
                if (question.itemCount > Config.LIKERT_QUESTION_MAX_ITEM_COUNT) {
                    invalidInput = "itemCount";
                    alert = Config.LIKERT_QUESTION_MAX_ITEM_COUNT_ALERT;
                    result = {
                        invalidNodeId: question.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        if (question.type === Config.QUESTION_TYPE_POINT_OF_TIME) {
            if (question.pointOfTimeTypes !== undefined) {
                if (question.pointOfTimeTypes.length === 0) {
                    invalidInput = Config.TYPE_QUESTION;
                    alert = Config.POINT_OF_TIME_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                    result = {
                        invalidNodeId: question.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        if (question.type === Config.QUESTION_TYPE_TIME_INTERVAL) {
            if (question.timeIntervalTypes !== undefined) {
                if (question.timeIntervalTypes.length === 0) {
                    invalidInput = Config.TYPE_QUESTION;
                    alert = Config.TIME_INTERVAL_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                    result = {
                        invalidNodeId: question.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        return result;
    }

    validateAnswer(answer, question) {
        let result = true,
        invalidInput,
        alert;

        if (answer.code !== undefined) {
            for (let questionAnswer of question.answers) {
                if (questionAnswer.code === answer.code && questionAnswer.id !== answer.id) {
                    invalidInput = "code";
                    alert = Config.ANSWER_CODE_NOT_UNIQUE;
                    result = {
                        invalidNodeId: answer.id,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        return result;
    }
}

export default new InputValidator();