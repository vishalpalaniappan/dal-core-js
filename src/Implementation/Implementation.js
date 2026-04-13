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
export default class Implementation extends Base {
    constructor () {
        super();
        this._files = [];
        this._traces = {};
    }

    /**
     * Loads the implementation from a JSON object read from file.
     * @param {Object} json JSON object representing the implementation.
     */
    loadFromJson (json) {
        for (const [key, value] of Object.entries(json)) {
            if (key === "_files") {
                value.forEach(node => this._files.push(new File(node)));
            } else if (key === "_traces") {
                // This is because I am currently serializing the traces using
                // JSON.stringify which is converting the Uint8Array to object
                // I have added a TODO to fix this in the serialize method.
                for (const key of Object.keys(value)) {
                    value[key].trace = Uint8Array.from(Object.values(value[key].trace));
                }
                this._traces = value;
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
        const f = new File({key, name});
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
        file.setStatementIndex(index);
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
     * Gets the file from the given statement index.
     * @param {String} uid UID of the statement to get the file for.
     * @returns {File} The file that contains the statement with the given UID.
     * @throws {Error} Throws an error if a file with the given statement index
     * UID does not exist in the implementation.
     */
    getFileContainingStmtWithUid (uid) {
        const file = this._files.find(file => {
            const statementIndex = file.getStatementIndex();
            return statementIndex && statementIndex.some(entry => entry.getUid() === uid);
        });
        if (!file) {
            throw new Error(`File with statement index uid ${uid} not found in implementation.`);
        }
        return file;
    }


    /**
     * Find all the statements in the implementation with
     * the given behavior.
     * @param {String} behavior Behavior to search for.
     * @returns {Array} List of statements with the given behavior.
     */
    getStatementsWithBehavior (behavior) {
        const statements = [];
        this._files.forEach((file) => {
            file.getStatementsWithBehavior(behavior).forEach(
                (statement) => statements.push(statement)
            );
        });
        return statements;
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
     * Adds an execution trace to the implementation.
     * @param {Object} trace Trace object to add.
     */
    addTrace (trace) {
        if (typeof trace !== "object" || trace === null) {
            throw new Error("Trace must be a non-null object.");
        }
        const {uid} = trace;
        if (!uid) {
            throw new Error("Trace object must have a UID.");
        }
        if (this._traces[uid]) {
            throw new Error(`Trace with UID ${uid} already exists.`);
        }
        trace.timestamp = new Date().toISOString();
        this._traces[uid] = trace;
    }

    /**
     * Deletes an execution trace from the implementation.
     * @param {String} uid UID of the trace to delete.
     */
    deleteTrace (uid) {
        if (!this._traces[uid]) {
            throw new Error(`Trace with UID ${uid} does not exist.`);
        }
        delete this._traces[uid];
    }

    /**
     * Gets an execution trace from the implementation.
     * @param {String} uid UID of the trace to get.
     * @returns {Object} Trace object with the given UID.
     * @throws {Error} Throws an error if a trace with the given UID does
     * not exist.
     */
    getTrace (uid) {
        if (!this._traces[uid]) {
            throw new Error(`Trace with UID ${uid} does not exist.`);
        }
        return this._traces[uid];
    }

    /**
     * Exports implementation in a format that can be used for instrumentation.
     * @returns {Object} Instrumentation package used for instrumenting source.
     */
    exportForInstrumentation () {
        const instrumentationPackage = {};

        this._files.forEach(file => {
            instrumentationPackage[file._uid] = {
                name: file._name,
                key: file._key,
                content: file.getContent(),
                statementIndex: file.getStatementIndex(),
            };
        });
        // TODO: Define expected format.
        return JSON.stringify(instrumentationPackage);
    }
}
