import isEqual from "lodash/isEqual";

import BehavioralLanguageParser from "./BehavioralLanguageParser.js";

class ExecutableBehavior {

    /**
     * This class defines the semantics of the behavior and provides
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
        this._primitives = [];
        this._parser = new BehavioralLanguageParser();
    }

    addPrimitive (primitive) {
        this._primitives.push(primitive);
    }

    setPreWorldState (preWorldState) {
        this.preWorldState = preWorldState;
        this.currentWorldState = preWorldState;
    }

    setPostWorldState (postWorldState) {
        this.postWorldState = postWorldState;
    }

    computeTransformations () {
        for (const primitive of this._primitives) {
            // execute primitive and update world state
            const updatedParticipants = this._parser.execute(
                primitive, this.currentWorldState, this.postWorldState
            );
            this.currentWorldState = updatedParticipants;
        }

        return [this.currentWorldState, this.isTransformationValid()];
    }

    isTransformationValid () {
        for (const participantName in this.postWorldState) {
            if (!(participantName in this.currentWorldState)) {
                throw new Error(`Expected Participant ${participantName} is missing`);
            }
            const expectedValue = this.postWorldState[participantName].getValue();
            const actualValue = this.currentWorldState[participantName].getValue();
            if (!isEqual(expectedValue, actualValue)) {
                console.log(`Value mismatch for participant ${participantName}: 
                    expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)}`);
                return false;
            }
        }
        return true;
    }

    evaluateInvariants () {

    }
}

export default ExecutableBehavior;
