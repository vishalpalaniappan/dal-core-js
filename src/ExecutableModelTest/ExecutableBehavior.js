class ExecutableBehavior {

    /**
     * This class semantically defines the behavior and provides
     * an interface for executing the primitives which consititue
     * the behavior.
     *
     * It provides the following methods:
     * - Set world state pre-behavior
     * - Set world state post-behavior
     * - Compute transformations of behavior
     * - Indicate if transformation is valid
     * - Evaluate invariants of pre and post behavior world state
     *
     * I'm starting by building this as a standalone class and then I will
     * integrate it into the rest of the engine after I implement and verify
     * the functionality here.
     * 
     * At the end of this, the debugger will use this behavior class to set
     * the pre and post world state and execute the behavior to determine
     * the validity of the observed transform as well as track any invariant
     * violations on the pre and post world state.
     */
    constructor () {

    }

    setPreWorldState (preWorldState) {
        this.preWorldState = preWorldState;
    }

    setPostWorldState (postWorldState) {
        this.postWorldState = postWorldState;
    }

    computeTransformations () {

    }

    isTransformationValid () {

    }

    evaluateInvariants () {

    }
}

export default ExecutableBehavior;
