class EncodedResource {

    constructor(fileName, base64String) {
        this.fileName = fileName;
        this.base64String = base64String;
    }

    getFileName() {
        return this.fileName;
    }

    getBase64String() {
        return this.base64String;
    }
}

export default EncodedResource;