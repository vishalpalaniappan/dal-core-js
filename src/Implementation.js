export default class Implementation {

    /**
     * This class contains the implementation of a design. It contains the
     * source files that realize the design and it also contains the parsed
     * abstractions for each source file. The implementation is loaded by
     * the workspace to allow the developer to implement the design
     *
     * Each time the source file is saved, a version of it is preserved and
     * a new mapping file is created. In this process, the versions of the
     * source file are diff'ed and the semantic identity of the statements is
     * preserved.
     */
    constructor () {
        this._sourceFiles = [];
    }

    /**
     * Loads the implementation from a JSON object read from file.
     * @param {Object} json JSON object representing the implementation.
     */
    loadFromJson (json) {
        for (const [key, value] of Object.entries(json)) {
            if (key === "_sourceFiles") {
                value.forEach(file => this._sourceFiles.push(file));
            } else {
                this[key] = json[key];
            }
        };
    }

    /**
     * Adds a source file to the implementation.
     * @param {String} name Name of the source file.
     * @param {String} path Path of the source file.
     * @param {String} content Content of the source file.
     * @throws {Error} Throws an error if a source file with the given path
     * already exists in the implementation.
     */
    addSourceFile (name, path, content) {
        const found = this._sourceFiles.find(file => file.path === path);
        if (found) {
            throw new Error(`Source file with path ${path} already exists in the implementation.`);
        }
        if (name === "") {
            throw new Error("Source file name cannot be empty.");
        }
        if (path === "") {
            throw new Error("Source file path cannot be empty.");
        }
        this._sourceFiles.push({
            name: name,
            path: path,
            content: content,
            uid: crypto.randomUUID(),
        });
    }

    /**
     * Gets the source file given a path.
     * @param {String} path Path of the source file to get.
     * @returns {Object} The source file with the given path.
     * @throws {Error} Throws an error if a source file with the given path
     * does not exist in the implementation.
     */
    getSourceFile (path) {
        const found = this._sourceFiles.find(file => file.path === path);
        if (!found) {
            throw new Error(`Source file with path ${path} does not exist in the implementation.`);
        }
        return found;
    }

    /**
     * Get all the source files in the implementation.
     * @returns {Array} List of source files in the implementation.
     */
    getSourceFiles () {
        return this._sourceFiles;
    }

    /**
     * Removes a source file from the implementation.
     * @param {String} path Path of the source file to remove.
     * @throws {Error} Throws an error if a source file with the given path
     * does not exist in the implementation.
     */
    removeSourceFile (path) {
        const index = this._sourceFiles.findIndex(file => file.path === path);
        if (index === -1) {
            throw new Error(`Source file with path ${path} does not exist in the implementation.`);
        }
        this._sourceFiles.splice(index, 1);
    }

    /**
     * Sets the statement index for a source file.
     * @param {String} path Path of the source file.
     * @param {Object} statementIndex Statement index to set for source file.
     * @throws {Error} Throws an error if the source file with the
     * given path does not exist in the implementation.
     */
    setStatementIndex (path, statementIndex) {
        const sourceFile = this.getSourceFile(path);
        if (!sourceFile) {
            throw new Error(`Source file with path ${path} does not exist in the implementation.`);
        }
        sourceFile.statementIndex = statementIndex;
    }

    /**
     * Gets the statement index for a source file.
     * @param {String} path Path of the source file.
     * @returns {Object} The statement index of the source file.
     * @throws {Error} Throws an error if the source file with the
     * given path does not exist in the implementation.
     */
    getStatementIndex (path) {
        const sourceFile = this.getSourceFile(path);
        if (!sourceFile) {
            throw new Error(`Source file with path ${path} does not exist in the implementation.`);
        }
        return sourceFile.statementIndex;
    }

}
