import SemanticPrimitive from "../../SemanticPrimitives/SemanticPrimitive.js";

class RequirePrimitive extends SemanticPrimitive {
    /**
     * This class is responsible for computing the require primitive. If the
     * require is an input, it gets the value from the arguments and adds it
     * to the world participants. If the requirement is not an input, it checks
     * that the participant is present in the world state.
     *
     * Syntax: require <participant> [input]
     *
     * See README for details on how to use the primitive.
     *
     * @param {String} participants The particpants in the world state.
     * @param {Object} args Additional arguments for the participant.
     */
    constructor (participants, args) {
        super();
        this.participants = participants;
        this.args = args;
    }

    /**
     * 
     * @param {String} participant 
     * @param {*} input 
     * @param {*} keys 
     * @param {*} value 
     */
    getPreExecutionMeta (participant, input, keys, value) {


    }

    /**
     * Runs the require primitive.
     * @param {String} participant The participant that is required.
     * @param {Boolean} input Whether this participant is an input that should
     * be read from the args.
     * @param {String} keys Optional keys to check for the participant.
     * @param {String} value Optional value to check for the participant.
     * @returns {Object} The output of the primitive and the updated
     * participants.
     */
    run (participant, input, keys, value) {
        /**
         * TODO:
         * Extend this so that based on the primitive args, I return the
         * relevant information.
         * - If it is marked as an input, I indicate that the semantic model
         *  should ask for an input.
         * - If the participant with a value (and or key), I indicate if the
         * requirement is satisfied or not.
         * - If it just participant, I check for the presence.
         */
        let msg;
        if (!input && !(participant in this.participants)) {
            msg = `Required participant ${participant} is missing`;
        } else if (!input) {
            msg = `Required participant ${participant} is present`;
        }

        if (input) {
            /**
             * TODO:
             * -----
             * input is an optional flag to indicate that this participant
             * is required as an input currently this input will be read
             * from the args passed into the semantic evaluator.
             * Soon, the value will be accepted from the user as part of
             * executing the semantic model
             */
            if (!(participant in this.args)) {
                msg = `Required participant ${participant} is missing from input args`;
            } else {
                this.participants[participant] = this.args[participant];
                msg = `Required participant ${participant} is present as input`;
            }
        } else if (keys && value) {
            console.log("Checking for keys and values in require primitive");
        } else {
            console.log("Checking if participant exists");
        }

        const output = {
            "type": "require",
            "participantName": participant,
            "input": !!input,
            "isValid": participant in this.participants,
            "msg": msg,
        }
        return {
            output,
            participants: this.participants,
        }
    }
}

export default RequirePrimitive;
