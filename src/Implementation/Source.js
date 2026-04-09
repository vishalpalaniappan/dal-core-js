import Base from "../Base";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import Map from "./Map";

export default class Source extends Base {
    /**
     * The source object represents a version of a source file in the
     * implementation. It is represented by the content of the source file,
     * a version ID and a statement index that maps statements in the source
     * file to the design. Each entry in the statement index is represented
     * by a map object that contains the behavior ID and the participants.
     * @param {Object} args The arguments to initialize the source object with.
     */
    constructor (args) {
        super();
        this._versionId = null;
        this._content = null;
        this._statementIndex = [];
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the invariant from the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args The arguments to initialize the invariant with.
     */
    _loadArgs (args) {
        const expectedAttributes = ["uid"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Source", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Source", attr);
            }
            this["_" + attr] = args[attr];
        });
    }

    _loadFromFile (mapJSON) {
        for (const [key, value] of Object.entries(mapJSON)) {
            this[key] = value;
        };
    }

    /**
     * Adds entries to the statement index.
     * @param {Array} statementIndex The array of entries to add to the
     * statement index.
     */
    addStatementIndex (statementIndex) {
        for (const value of statementIndex) {
            this._statementIndex.push(new Map(value));
        };
    }

    getStatementIndex () {
        return this._statementIndex;
    }

    getStatementIndexEntryByUid (uid) {
        return this._statementIndex.find(entry => entry.getUid() === uid);
    }

    setVersionId (versionId) {
        this._versionId = versionId;
    }

    getVersionId () {
        return this._versionId;
    }

    setContent (content) {
        this._content = content;
        this._lastModified = new Date();
    }

    getContent () {
        return this._content;
    }
};
