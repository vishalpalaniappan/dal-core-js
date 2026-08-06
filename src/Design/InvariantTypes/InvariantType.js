export class InvariantType {
    /**
     * Base class representing the invariant type assigned to the participant.
     *
     * This base class will be extended to create specific invariant types and
     * the properties of the invariant type will define how to validate the
     * specific invariant. For example, the min length invariant type will have
     * a property for the minimum length and the key of the value in the
     * participant's state to which the invariant should be applied.
     *
     * @param {Object} args The arguments to initialize the invariant type with.
     * @param {String} args.type The type of the invariant.
     * @param {String} args.label The label of the invariant.
     * @param {Object} args.properties The properties of the invariant.
     */
    constructor ({type, label, properties}) {
        this.type = type;
        this.label = label;
        this.properties = properties;
        this.invariantViolated = null;
        this.predictedFailures = [];
    }

    /**
     * Indicates if the invariant has been evaluated to be violated or not.
     * This should only called after the invariant has been evaluated,
     * otherwise it will throw an error.
     * @returns {Boolean} Whether the invariant is violated or not.
     * @throws {Error} Thrown when the invariant has not been evaluated yet.
     * In this case, the invariant violation status is unknown, so an error
     * will be thrown.
     */
    isViolated () {
        if (this.invariantViolated === null) {
            throw new Error("Invariant has not been evaluated yet.");
        }
        return this.invariantViolated;
    }
}
