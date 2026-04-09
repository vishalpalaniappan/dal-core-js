import Base from "../Base";
import isLoadedFromFile from "../helpers/isLoadedFromFile";

export default class Map extends Base {
    /**
     * This class represents an entry in the statement index of a source object.
     * The entries are populated with information extracted by parsing the
     * source into mappable statements. Each mappable statement is identified
     * by a uid, a start line, end line. The src is an optional field that is
     * extracted but it is useful to the mapping container in the UI.
     *
     * This map object provides a mechanism to map a behavior and its
     * participants onto itself. This means that you can set a behavior
     * and remove a behavior from the map. You can set or remove the
     * participant and the corresponding variable name. There can be many
     * participants mapped to this object but there can only be one behavior.
     *
     * When the implementation is prepare for instrumentation, it will iterate
     * through each of the maps in each files statement index, extract the
     * behavior, participants and variable values and use that to inform the
     * instrumentation of the source file.
     *
     * @param {Object} args
     * @param {String} args.uid Unique identifier for the map entry.
     * @param {Number} args.start_line Start line num of stmt in the src file.
     * @param {Number} args.end_line End line num of stmt in the src file.
     * @param {String} args.source The src of the statement.
     */
    constructor (args) {
        super();
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

    /**
     * Loads the map from a JSON object read from serialized output.
     * @param {Object} mapJSON JSON object read from serialized output.
     */
    _loadFromFile (mapJSON) {
        for (const [key, value] of Object.entries(mapJSON)) {
            this[key] = value;
        };
    }

    /**
     * Returns the behavior assigned to this map entry.
     * @returns {String} Behavior assigned to this stmt.
     */
    getBehavior () {
        return this._behaviorId;
    }

    /**
     * Sets the behavior for this map entry.
     * @param {String} behaviorId The behavior ID to assign.
     */
    setBehavior (behaviorId) {
        this._behaviorId = behaviorId;
    }

    /**
     * Returns the participants assigned to this map entry.
     * @returns {Array} Array of participants.
     */
    getParticipants () {
        return this._participants;
    }

    /**
     * Returns a participant by its name.
     * @param {String} participantName The name of the participant.
     * @returns {Object} The participant object.
     */
    getParticipantByName (participantName) {
        return this._participants.find(
            participant => participant.participantName === participantName
        );
    }

    /**
     * Sets a participant for this map entry.
     * @param {String} participantName The name of the participant.
     * @param {String} variableName The var name associated with the participant
     */
    setParticipant (participantName, variableName) {
        this._participants.push({participantName, variableName});
    }

    /**
     * Returns the range of lines for this stmt in the source.
     * @returns {Object} Object containing start and end line.
     */
    getLineRange () {
        return {startLine: this._start_line, endLine: this._end_line};
    }

    /**
     * Returns the UID of this statement.
     * @returns {String} UID of this statement.
     */
    getUid () {
        return this._uid;
    }

    /**
     * Removes the behavior assigned to this map entry.
     */
    removeBehavior () {
        this._behaviorId = null;
    }

    /**
     * Removes a participant by its name.
     * @param {String} participantName The name of the participant to remove.
     */
    removeParticipantByName (participantName) {
        this._participants = this._participants.filter(
            participant => participant.participantName !== participantName
        );
    }
};
