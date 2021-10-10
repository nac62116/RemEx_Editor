import Config from "./Config.js";

class InputValidator {

    inputIsValid(node, nodeData, parentData) {
        let alert,
        invalidInput,
        nodeTimeInMin,
        surveyTimeInMin,
        timeWindow = {},
        result = true;
    
        if (node.type === Config.TYPE_EXPERIMENT_GROUP) {
            if (nodeData.name !== undefined) {
                for (let group of parentData.groups) {
                    if (group.name === nodeData.name && group !== nodeData) {
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
        else if (node.type === Config.TYPE_SURVEY) {
            if (nodeData.name !== undefined) {
                for (let survey of parentData.surveys) {
                    if (survey.name === nodeData.name && survey !== nodeData) {
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
                    if (survey !== nodeData) {
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
                if (nodeData.durationInMin > Config.BREATHING_EXERCISE_MAX_DURATION) {
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
        }
        else if (node.parentNode !== undefined && node.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            if (nodeData.name !== undefined) {
                for (let question of parentData.questions) {
                    if (question.name === nodeData.name && question !== nodeData) {
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
            if (node.type === Config.QUESTION_TYPE_LIKERT) {
                if (nodeData.scaleMinimumLabel !== undefined || nodeData.scaleMaximumLabel !== undefined) {
                    for (let key in nodeData) {
                        if (Object.prototype.hasOwnProperty.call(nodeData, key)) {
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
                if (nodeData.initialValue !== undefined) {
                    if (nodeData.initialValue > nodeData.itemCount) {
                        invalidInput = "initialValue";
                        alert = Config.LIKERT_SCALE_INITIAL_VALUE_NOT_IN_RANGE;
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
                    if (answer.code === nodeData.code && answer !== nodeData) {
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
}

export default new InputValidator();