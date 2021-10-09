import Config from "./Config.js";

class InputValidator {

    inputIsValid(newInput, node, nodeData, parentData, nextNodeData) {
        let alert,
        invalidInput,
        newTimeInMin,
        timeInMin,
        timeWindow = {},
        result = true;
    
        if (node.type === Config.TYPE_EXPERIMENT_GROUP) {
            if (newInput.name !== undefined) {
                for (let group of parentData.groups) {
                    if (group.name === newInput.name && group !== nodeData) {
                        invalidInput = "name";
                        alert = Config.EXPERIMENT_GROUP_NAME_NOT_UNIQUE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        break;
                    }
                }
            }
        }
        else if (node.type === Config.TYPE_SURVEY) {
            if (newInput.name !== undefined) {
                for (let survey of parentData.surveys) {
                    if (survey.name === newInput.name && survey !== nodeData) {
                        invalidInput = "name";
                        alert = Config.SURVEY_NAME_NOT_UNIQUE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        break;
                    }
                }
            }
            if (newInput.absoluteStartDaysOffset !== undefined
                || newInput.absoluteStartAtHour !== undefined
                || newInput.absoluteStartAtMinute !== undefined) {
    
                if (newInput.absoluteStartDaysOffset !== undefined) {
                    newTimeInMin = newInput.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nodeData.absoluteStartAtMinute;
                }
                if (newInput.absoluteStartAtHour !== undefined) {
                    newTimeInMin = nodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + newInput.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nodeData.absoluteStartAtMinute;
                }
                if (newInput.absoluteStartAtMinute !== undefined) {
                    newTimeInMin = nodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + newInput.absoluteStartAtMinute;
                }
                for (let survey of parentData.surveys) {
                    if (survey !== nodeData) {
                        timeInMin = survey.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + survey.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + survey.absoluteStartAtMinute;
                        timeWindow.start = timeInMin - nodeData.maxDurationInMin - nodeData.notificationDurationInMin;
                        timeWindow.end = timeInMin + survey.maxDurationInMin + survey.notificationDurationInMin;
                        if (newTimeInMin >= timeWindow.start && newTimeInMin <= timeWindow.end) {
                            alert = Config.SURVEY_OVERLAPS;
                            if (newInput.absoluteStartDaysOffset !== undefined) {
                                invalidInput = "absolutesStartDaysOffset";
                            }
                            else {
                                invalidInput = "absoluteStartAtHour";
                            }
                            result = {
                                correspondingNode: node,
                                invalidInput: invalidInput,
                                alert: alert,
                            };
                        }
                    }
                }
            }
            if (nextNodeData !== undefined) {
                if (newInput.maxDurationInMin !== undefined || newInput.notificationDurationInMin !== undefined) {
                    timeInMin = nextNodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nextNodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nextNodeData.absoluteStartAtMinute;
                    newTimeInMin = nodeData.absoluteStartDaysOffset * Config.ONE_DAY_IN_MIN + nodeData.absoluteStartAtHour * Config.ONE_HOUR_IN_MIN + nodeData.absoluteStartAtMinute;
        
                    if (newInput.maxDurationInMin !== undefined) {
                        if (newTimeInMin + nodeData.notificationDurationInMin + newInput.maxDurationInMin >= timeInMin) {
                            invalidInput = "maxDurationInMin";
                            alert = Config.SURVEY_OVERLAPS;
                            result = {
                                correspondingNode: node,
                                invalidInput: invalidInput,
                                alert: alert,
                            };
                        }
                    }
                    else {
                        if (newTimeInMin + newInput.notificationDurationInMin + nodeData.maxDurationInMin >= timeInMin) {
                            invalidInput = "notificationDurationInMin";
                            alert = Config.SURVEY_OVERLAPS;
                            result = {
                                correspondingNode: node,
                                invalidInput: invalidInput,
                                alert: alert,
                            };
                        }
                    }
                }
            }
        }
        else if (node.type === Config.STEP_TYPE_INSTRUCTION) {
            if (newInput.header !== undefined) {
                if (newInput.header.length > Config.INSTRUCTION_HEADER_MAX_LENGTH) {
                    invalidInput = "header";
                    alert = Config.INPUT_TOO_LONG;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                }
            }
            if (newInput.text !== undefined) {
                if (nodeData.imageFileName !== null || nodeData.videoFileName !== null) {
                    if (newInput.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                    }
                }
                else {
                    if (newInput.text.length > Config.INSTRUCTION_TEXT_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                    }
                }
            }
            if ((newInput.imageFileName !== undefined && newInput.imageFileName !== null)
                || (newInput.videoFileName !== undefined && newInput.videoFileName !== null)) {
                    if (nodeData.text.length > Config.INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH) {
                        invalidInput = "text";
                        alert = Config.INPUT_TOO_LONG_WITH_RESOURCE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                    }
            }
            if (newInput.waitingText !== undefined) {
                if (newInput.waitingText.length > Config.INSTRUCTION_WAITING_TEXT_MAX_LENGTH) {
                    invalidInput = "waitingText";
                    alert = Config.INPUT_TOO_LONG;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                }
            }
        }
        else if (node.type === Config.STEP_TYPE_BREATHING_EXERCISE) {
            if (newInput.durationInMin !== undefined) {
                if (newInput.durationInMin > Config.BREATHING_EXERCISE_MAX_DURATION) {
                    invalidInput = "durationInMin";
                    alert = Config.BREATHING_EXERCISE_DURATION_TOO_LONG;
                    result = {
                        correspondingNode: node,
                        invalidInput: invalidInput,
                        alert: alert,
                    };
                }
            }
        }
        else if (node.parentNode !== undefined && node.parentNode.type === Config.STEP_TYPE_QUESTIONNAIRE) {
            if (newInput.name !== undefined) {
                for (let question of parentData.questions) {
                    if (question.name === newInput.name && question !== nodeData) {
                        invalidInput = "name";
                        alert = Config.QUESTION_NAME_NOT_UNIQUE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        break;
                    }
                }
            }
            if (node.type === Config.QUESTION_TYPE_LIKERT) {
                if (newInput.scaleMinimumLabel !== undefined || newInput.scaleMaximumLabel !== undefined) {
                    for (let key in newInput) {
                        if (Object.prototype.hasOwnProperty.call(newInput, key)) {
                            if (newInput[key].length > Config.LIKERT_QUESTION_SCALE_LABEL_TEXT_MAX_LENGTH) {
                                invalidInput = key;
                                alert = Config.INPUT_TOO_LONG;
                                result = {
                                    correspondingNode: node,
                                    invalidInput: invalidInput,
                                    alert: alert,
                                };
                            }
                        }
                    }
                }
                if (newInput.initialValue !== undefined) {
                    if (newInput.initialValue > nodeData.itemCount) {
                        invalidInput = "initialValue";
                        alert = Config.LIKERT_SCALE_INITIAL_VALUE_NOT_IN_RANGE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                    }
                }
            }
            if (node.type === Config.QUESTION_TYPE_POINT_OF_TIME) {
                if (newInput.pointOfTimeTypes !== undefined) {
                    if (newInput.pointOfTimeTypes.length === 0) {
                        invalidInput = Config.TYPE_QUESTION;
                        alert = Config.POINT_OF_TIME_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                    }
                }
            }
            if (node.type === Config.QUESTION_TYPE_TIME_INTERVAL) {
                if (newInput.timeIntervalTypes !== undefined) {
                    if (newInput.timeIntervalTypes.length === 0) {
                        invalidInput = Config.TYPE_QUESTION;
                        alert = Config.TIME_INTERVAL_QUESTION_SELECT_AT_LEAST_ONE_TYPE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                    }
                }
            }
        }
        else if (node.type === Config.TYPE_ANSWER) {
            if (newInput.code !== undefined) {
                for (let answer of parentData.answers) {
                    if (answer.code === newInput.code && answer !== nodeData) {
                        invalidInput = "code";
                        alert = Config.ANSWER_CODE_NOT_UNIQUE;
                        result = {
                            correspondingNode: node,
                            invalidInput: invalidInput,
                            alert: alert,
                        };
                        break;
                    }
                }
            }
        }
        return result;
    }
}

export default new InputValidator();