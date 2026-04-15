import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";
import {MinLengthInvariant} from "./InvariantTypes/MinLengthInvariant";
import {RequiredKeysInvariant} from "./InvariantTypes/RequiredKeysInvariant";

class Invariant extends Base {
    /**
     * Class representing a Invariant in the design. Invariants are rules that
     * define a valid world state for participants in behaviors. The invariants
     * are used to check if the design has entered a semantically invalid state
     * during execution.
     *
     * @param {Object} args The arguments to initialize the invariant with.
     */
    constructor (args) {
        super();
        this.type = ENGINE_TYPES.INVARIANT;
        this.invariantViolated = false;
        this.invariantType = null;
        this.traceId = null;
        this.predictedFailures = [];
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the invariant from the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args The arguments to initialize the invariant with.
     */
    _loadArgs (args) {
        const expectedAttributes = ["name", "description"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Invariant", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Invariant", attr);
            }
            this["_" + attr] = args[attr];
        });
    }

    /**
     * Loads the invariant from file.
     * @param {Object} invariantJSON The JSON object to load the invariant from.
     */
    _loadFromFile (invariantJSON) {
        for (const [key, value] of Object.entries(invariantJSON)) {
            console.log(key, value);
            if (key === "invariantType" && value) {
                if (value.type === "min_length") {
                    this[key] = new MinLengthInvariant(value);
                    this[key].properties = value.properties;
                } else if (value.type === "required_keys") {
                    this[key] = new RequiredKeysInvariant(value);
                    this[key].properties = value.properties;
                } else if (value.type === "range") {
                    this[key] = new RangeInvariant(value);
                    this[key].properties = value.properties;
                }
            } else {
                this[key] = value;
            }
        };
        // Reset these because they are set by the execution
        this.invariantViolated = null;
        this.value = null;
    }

    /**
     * Returns the description of the design.
     * @returns {String} Description.
     */
    getDescription () {
        return this._description;
    }

    /**
     * Returns the name of the invariant.
     * @returns {String} The name of the invariant.
     */
    getName () {
        return this._name;
    }

    /**
     * Accepts an invariant type class that is initialized and assigned
     * to this invariant. This is one of the invariant types listed in 
     * InvariantTypes.js.
     *
     * Once the invariant type is assigned, it can be configured using the
     * properties that it requires. For example, min length requires the
     * keys of the value that is being evaluated and the minimum length
     * that is being enforced. Then given a value, it can enforce the invariant
     * and identify a semantically invalid state.
     *
     * Each invariant type is contained in its own class and has its own
     * internal logic for enforcing it. This also allows for modular testing
     * and extensibility.
     *
     * @param {Object} invariantType Instance of an invariant type.
     */
    assignInvariantType (invariantType) {
        this.invariantType = invariantType;
    }

    /**
     * Evaluate the invariant by applying the invariant rule to the provided
     * value. Returns a flag indicating whether the invariant was violated.
     * @param {*} value The value to evaluate the invariant on.
     * @returns {Boolean} Returns flag indicating if invariant was violated.
     */
    evaluate (value) {
        if (!this.invariantType) {
            // TODO: Make into custom error.
            console.log("Invariant type not assigned.");
            return;
        }
        for (const key in this.invariantType.properties) {
            const property = this.invariantType.properties[key];
            if (!("value" in property)) {
                // TODO: Make into custom error.
                // Also verify type (but do it in invariant type when the value
                // of the property is being set).
                throw new Error(`Invariant type property ${key} not configured.`);
            }
        }
        this.value = value;
        this.invariantViolated = this.invariantType.evaluate(value);
        return this.invariantViolated;
    }


    /**
     * Sets the invariant source.
     *
     * The two sources of invariants are: Intrinsic and Substrate
     *
     * Substrate invariants are learnt by the design from the
     * environment.
     *
     * Intrinsic invariants are arrived at naturally from the
     * designs control flow, data dependencies and semantic assumptions.
     *
     * @param {String} invariantSource
     */
    setInvariantSource (invariantSource) {
        // TODO: Add validation for invariantSource.
        this.invariantSource = invariantSource;
    }

    /**
     * This function adds the trace id which can be used for
     * automated testing.
     *
     * Substrate invariants correspond to a trace that represents
     * an environment which reveals a limitation of the substrate,
     * thus motivating the invariant. It is also the environment
     * in which an implementation can prove that it respects this
     * invariant.
     *
     * Intrinsic invariants correspond to a trace that represents
     * a factory default environment that enables the implementation
     * to prove that it respects the invariant.
     *
     * @param {String} traceId ID of trace used for automated testing.
     */
    setTraceId (traceId) {
        // TODO: Add validation for traceId.
        this.traceId = traceId;
    }

    /**
     * Set the behavior that will fail due to the violation of this invariant.
     * This is used for automated debugging and the root cause of a behavior
     * failing can be identified in upstream inavariant violations that
     * predict its existence.
     *
     * @param {String} uid Unique identifier for the failure prediction. 
     * @param {String} behavior Behavior that will fail due to this invariant
     * violation.
     * @param {String} reason Reason for the prediction.
     * @throws {Error} Thrown when the behavior already exists in the failure
     * prediction list for this invariant.
     */
    addFailedBehaviorPrediction (uid, behavior, reason) {
        if (this.hasFailedBehaviorPrediction(behavior)) {
            throw new Error(`Behavior ${behavior} already exists in 
                the failure prediction list for this invariant.`);
        }
        this.predictedFailures.push({
            uid: uid,
            behavior: behavior,
            reason: reason,
        });
    }

    /**
     * Removes the provided behavior from the failure prediction list for
     * this invariant.
     *
     * @param {String} uid Unique identifier for the failure prediction.
     */
    removeFailedBehaviorPrediction (uid) {
        this.predictedFailures = this.predictedFailures.filter(
            (prediction) => prediction.uid !== uid
        );
    }

    /**
     * Checks if this invariant predicts a failure at the given behavior.
     *
     * @param {String} uid Unique identifier for the failure prediction.
     * @returns {Boolean} Whether this invariant predicts a failure at the given
     * behavior.
     */
    hasFailedBehaviorPrediction (uid) {
        return this.predictedFailures.some(
            (prediction) => prediction.uid === uid
        );
    }
}

export default Invariant;
