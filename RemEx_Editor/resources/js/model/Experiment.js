import Config from "../utils/Config.js";

class Experiment {

    constructor() {
        this.name = undefined;
        this.groups = [];
        this.encodedResources = [];
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getGroupCount() {
        return this.groups.length;
    }

    getGroupByName(groupName) {
        for (let group of this.groups) {
            if (group.getName() === groupName) {
                return group;
            }
        }
        return null;
    }

    addGroup(group) {
        if (!this.groups.includes(group)) {
            this.groups.push(group);
        }
    }

    removeGroup(group) {
        let index = this.groups.indexOf(group);
        if (index !== -1) {
            this.groups.splice(index, 1);
        }
    }

    getEncodedResourceByFileName(fileName) {
        for (let resource of this.encodedResources) {
            if (resource.getFileName() === fileName) {
                return resource;
            }
        }
        return null;
    }

    addEncodedResource(encodedResource) {
        let fileName = resourceAlreadyExists(this, encodedResource);
        if (fileName === null) {
            this.encodedResources.push(encodedResource);
        }
        return fileName;
    }

    removeEncodedResource(encodedResource) {
        if (!isInUse(this, encodedResource)) {
            let index = this.encodedResources.indexOf(encodedResource);
            if (index !== -1) {
                this.encodedResources.splice(index, 1);
            }
        }
    }
}

function resourceAlreadyExists(that, newResource) {
    let base64String = newResource.getBase64String();
    for (let existingResource of that.encodedResources) {
        if (existingResource.getBase64String() === base64String) {
            return existingResource.getFileName();
        }
    }
    return null;
}

function isInUse(that, encodedResource) {
    let fileName = encodedResource.getFileName();
    for (let group of that.groups) {
        for (let survey of group.getSurveys()) {
            for (let step of survey.getSteps()) {
                if (step.getType() === Config.STEP_TYPE_INSTRUCTION) {
                    if (step.getImageFileName() === fileName || step.getVideoFileName() === fileName) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

export default Experiment;