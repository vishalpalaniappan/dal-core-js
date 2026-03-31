import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";

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
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the invariant from the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args The arguments to initialize the invariant with.
     */
    _loadArgs (args) {
        const expectedAttributes = ["name", "rule"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Invariant", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Invariant", attr);
            }
            this[attr] = args[attr];
        });
    }

    /**
     * Loads the invariant from file.
     * @param {Object} invariantJSON The JSON object to load the invariant from.
     */
    _loadFromFile (invariantJSON) {
        for (const [key, value] of Object.entries(invariantJSON)) {
            this[key] = value;
        };
        // Reset these because they are set by the execution
        this.invariantViolated = null;
        this.value = null;
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
     * @param {Class} invariantType Type of invariant (see InvariantTypes.js).
     */
    assignInvariantType (invariantType) {
        this.invariantType = new invariantType();
    }

    /**
     * Evaluate the invariant by applying the invariant rule to the provided
     * value. Returns a flag indicating whether the invariant was violated.
     * @param {*} value The value to evaluate the invariant on.
     * @returns {Boolean} Returns flag indicating if invariant was violated.
     */
    evaluate (value) {
        this.invariantViolated = false;
        if (this.rule.type === "minLength") {
            this.enforceMinLength(value);
        }
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
     * Intrisinc invariants correspond to a trace that represents
     * a factory default environment that enables the implementation
     * to prove that it respects the invariant.
     *
     * @param {String} traceId ID of trace used for automated testing.
     */
    setTraceId (traceId) {
        // TODO: Add validation for traceId.
        this.traceId = traceId;
    }
}

export default Invariant;
