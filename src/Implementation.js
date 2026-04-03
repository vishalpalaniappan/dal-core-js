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
     * Adds a source file to the implementation.
     * @param {String} name Name of the source file.
     * @param {String} key Key of the source file.
     * @param {String} content Content of the source file.
     * @throws {Error} Throws an error if a source file with the given key
     * already exists in the implementation.
     */
    addSourceFile (name, key, content) {
        const found = this._sourceFiles.find(file => file.key === key);
        if (found) {
            throw new Error(`Source file with key ${key} already exists in the implementation.`);
        }
        if (name === "") {
            throw new Error("Source file name cannot be empty.");
        }
        if (key === "") {
            throw new Error("Source file key cannot be empty.");
        }
        this._sourceFiles.push({
            name: name,
            key: key,
            content: content,
        });
    }

    /**
     * Gets the source file given a key.
     * @param {String} key Key of the source file to get.
     * @returns {Object} The source file with the given key.
     * @throws {Error} Throws an error if a source file with the given key
     * does not exist in the implementation.
     */
    getSourceFile (key) {
        const found = this._sourceFiles.find(file => file.key === key);
        if (!found) {
            throw new Error(`Source file with key ${key} does not exist in the implementation.`);
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
     * Sets the statement index for a source file.
     * @param {String} key Key of the source file.
     * @param {Object} statementIndex Statement index to set for source file.
     * @throws {Error} Throws an error if the source file with the
     * given key does not exist in the implementation.
     */
    setStatementIndex (key, statementIndex) {
        const sourceFile = this.getSourceFile(key);
        if (!sourceFile) {
            throw new Error(`Source file with key ${key} does not exist in the implementation.`);
        }
        sourceFile.statementIndex = statementIndex;
    }

    /**
     * Gets the statement index for a source file.
     * @param {String} key Key of the source file.
     * @returns {Object} The statement index of the source file.
     * @throws {Error} Throws an error if the source file with the
     * given key does not exist in the implementation.
     */
    getStatementIndex (key) {
        const sourceFile = this.getSourceFile(key);
        if (!sourceFile) {
            throw new Error(`Source file with key ${key} does not exist in the implementation.`);
        }
        return sourceFile.statementIndex;
    }

}
