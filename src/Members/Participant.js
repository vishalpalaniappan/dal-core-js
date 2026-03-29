import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";
import Invariant from "./Invariant";

/**
 * Class representing a participant in the design.
 */
class Participant extends Base {
    /**
     * Initialize the semantic participant.
     * @param {String} name
     * @param args
     */
    constructor (args) {
        super();
        this.type = ENGINE_TYPES.PARTICIPANT;
        this.invariants = [];
        this.abstractionId = null;
        this.invariantViolated = false;
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
            throw new MissingAttributes("Participant", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Participant", attr);
            }
            this[attr] = args[attr];
        });
    }

    /**
     * Loads the participant from a JSON object.
     * @param {Object} participantJSON
     */
    _loadFromFile (participantJSON) {
        for (const [key, value] of Object.entries(participantJSON)) {
            if (key === "invariants") {
                value.forEach(node => this.invariants.push(new Invariant(node)));
            } else {
                this[key] = participantJSON[key];
            }
        };
    }

    /**
     * Adds an invariant to the participant.
     * @param {Invariant} invariant
     * @returns
     */
    addInvariant (invariant) {
        this.invariants.push(invariant);
        return invariant;
    }

    /**
     * Sets the value of the participant.
     * @param {*} value
     */
    setValue (value) {
        this.value = value;
    }

    /**
     * Enforces the particiants invariants.
     * @returns {Boolean}
     */
    enforceInvariants () {
        this.invariantViolated = false
        this.invariantViolationCount = 0;
        for (let i = 0; i < this.invariants.length; i++) {
            if (this.invariants[i].evaluate(this.value)) {
                this.invariantViolated = true;
                this.invariantViolationCount++;
            }
        }
        return this.invariantViolated;
    }

    /**
     * Map the abstraction ID from the execution to the participant.
     *
     * This abstraction id will be used to assign a value to the
     * participant from the execution using the logged abstraction id.
     *
     * @param {String} abstractionId
     */
    mapAbstraction (abstractionId) {
        this.abstractionId = abstractionId;
    }
}

export default Participant;
