import Config from "./Config.js";

class InputValidator {

    experimentIsValid(experiment) {
        let result = true;

        // -> experiment has at least one group
        if (experiment.groups.length === 0) {
            result = {
                invalidNodeId: experiment.id,
                alert: Config.EXPERIMENT_AT_LEAST_ONE_GROUP,
            };
            return result;
        }
        // -> groups have at least one survey
        for (let group of experiment.groups) {
            if (group.surveys.length === 0) {
                result = {
                    invalidNodeId: group.id,
                    alert: Config.EXPERIMENT_GROUP_AT_LEAST_ONE_SURVEY,
                };
                return result;
            }
            // -> surveys have at least one step
            for (let survey of group.surveys) {
                if (survey.steps.length === 0) {
                    result = {
                        invalidNodeId: survey.id,
                        alert: Config.SURVEY_AT_LEAST_ONE_STEP,
                    };
                    return result;
                }
                // -> questionnaires have at least one question
                for (let step of survey.steps) {
                    if (step.type === Config.STEP_TYPE_QUESTIONNAIRE) {
                        if (step.questions.length === 0) {
                            result = {
                                invalidNodeId: step.id,
                                alert: Config.QUESTIONNAIRE_AT_LEAST_ONE_QUESTION,
                            };
                            return result;
                        }
                        // -> choice questions have at least two answers
                        for (let question of step.questions) {
                            if (question.type === Config.QUESTION_TYPE_CHOICE) {
                                if (question.answers.length <= 1) {
                                    result = {
                                        invalidNodeId: question.id,
                                        alert: Config.CHOICE_QUESTION_AT_LEAST_ONE_ANSWER,
                                    };
                                    return result;
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    inputIsValid(node, nodeData, parentData) {
        let alert,
        invalidInput,
        result = true;
    
        if (node.type === Config.TYPE_EXPERIMENT_GROUP) {
            if (nodeData.name !== undefined) {
                for (let group of parentData.groups) {
                    if (group.name === nodeData.name && group.id !== nodeData.id) {
                        invalidInput = "name";
                        alert = Config.EXPERIMENT_GROUP_NAME_NOT_UNIQUE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
        }
        // TODO: Clean up like here
        else if (node.type === Config.TYPE_SURVEY) {
            result = this.validateSurvey(node, nodeData, parentData);
        }
        else if (node.type === Config.STEP_TYPE_INSTRUCTION) {
            if (nodeData.header !== undefined) {
                if (nodeData.header.length > Config.INSTRUCTION_HEADER_MAX_LENGTH) {
                    invalidInput = "header";
                    alert = Config.INPUT_TOO_LONG;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
            if (nodeData.text !== undefined) {
                if (nodeData.imageFileName !== null || nodeData.videoFileName !== null) {
                    if (nodeData.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
                else {
                    if (nodeData.text.length > Config.INSTRUCTION_TEXT_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
            if ((nodeData.imageFileName !== undefined && nodeData.imageFileName !== null)
                || (nodeData.videoFileName !== undefined && nodeData.videoFileName !== null)) {
                    if (nodeData.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG_WITH_RESOURCE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
            }
            if (nodeData.waitingText !== undefined) {
                if (nodeData.waitingText.length > Config.INSTRUCTION_WAITING_TEXT_MAX_LENGTH) {
                    invalidInput = "waitingText";
                    alert = Config.INPUT_TOO_LONG;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        else if (node.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
            if (nodeData.durationInMin !== undefined) {
                if (nodeData.durationInMin > Config.BREATHING_EXERCISE_MAX_DURATION_IN_MIN) {
                    invalidInput = "durationInMin";
                    alert = Config.BREATHING_EXERCISE_DURATION_TOO_LONG;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
            if (nodeData.breathingFrequencyInSec !== undefined) {
                if (nodeData.breathingFrequencyInSec >= Config.BREATHING_EXERCISE_MAX_FREQUENCY_IN_SEC) {
                    invalidInput = "breathingFrequencyInSec";
                    alert = Config.BREATHING_EXERCISE_MAX_FREQUENCY_ALERT;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        else if (node.parentNode !== undefined && node.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            if (nodeData.name !== undefined) {
                for (let question of parentData.questions) {
                    if (question.name === nodeData.name && question.id !== nodeData.id) {
                        invalidInput = "name";
                        alert = Config.QUESTION_NAME_NOT_UNIQUE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
            if (nodeData.text.length > Config.QUESTION_TEXT_MAX_LENGTH) {
                invalidInput = "text";
                alert = Config.INPUT_TOO_LONG;
                result = {
                    correspondingNode: node,
                    invalidInput: invalidInput,
                    alert: alert,
                };
                return result;
            }
            if (nodeData.hint.length > Config.QUESTION_HINT_MAX_LENGTH) {
                invalidInput = "hint";
                alert = Config.INPUT_TOO_LONG;
                result = {
                    correspondingNode: node,
                    invalidInput: invalidInput,
                    alert: alert,
                };
                return result;
            }
            if (node.type === Config.QUESTION_TYPE_LIKERT) {
                if (nodeData !== null && (nodeData.scaleMinimumLabel !== undefined || nodeData.scaleMaximumLabel !== undefined)) {
                    for (let key in nodeData) {
                        if (Object.prototype.hasOwnProperty.call(nodeData, key)) {
                            if (nodeData[key] !== null) {
                                if (nodeData[key].length > Config.LIKERT_QUESTION_SCALE_LABEL_TEXT_MAX_LENGTH) {
                                    invalidInput = key;
                                    alert = Config.INPUT_TOO_LONG;
                                    result = {
                                        correspondingNode: node,
                                        invalidInput: invalidInput,
                                        alert: alert,
                                    };
                                    return result;
                                }
                            }
                        }
                    }
                }
                if (nodeData.initialValue !== undefined) {
                    if (nodeData.initialValue > nodeData.itemCount) {
                        invalidInput = "initialValue";
                        alert = Config.LIKERT_QUESTION_SCALE_INITIAL_VALUE_NOT_IN_RANGE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
                if (nodeData.itemCount !== undefined) {
                    if (nodeData.itemCount > Config.LIKERT_QUESTION_MAX_ITEM_COUNT) {
                        invalidInput = "itemCount";
                        alert = Config.LIKERT_QUESTION_MAX_ITEM_COUNT_ALERT;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
            if (node.type === Config.QUESTION_TYPE_POINT_OF_TIME) {
                if (nodeData.pointOfTimeTypes !== undefined) {
                    if (nodeData.pointOfTimeTypes.length === 0) {
                        invalidInput = Config.TYPE_QUESTION;
                        alert = Config.POINT_OF_TIME_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
            if (node.type === Config.QUESTION_TYPE_TIME_INTERVAL) {
                if (nodeData.timeIntervalTypes !== undefined) {
                    if (nodeData.timeIntervalTypes.length === 0) {
                        invalidInput = Config.TYPE_QUESTION;
                        alert = Config.TIME_INTERVAL_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
        }
        else if (node.type === Config.TYPE_ANSWER) {
            if (nodeData.code !== undefined) {
                for (let answer of parentData.answers) {
                    if (answer.code === nodeData.code && answer.id !== nodeData.id) {
                        invalidInput = "code";
                        alert = Config.ANSWER_CODE_NOT_UNIQUE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
        }
        return result;
    }
    
    validateSurvey(node, nodeData, parentData) {
        let alert,
        invalidInput,
        nodeTimeInMin,
        surveyTimeInMin,
        timeWindow = {},
        result = true;
        
        if (nodeData.name !== undefined) {
            for (let survey of parentData.surveys) {
                if (survey.name === nodeData.name && survey.id !== nodeData.id) {
                    invalidInput = "name";
                    alert = Config.SURVEY_NAME_NOT_UNIQUE;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                    return result;
                }
            }
        }
        if (nodeData.absoluteStartDaysOffset !== undefined
            || nodeData.absoluteStartAtHour !== undefined
            || nodeData.absoluteStartAtMinute !== undefined) {

            nodeTimeInMin = nodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nodeData.absoluteStartAtMinute;
            for (let survey of parentData.surveys) {
                if (survey.id !== nodeData.id) {
                    surveyTimeInMin = survey.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + survey.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + survey.absoluteStartAtMinute;
                    timeWindow.start = surveyTimeInMin - nodeData.maxDurationInMin - nodeData.notificationDurationInMin;
                    timeWindow.end = surveyTimeInMin + survey.maxDurationInMin + survey.notificationDurationInMin;
                    if (nodeTimeInMin >= timeWindow.start && nodeTimeInMin <= timeWindow.end) {
                        alert = Config.SURVEY_OVERLAPS;
                        if (nodeData.absoluteStartDaysOffset !== undefined) {
                            invalidInput = "absoluteStartDaysOffset";
                        }
                        else {
                            invalidInput = "absoluteStartAtHour";
                        }
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        return result;
                    }
                }
            }
        }
        if (nodeData.maxDurationInMin !== undefined) {
            if (nodeData.maxDurationInMin >= Config.SURVEY_MAX_DURATION_IN_MIN) {
                invalidInput = "maxDurationInMin";
                alert = Config.SURVEY_MAX_DURATION_IN_MIN_ALERT;
                result = {
                    correspondingNode: node,
                    invalidInput: invalidInput,
                    alert: alert,
                };
                return result;
            }
        }
        if (nodeData.notificationDurationInMin !== undefined) {
            if (nodeData.notificationDurationInMin >= Config.SURVEY_MAX_NOTIFICATION_DURATION_IN_MIN) {
                invalidInput = "notificationDurationInMin";
                alert = Config.SURVEY_MAX_NOTIFICATION_DURATION_IN_MIN_ALERT;
                result = {
                    correspondingNode: node,
                    invalidInput: invalidInput,
                    alert: alert,
                };
                return result;
            }
        }
        return result;
    }

}

export default new InputValidator();