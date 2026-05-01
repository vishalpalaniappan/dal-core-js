import isEqual from "lodash-es/isEqual";

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
     * Parses the require primitives before executing the script to determine
     * if world state is valid for behavior and to provide the necessary
     * inputs for the behavior.
     * @param {String} participant The participant that is required.
     * @param {*} input Whether this participant is an input that
     *  should be read from the args.
     * @param {*} keys Optional keys to check for the participant.
     * @param {*} value Optional value to check for the participant.
     * @returns {Object || null}
     */
    getPreExecutionMeta (participant, input, keys, value) {
        // Return required input to get from user
        if (input) {
            return {
                type: "require_input",
                participantName: participant,
            }
        }

        if (keys && value) {
            // Participant isn't in the world
            if (!(participant in this.participants)) {
                return {
                    type: "missing_required_participant",
                    participantName: participant,
                    valid: false,
                    reason: "Missing from world",
                }
            }

            let valueAtKey = this.participants[participant];
            if (keys && keys.length > 0) {
                for (const key of JSON.parse(keys)) {
                    // Key isn't in the participant
                    if (!(key in valueAtKey)) {
                        return {
                            type: "missing_required_participant",
                            participantName: participant,
                            valid: false,
                            reason: `Missing key ${key} in world state`,
                        }
                    }
                    valueAtKey = valueAtKey[key];
                }
            }

            // Value at key doesn't match required value
            const isValid = isEqual(valueAtKey, value);
            if (!isValid) {
                return {
                    type: "missing_required_participant",
                    participantName: participant,
                    valid: false,
                    reason: `Value at key ${keys} does not match required value`,
                }
            }

            return {
                type: "is_valid_world_state_for_behavior",
                isValid: isValid,
            }
        }
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
