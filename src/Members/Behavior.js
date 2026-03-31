import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import ParticipantAlreadyExistsError from "../Errors/ParticipantAlreadyExistsError";
import UnknownParticipantError from "../Errors/UnknownParticipantError";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";
import Participant from "./Participant";


class Behavior extends Base {
    /**
     * Initialize the Behavior.
     *
     * @param {String} name
     * @param args
     */
    constructor (args) {
        super();
        this._type = ENGINE_TYPES.BEHAVIOR;
        this._participants = [];
        this._abstractionIds = [];
        this._invalidWorldState = false;
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the provided arguments.
     *
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args
     */
    _loadArgs (args) {
        const expectedAttributes = ["name"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Behavior", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Behavior", attr);
            }
            this[attr] = args[attr];
        });
    }

    /**
     * Loads the behavior from a JSON object that was read from file.
     *
     * @param {Object} behaviorJSON The JSON object representing the behavior
     * read from file.
     */
    _loadFromFile (behaviorJSON) {
        for (const [key, value] of Object.entries(behaviorJSON)) {
            if (key === "_participants") {
                value.forEach(node => this._participants.push(new Participant(node)));
            } else {
                this[key] = behaviorJSON[key];
            }
        };
    }

    /**
     * Returns the list of participants in the behavior.
     * @returns {Array} List of participants in the behavior.
     */
    getParticipants () {
        return this._participants;
    }

    /**
     * Returns the list of participants in the behavior.
     * @param participantName Name of the participant to return.
     * @returns {Participant} The participant with the provided name.
     * @throws {UnknownParticipantError} Thrown when a participant with the
     * provided name does not exist in the behavior.
     */
    getParticipant (participantName) {
        const index = this._participants.findIndex(p => p.name === participantName);
        if (index === -1) {
            throw new UnknownParticipantError(participantName);
        }
        return this._participants[index];
    }

    /**
     * Adds a participant to the behavior.
     *
     * @param {String} participantName The name of the participant to add.
     * @returns {String} The name of the added participant.
     * @throws {ParticipantAlreadyExistsError} Thrown when a participant with
     * the same name already exists in the behavior.
     */
    addParticipant (participantName) {
        if (this._participants.some(p => p.name === participantName)) {
            throw new ParticipantAlreadyExistsError(participantName);
        }
        this._participants.push(
            new Participant (
                {name: participantName}
            )
        );
        return participantName;
    }

    /**
     * Removes a participant from the behavior.
     * @param {String} participantName
     * @throws {UnknownParticipantError} Thrown when a participant with the
     * provided name does not exist in the behavior.
     */
    removeParticipant (participantName) {
        const index = this._participants.findIndex(p => p.name === participantName);
        if (index === -1) {
            throw new UnknownParticipantError(participantName);
        }
        this._participants.splice(index, 1);
    }

    /**
     * Sets the value of a participant and checks for invariant violations.
     * If any invariant is violated, the world state for this behavior is
     * marked as invalid.
     *
     * @param {String} name Name of the participant whose value is being set.
     * @param {*} value Value to set for the participant.
     * @throws {UnknownParticipantError} Thrown when a participant with the
     * provided name does not exist in the behavior.
     */
    setParticipantValue (name, value) {
        const participant = this._participants.find(obj => obj.name === name);
        if (!participant) {
            throw new UnknownParticipantError(name);
        }
        participant.value = value;
        if (participant.enforceInvariants()) {
            this._invalidWorldState = true;
        }
    }

    /**
     * Maps the abstraction id from implementation to the behavior.
     *
     * @param {String} abstractionId ID of mapped abstraction.
     */
    addMapping (abstractionId) {
        /**
         * TODO: After some more thinking, it seems to me that the
         * uniqe identifier should be a file name and line number.
         * It doesn't make sense to create a new abstraction id,
         * however, I will resolve this soon and remove this TODO.
         */
        this._abstractionIds.push(abstractionId);
    }
}

export default Behavior;
