import isEqual from "lodash-es/isEqual";

import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import ParticipantAlreadyExistsError from "../Errors/ParticipantAlreadyExistsError";
import UnknownParticipantError from "../Errors/UnknownParticipantError";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";
import SemanticEvaluator from "./BehavioralLanguage/SemanticEvaluator.js";
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
        this._transformationTests = [];
        this._evaluator = new SemanticEvaluator();
        this._script = "";
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
    // TODO: The variables in these methods below need to be intializes as
    // null in the contstructure so that they are tracked cleanly. I've just
    // been adding them as I go but that is not the right way to proceed.

    /**
     * Sets the script outlining the validation steps.
     * @param {String} rawScript Script to set.
     */
    setScript (rawScript) {
        this._script = rawScript;
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
     * Indicates if observed behavior from the execution failed.
     * @param {Boolean} failure Indicate if implementation of
     * behavior experienced failure.
     */
    setImplementationFailure (failure) {
        this._implementationFailure = failure;
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
        const primitives = this._script.split("\n")
            .map(line => line.trim()).filter(line => line.length > 0);
        const evaluator = new SemanticEvaluator(
            primitives,
            this._preWorldState,
            this._postWorldState,
            this._primitiveArgs,
            this._implementationFailure
        );
        evaluator.run();

        const input = {
            script: this._script,
            preWorldState: this._preWorldState,
            postWorldState: this._postWorldState,
            validPreconditions: this._validPreconditions,
            implementationFailure: this._implementationFailure,
            arguments: this._primitiveArgs,
        }

        // I'm saving the input and the output in the result of the
        // transformation because it makes it easy to access the
        // information needed to visualize the infrmation in the UI.
        // In the end, all of this information will be in compressed
        // form and I will simply save indexes and access it as needed.
        return {
            input: input,
            output: evaluator.output,
        };
    }

    /**
     * A transformation test information needed to compute a transformation
     * and determine the validity.
     *
     * This includes:
     * - Arguments for the primitives
     * - The pre-world state before executing the primitives
     * - The expected output world state after executing the primitives
     *
     * The primitives themselves are stored in the behavior and these are the
     * conditions which are used to test those primitives. I am using this
     * to save tests for the behavior manually but eventually these will
     * be also generated from the traces since we are capturing the
     * necessary semantic information unambiguously.
     *
     * TODO: The traces provide the necessary information to test the behavior
     * of the design. Since an implementation is claiming to realize the design,
     * the semantic validity of the implementation can be automatically tested.
     * Traces which result in failed root cause analysis test that the behavior
     * of the design has been modified to respect the new invariant learnt by
     * the design and that the implementation faithfully represents this. You
     * also don't have to test a single behavior, the design as a whole can be
     * tested and that is really powerful to me. I will address this todo after
     * I build the semantic simulator, then I will start using traces to run the
     * semantic model, then the leap to testing implementations automatically
     * will be much smaller. I'm not sure this is the right palce to add this
     * todo but I'll leave it here for now to remind me to think about this.
     *
     * TODO: Obviously the traces are compressed effectively and it makes
     * sense to store the actual tests from traces in the compressed form.
     * So in that case, this will likely become an index that will load the
     * relevant trace. I haven't got that far yet, for now its just manual
     * tests while I build out the structure, but I'm leaving this todo
     * here to remind me to think about this.
     *
     * @param {Object} test Object containing the transformation test.
     */
    addTransformationTest (test) {
        this._transformationTests.push(test);
    }

    /**
     * Get all the transformation tests.
     * @returns {Array} Array of transformation tests.
     */
    getTransformationTests () {
        return this._transformationTests;
    }
}

export default Behavior;
