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
     * The expected attributes in args are:
     * - name: Name of the invariant.
     * - rule: The rule that defines the how to enforce the invariant. This
     * will be formally defined in a collection of invariant rules that can
     * be chosen from when creating an invariant.
     *
     * Currently, the only supported invariant rule is the string min length
     * rule, which can be specified as follows:
     * {
     *     "name": "MinLengthConstraint",
     *     "rule": {
     *         "type": "minLength",
     *         "keys": ["value", "name"],
     *         "value": 1,
     *     },
     * }
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
     * Enforce the string min length invariant.
     * @param {*} value The value to enforce the invariant on.
     */
    enforceMinLength (value) {
        if ("keys" in this.rule) {
            for (let i = 0; i < this.rule["keys"].length; i++) {
                value = value[this.rule["keys"][i]];
            }
        };
        if (value === null || typeof value !== "string" || value.length < this.rule.value) {
            this.invariantViolated = true;
        }
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
