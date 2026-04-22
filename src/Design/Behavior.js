import isEqual from "lodash/isEqual";

import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import ParticipantAlreadyExistsError from "../Errors/ParticipantAlreadyExistsError";
import UnknownParticipantError from "../Errors/UnknownParticipantError";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";
import BehavioralLanguageParser from "./BehavioralLanguage/BehavioralLanguageParser";
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
        this._primitives = [];
        this._primitiveArgs = {};
        this._transformer = new BehavioralLanguageParser();
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the provided arguments.
     *
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args
     */
    _loadArgs (args) {
        const expectedAttributes = ["name", "description"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Behavior", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Behavior", attr);
            }
            this["_" + attr] = args[attr];
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
     * Returns the description of the design.
     * @returns {String} Description.
     */
    getDescription () {
        return this._description;
    }

    /**
     * Get name of behavior.
     * @returns {String} Name of behavior.
     */
    getName () {
        return this._name;
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
     * @param {Participant|String} participant Name of the participant
     * or participant object to get.
     * @returns {Participant} The participant with the provided name.
     * @throws {UnknownParticipantError} Thrown when a participant with the
     * provided name does not exist in the behavior.
     */
    getParticipant (participant) {
        const p = participant;
        const index = this._participants.findIndex(
            entry => entry.getName() === (p instanceof Participant ? p.getName() : p)
        );
        if (index === -1) {
            throw new UnknownParticipantError(p instanceof Participant ? p.getName() : p);
        }
        return this._participants[index];
    }

    /**
     * Adds a participant to the behavior.
     *
     * @param {Participant} participant The participant to add.
     * @returns {Participant} The participant that was added.
     * @throws {ParticipantAlreadyExistsError} Thrown when a participant with
     * the same name already exists in the behavior.
     */
    addParticipant (participant) {
        if (this._participants.some(p => p.getName() === participant.getName())) {
            throw new ParticipantAlreadyExistsError(participant.getName());
        }
        this._participants.push(participant);
        return participant;
    }

    /**
     * Removes a participant from the behavior.
     * @param {Participant|String} participant The participant to remove.
     * @throws {UnknownParticipantError} Thrown when a participant with the
     * provided name does not exist in the behavior.
     */
    removeParticipant (participant) {
        const p = participant;
        const index = this._participants.findIndex(
            entry => entry.getName() === (p instanceof Participant ? p.getName() : p)
        );
        if (index === -1) {
            throw new UnknownParticipantError(p instanceof Participant ? p.getName() : p);
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
        const participant = this._participants.find(obj => obj.getName() === name);
        if (!participant) {
            throw new UnknownParticipantError(name);
        }
        participant.setValue(value);
    }

    /**
     * Maps the abstraction id from implementation to the behavior.
     * TODO: Deprecated, removed.
     * @param {String} abstractionId ID of mapped abstraction.
     */
    addMapping (abstractionId) {
        this._abstractionIds.push(abstractionId);
    }

    /**
     * Removes a mapping from the behavior.
     * TODO: Deprecated, removed.
     * @param {String} abstractionId ID of the mapped abstraction to remove.
     */
    removeMapping (abstractionId) {
        this._abstractionIds = this._abstractionIds.filter(id => id !== abstractionId);
    }

    // ===== METHODS FOR EXECUTING BEHAVIOR =====
    /**
     * Adds a primitive instruction to the behavior.
     * @param {String} primitive Primitive instruction.
     */
    addPrimitive (primitive) {
        this._primitives.push(primitive);
    }

    /**
     * Adds multiple primitive instructions to the behavior.
     * @param {String} primitives Primitive instructions separated by newlines.
     */
    addPrimitives (primitives) {
        const _primitives = primitives.split("\n");
        _primitives.forEach(primitive => this.addPrimitive(primitive));
    }

    /**
     * Sets the pre-world state of the behavior. This is the state
     * of the participants before the behavior is executed.
     * @param {Objet} preWorldState State of participants.
     */
    setPreWorldState (preWorldState) {
        this._preWorldState = preWorldState;
        this._currentWorldState = preWorldState;
    }

    /**
     * Sets the post-world state of the behavior. This is the state
     * of the participants after the behavior is executed.
     * @param {Object} postWorldState State of participants.
     */
    setPostWorldState (postWorldState) {
        this._postWorldState = postWorldState;
    }

    /**
     * Sets the arguments for the behavior. This is used for
     * primitives that require arguments, such as the create
     * primitive which requires an initial value.
     * @param {Object} args Arguments for the behavior.
     */
    setPrimitiveArgs (args) {
        this._primitiveArgs = args;
    }

    /**
     * Sets the valid preconditions for the behavior. The validity
     * of the behavior is determined by checking whether the world
     * state satisfies these preconditions. In this way, the
     * preconditions establish control flow purely through the
     * semantics of the behavior.
     *
     * @param {Object} preConditions Preconditions for the behavior.
     */
    setValidPreconditions (preConditions) {
        this._validPreconditions = preConditions;
    }

    /**
     * This method computes the transformations on the world state by
     * executing the primitives. It produces an output world state that
     * can be compared to the observed world state to identify if it
     * is semantically valid.
     * @returns {Array} The first element is the world state produced by
     * executing the behavior, and the second element is a boolean flag
     * indicating whether the produced world state is valid with respect
     * to the observed world state.
     */
    computeTransformations () {
        for (const primitive of this._primitives) {
            // execute primitive and update world state
            const updatedParticipants = this._transformer.execute(
                primitive, this._currentWorldState, this._primitiveArgs
            );
            this._currentWorldState = updatedParticipants;
        }
        return [this._currentWorldState, this.isTransformationValid()];
    }

    /**
     * Flags if the world state produced by the transformation and the
     * observed world state are valid with respect to each other.
     * @returns {Boolean} Flag to indicate if transformation is valid.
     */
    isTransformationValid () {
        // Compare the current world state with the post-world state
        for (const participantName in this._postWorldState) {
            if (!(participantName in this._currentWorldState)) {
                throw new Error(`Expected Participant ${participantName} is missing`);
            }
            const expectedValue = this._postWorldState[participantName];
            const actualValue = this._currentWorldState[participantName];
            if (!isEqual(expectedValue, actualValue)) {
                console.log(`Value mismatch for participant ${participantName}`);
                return false;
            }
        }
        return true;
    }
}

export default Behavior;
