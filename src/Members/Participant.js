import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import UnknownInvariantError from "../Errors/UnknownInvariantError";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";
import Invariant from "./Invariant";

class Participant extends Base {
    /**
     * Class representing a participant in the design. The participants are
     * entites in deisgn that participate in the behavior. They are mapped onto
     * the implementation and their value is loaded from the execution. The
     * participants define a valid world state for the behavior to happen in
     * through invariants. When the value of the participant violates an
     * invariant, the design has entered a semantically invalid state and is
     * the root cause of downstream failure(s).
     *
     * @param {Object} args The arguments to initialize the participant.
     */
    constructor (args) {
        super();
        this._type = ENGINE_TYPES.PARTICIPANT;
        this._invariants = [];
        this._abstractionId = null;
        this._invariantViolated = false;
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
            this["_" + attr] = args[attr];
        });
    }

    /**
     * Loads the participant from a JSON object.
     * @param {Object} participantJSON The JSON object read from file.
     */
    _loadFromFile (participantJSON) {
        for (const [key, value] of Object.entries(participantJSON)) {
            if (key === "_invariants") {
                value.forEach(node => this._invariants.push(new Invariant(node)));
            } else {
                this[key] = participantJSON[key];
            }
        };
    }

    /**
     * Sets the value of this participant.
     * @param {*} value The value to set for the participant.
     */
    setValue (value) {
        this._value = value;
    }

    /**
     * Returns the value of this participant.
     * @returns {*} Value of participant.
     */
    getValue () {
        return this._value;
    }

    /**
     * Returns the name of this participant.
     * @returns {String} Name of participant.
     */
    getName () {
        return this._name;
    }

    /**
     * Adds an invariant to this participant.
     * @param {Invariant} invariant The invariant to add.
     */
    addInvariant (invariant) {
        this._invariants.push(invariant);
    }

    /**
     * Removes the invariant from the participant.
     * @param {String|Invariant} invariant The invariant or name of the
     * invariant to remove.
     */
    removeInvariant (invariant) {
        if (typeof invariant === "string") {
            const foundInv = this._invariants.find((inv) => inv.getName() === invariant);
            if (foundInv) {
                this._invariants = this._invariants.filter((inv) => inv.getName() !== invariant);
            } else {
                throw new UnknownInvariantError(invariant);
            }
        } else {
            console.log(this._invariants)
            const foundInv = this._invariants.find((inv) => inv.getName() === invariant.getName());
            if (!foundInv) {
                throw new UnknownInvariantError(invariant.getName());
            }
            this._invariants = this._invariants.filter((inv) => inv !== invariant);
        }
    }

    /**
     * Get the invariant with the given name from this participant.
     * @param {String} invariantName
     * @returns {Invariant} The invariant with the given name.
     */
    getInvariant (invariantName) {
        const foundInvariant = this._invariants.find(
            invariant => invariant.getName() === invariantName
        );
        if (!foundInvariant) {
            throw new UnknownInvariantError(invariantName);
        }
        return foundInvariant;
    }

    /**
     * Returns all the invariants for this participant.
     * @returns {Array} All the invariants for this participant.
     */
    getInvariants () {
        return this._invariants;
    }

    /**
     * Evaluates all the invariants for this participant.
     * Sets the _invariantViolated flag to true if any invariant is violated.
     */
    evaluateInvariants () {
        this._invariantViolated = false;
        this._invariants.forEach((invariant) => {
            if (invariant.evaluate(this._value)) {
                this._invariantViolated = true;
            }
        });
    };

    /**
     * Map the abstraction ID from the execution to the participant.
     *
     * This abstraction id will be used to assign a value to the
     * participant from the execution using the logged abstraction id.
     *
     * @param {String} abstractionId The abstraction ID to map to the
     * participant.
     */
    mapAbstraction (abstractionId) {
        /**
         * TODO: Much like the behavior, I am settling on a clean way to map
         * the participant onto the implementation without introducing new
         * unncessary layers.
         */
        this._abstractionId = abstractionId;
    }
}

export default Participant;
