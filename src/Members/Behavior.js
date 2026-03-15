import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import ENGINE_TYPES from "../TYPES";
import Participant from "./Participant";
/**
 * Class representing a Behavior in the design.
 */
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
        this.invalidWorldState = false;
        if (typeof args === "object" && Object.hasOwn(args, "uid")) {
            this.loadBehaviorFromJSON(args);
        } else {
            this.loadArgs(args);
        }
    }

    /**
     * Loads the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args
     */
    loadArgs (args) {
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
    loadBehaviorFromJSON (behaviorJSON) {
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
    addParticpant (participant) {
        this.participants.push(participant);
        return participant;
    }

    /**
     * Set the participant value.
     * @param {String} participantName
     * @param {*} value
     */
    setParticipantValue (participantName, value) {
        for (let i = 0; i < this.participants.length; i++) {
            const participant = this.participants[i];
            if (participant.name === participantName) {
                participant.value = value;
                const violation = participant.enforceInvariants();
                if (violation) {
                    this.invalidWorldState = true;
                }
            }
        }
    }
}

export default Behavior;
