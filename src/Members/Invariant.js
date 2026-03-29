import Base from "../Base";
import MissingAttributes from "../Errors/MissingAttributes";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import ENGINE_TYPES from "../TYPES";

/**
 * Class representing a Invariant in the design.
 */
class Invariant extends Base {
    /**
     * Initialize the Invariant.
     * @param {String} name
     * @param args
     */
    constructor (args) {
        super();
        // Object attributes with default values.
        this.type = ENGINE_TYPES.INVARIANT;
        this.invariantViolated = false;
        this.invariantType = null;
        this.traceId = null;
        // Load arguments.
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args
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
     * Loads the invariant from a JSON object.
     * @param {Object} invariantJSON
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
     * Evaluate the invariant.
     * @param {*} value
     * @returns {Boolean}
     */
    evaluate (value) {
        this.invariantViolated = false;
        if (this.rule.type === "minLength") {
            this.enforceMinLength(value);
        }
        return this.invariantViolated;
    }

    /**
     * Enforce the string min length invariant
     * @param value
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
     * Sets the invariant type.
     *
     * The two types of invariants are: Intrinsic and Substrate
     *
     * Substrate invariants are learnt by the design from the
     * environment.
     *
     * Intrinsic invariants are arrived at naturally from the
     * designs control flow, data dependencies and semantic assumptions.
     *
     * @param {String} invariantType
     */
    setInvariantType (invariantType) {
        // TODO: Add validation for invariantType.
        this.invariantType = invariantType;
    }

    /**
     * This function adds the trace id which can be used for
     * automated testing.
     *
     * Substrate invariants correspond to a trace that represents
     * an environment that reveals a limitation of the substrate,
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
