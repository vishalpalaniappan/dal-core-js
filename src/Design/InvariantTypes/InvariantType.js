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

    /**
     * Records that this invariant violation predicts a downstream
     * semantically invalid state at the specified behavior.
     *
     * This invalid state first becomes identifiable at the invariant
     * violation itself and then becomes identifiable when it manifests as
     * an observable condition, such as another invariant violation or a
     * failure. By mapping these manifestations to this invariant violation,
     * the root cause of the invalid state can be precisely identified.
     *
     * For example, if a design uses the first letter of a books name to
     * determine which shelf to place the book on. Then a min length invariant
     * violation when accepting the books name will result in a predicted
     * invalid state at the behavior when the design tries to determine
     * which slot to place the book in. There is also a specific implementation
     * error which manifests at that behavior, for example, an index out of
     * bounds error when trying to access the first letter of the book's name.
     * In this case, when the failure is observed, the root cause can be
     * unambiguously identified as the min length invariant violation at the
     * behavior which accepted the book.
     *
     * If a failure is observed, but the root cause can't be unambiguously ,
     * identified then the engine enters learning mode, where it learns
     * about the root cause of this failure.
     *
     * @param {String} behavior The downstream behavior predicted to enter an
     * invalid semantic state due to this invariant violation..
     * @param {Object} manifestation Details about the manifestation of this
     * invariant violation in the design.
     */
    assignPredictedInvalidState(behavior, manifestation) {

    }
}
