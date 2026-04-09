import isLoadedFromFile from "../helpers/isLoadedFromFile";

export default class Map {
    constructor (args) {
        this._behaviorId = null;
        this._participants = [];
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the invariant from the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args The arguments to initialize the invariant with.
     */
    _loadArgs (args) {
        const expectedAttributes = ["uid", "start_line", "end_line", "source"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Map", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Map", attr);
            }
            this["_" + attr] = args[attr];
        });
    }

    _loadFromFile (mapJSON) {
        for (const [key, value] of Object.entries(mapJSON)) {
            this[key] = value;
        };
    }

    getBehavior () {
        return this._behaviorId;
    }

    setBehavior (behaviorId) {
        this._behaviorId = behaviorId;
    }

    getParticipants () {
        return this._participants;
    }

    getParticipantByVariable (variableName) {
        return this._participants.find(
            participant => participant.variableName === variableName
        );
    }

    getParticipantByName (participantName) {
        return this._participants.find(
            participant => participant.participantName === participantName
        );
    }

    setParticipant (participantName, variableName) {
        this._participants.push({ participantName, variableName });
    }

    getLineRange () {
        return {startLine: this._start_line, endLine: this._end_line};
    }

    getUid () {
        return this._uid;
    }

    removeBehavior () {
        this._behaviorId = null;
    }

    removeParticipantByName (participantName) {
        this._participants = this._participants.filter(
            participant => participant.participantName !== participantName
        );
    }

    removeParticipantByVariable (variableName) {
        this._participants = this._participants.filter(
            participant => participant.variableName !== variableName
        );
    }
};
