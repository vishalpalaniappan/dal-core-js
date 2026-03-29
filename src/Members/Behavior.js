import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";
import Participant from "./Participant";


class Behavior extends Base {
    /**
     * Initialize the Behavior.
     * @param {String} name
     * @param args
     */
    constructor (args) {
        super();
        this.type = ENGINE_TYPES.BEHAVIOR;
        this.participants = [];
        this.abstractionIds = [];
        this.invalidWorldState = false;
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the provided arguments.
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
     * Loads the behavior from a JSON object.
     * @param {Object} behaviorJSON
     */
    _loadFromFile (behaviorJSON) {
        for (const [key, value] of Object.entries(behaviorJSON)) {
            if (key === "participants") {
                value.forEach(node => this.participants.push(new Participant(node)));
            } else {
                this[key] = behaviorJSON[key];
            }
        };
    }

    /**
     * Adds a participant to the behavior.
     * @param {Participant} participant
     * @returns
     */
    addParticipant (participant) {
        this.participants.push(participant);
        return participant;
    }

    /**
     * Set the participant value.
     * @param {String} participantName
     * @param {*} value
     */
    setParticipantValue (participantName, value) {
        const participant = this.participants.find(obj => obj.name === participantName);
        participant.value = value;
        const violation = participant.enforceInvariants();
        if (violation) {
            this.invalidWorldState = true;
        }
    }

    /**
     * Maps the abstraction id from implementation to the behavior.
     * @param {String} abstractionId ID of mapped abstraction.
     */
    addMapping (abstractionId) {
        /**
         * TODO: After some more thinking, it seems to me that the
         * uniqe identifier should be a file name and line number.
         * It doesn't make sense to create a new abstraction id,
         * however, I will resolve this soon and remove this TODO.
         */
        this.abstractionIds.push(abstractionId);
    }
}

export default Behavior;
