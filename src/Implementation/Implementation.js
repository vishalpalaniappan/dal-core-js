/**
 * [ImplementationClass]-Contains all the source files.
 *      |
 * [File Class]         -A single source file with its stmt index.
 *      |
 * [Source Class]     - Contains a version of the source for this file.
 *      |
 * [StatementIndexClass]-A index with entries for each stmt in the source.
 *      |
 * [MapClass]        -A map for each entry in index to assign behavior/variable.
 *
 * So the implementation class will expose functions that will make it easy to
 * access the information deeper in the tree.
 *
 * For example, the file class will have functions to assign behavior to stmts,
 * so you can simply call the high level functions are allow the logic to be
 * handled by the engine.
 *
 * For example, if you want to remove a variable from a stmt, the file class
 * will provide a method that accepts a stmtid and variable Name or participant.
 *
 * Then the implementation class will have a method that will produce serialized
 * output that will be accepted by the instrumentation tool. This module will
 * produce the instrumented source.
 *
 * I added a source class because I think we will need to support versions of
 * the source for the given file. This means that each save will produce a new
 * source and the mapping will be assigned to that version. Eventualy when the
 * versioning system is developed, the two versions wil be compared to generate
 * a new mapping that preserves the semantic identity of the statements.
 */

export default class Implementation {

    /**
     * Initializes a new instance of the Implementation class.
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
     * @returns {Object} The source file that was added to the implementation.
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
        const file = {
            name: name,
            path: path,
            content: content,
            updatedContent: null,
            type: "file",
            uid: crypto.randomUUID(),
        }
        this._sourceFiles.push(file);
        return file;
    }

    /**
     * Gets the source file given a UID.
     * @param {String} uid UID of the source file to get.
     * @returns {Object} The source file with the given UID.
     * @throws {Error} Throws an error if a source file with the given UID
     * does not exist in the implementation.
     */
    getSourceFile (uid) {
        const found = this._sourceFiles.find(file => file.uid === uid);
        if (!found) {
            throw new Error(`Source file with UID ${uid} does not exist in the implementation.`);
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
     * @param {String} uid UID of the source file to remove.
     * @throws {Error} Throws an error if a source file with the given UID
     * does not exist in the implementation.
     */
    removeSourceFile (uid) {
        const index = this._sourceFiles.findIndex(file => file.uid === uid);
        if (index === -1) {
            throw new Error(`Source file with UID ${uid} does not exist in the implementation.`);
        }
        this._sourceFiles.splice(index, 1);
    }

    /**
     * Sets the statement index for a source file.
     * @param {String} uid UID of the source file.
     * @param {Object} statementIndex Statement index to set for source file.
     * @throws {Error} Throws an error if the source file with the
     * given UID does not exist in the implementation.
     */
    setStatementIndex (uid, statementIndex) {
        const sourceFile = this.getSourceFile(uid);
        if (!sourceFile) {
            throw new Error(`Source file with UID ${uid} does not exist in the implementation.`);
        }
        sourceFile.statementIndex = statementIndex;
    }

    /**
     * Gets the statement index for a source file.
     * @param {String} uid UID of the source file.
     * @returns {Object} The statement index of the source file.
     * @throws {Error} Throws an error if the source file with the
     * given UID does not exist in the implementation.
     */
    getStatementIndex (uid) {
        const sourceFile = this.getSourceFile(uid);
        if (!sourceFile) {
            throw new Error(`Source file with UID ${uid} does not exist in the implementation.`);
        }
        return sourceFile.statementIndex;
    }


    /**
     * Sets the entry point script for the implementation.
     *
     * Currently, it is basic, for example:
     * python3 library_manager.py <args>
     *
     * @param {String} script Path of the entry point script.
     * @throws {Error} Throws an error if the script is not a string.
     */
    setEntryPoint (script) {
        if (typeof script !== "string") {
            throw new Error("Entry point script must be a string.");
        }
        this._entryPoint = script;
    }

    /**
     * Returns the entry point for this implementation.
     * @returns {String} Entry point script for this implementation.
     */
    getEntryPoint () {
        return this._entryPoint;
    }

}
