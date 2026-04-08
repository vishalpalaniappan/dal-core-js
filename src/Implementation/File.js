export default class File {
    constructor (name, path, content) {
        if (name === "") {
            throw new Error("File name cannot be empty.");
        }
        this.name = name;
        this.path = path;
        this.content = content;
        this.uid = crypto.randomUUID();
        this.statementIndex = null;
    }

    addStatementIndex (statementIndex) {
        this.statementIndex = statementIndex;
    }

    getStatementIndex () {
        return this.statementIndex;
    }

    getSource () {
        return this.content;
    }
};
