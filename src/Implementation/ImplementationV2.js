import Base from "../Base";
import File from "./File";

/**
 * Note: I am migrating away from the existing implementation class in stages.
 * This class will eventually replace the existing implementation class.
 *
 * The problem is I haven't merged the existing implementation but once I
 * migrate to using this new implementation class, I will update the workbench
 * to use this new implementation and then I will merge engine into main before
 * I add any more features.
 */
export default class ImplementationV2 extends Base {
    constructor () {
        super();
        this._files = [];
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
     * Add a source file to the implementation.
     * @param {String} key Key of the source file (used to create directories).
     * @param {String} name Name of the source file.
     * @param {String} content Content of the source file.
     * @returns {File} The file that was added to the implementation.
     */
    addFile (key, name, content) {
        const f = new File(key, name);
        f.addVersion();
        f.setContent(content);
        this._files.push(f);
        return f;
    }

    /**
     * Get the file with the given UID.
     * @param {String} uid UID of the file to get.
     * @returns {File} The file with the given UID.
     * @throws {Error} Throws an error if a file with the given UID does not
     * exist in the implementation.
     */
    getFile (uid) {
        const file = this._files.find(file => file._uid === uid);
        if (!file) {
            throw new Error(`File with uid ${uid} not found in implementation.`);
        }
        return file;
    }

    /**
     * Returns the files in the implementaiton.
     * @returns {Array} List of files in the implementation.
     */
    getFiles () {
        return this._files;
    }

    /**
     * Remove the file with the given UID from the implementation.
     * @param {String} uid UID of the file to remove.
     * @throws {Error} Throws an error if a file with the given UID does not
     * exist in the implementation.
     */
    removeFile (uid) {
        const fileIndex = this._files.findIndex(file => file._uid === uid);
        if (fileIndex === -1) {
            throw new Error(`File with uid ${uid} not found in implementation.`);
        }
        this._files.splice(fileIndex, 1);
    }

    /**
     * Sets the statement index for a file in the implementation.
     * @param {String} uid UID of the file.
     * @param {Object} index Statement index to set for the file.
     * @throws {Error} Throws an error if a file with the given UID does not
     * exist in the implementation.
     */
    setStatementIndexForFile (uid, index) {
        const file = this.getFile(uid);
        file.addStatementIndex(index);
    }

    /**
     * Gets the statement index for a file in the implementation.
     * @param {String} uid UID of the file.
     * @returns {Object} The statement index of the file.
     * @throws {Error} Throws an error if a file with the given UID does not
     * exist in the implementation.
     */
    getStatementIndexForFile (uid) {
        const file = this.getFile(uid);
        return file.getStatementIndex();
    }

    /**
     * Sets the entry point script to run the implementation.
     * @param {String} entryPoint Entry point to execute implementation.
     */
    setEntryPoint (entryPoint) {
        if (typeof entryPoint !== "string") {
            throw new Error("Entry point script must be a string.");
        }
        this._entryPoint = entryPoint;
    }

    /**
     * Returns the entry point script to run the implementation.
     * @returns {String} Entry point string.
     */
    getEntryPoint () {
        return this._entryPoint;
    }

    /**
     * Exports implementation in a format that can be used for instrumentation.
     * @returns {Object} Instrumentation package used for instrumenting source.
     */
    exportForInstrumentation () {
        const instrumentationPackage = {};
        // TODO: Define expected format.
        return instrumentationPackage;
    }
}
