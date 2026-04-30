/* eslint-disable max-len */
// eslint-disable-next-line max-len
const INVARIANT_RE = /^invariant\s+(\S+)\s+(\S+)(?:\s+\[([^\]]*)\])?(?:\s+\[([^\]]*)\])?(?:\s+\[([^\]]*)\])?$/;

class InvariantParser {

    /**
     * This class parses the invariant scripts and executes them.
     * The invairant syntax itself is as follows:
     *
     * invariant <participant> <type> [<args>] [<predictions>]
     * ----
     * where <args> and <predictions> are a list.
     *
     * Breakdown:
     * invariant - keyword to indicate that this line is an invariant
     * <participant> - the participant that this invariant is applied to
     * <type> - the type of invariant, for example, exists, requires, etc.
     * [<args>] - any arguments that are needed to evaluate the invariant.
     * [<predictions>] - the behaviors that this invariant predicts will
     * fail if it is not respected.
     *
     * Using this, I can specify any invariant and use its state to predict
     * downstream behaviors that will fail.
     **/
    constructor () {

    }

    /**
     * Runs the invariant given a script and the participants in the world.
     * @param {String} script The script specifying the invariants.
     * @param {Object} participants Participants in the world.
     * @returns {Object|null} The result of the invariant check with its
     * validity and the failure prediction it makes.
     */
    run (script, participants) {
        const match = script.match(INVARIANT_RE);
        const participant = match[1];
        const type = match[2];
        const keys = match[3] ? JSON.parse("[" + match[3] + "]") : [];
        const args = match[4] ? JSON.parse("[" + match[4] + "]") : [];
        const predictions = match[5] ? JSON.parse("[" + match[5] + "]") : [];

        if (!(participant in participants)) {
            throw new Error(`Participant ${participant} is missing`);
        }

        if (type === "hasKey") {
            // invariant book hasKey [] ["name"] []
            return this.hasKeyInvariant(
                participant, participants[participant], keys, args, predictions
            );
        } else if (type === "minLength") {
            // invariant book_name minLength ["book","name"] [0] []
            return this.minLengthInvariant(
                participant, participants[participant], keys, args, predictions
            );
        }

        console.log(`Running invariant ${type} on participant ${participant}`);
    }

    hasKeyInvariant (participantName, participantValue, keys, args, predictions) {
        for (const key of keys) {
            participantValue = participantValue[key];
        }
        const keyToCheck = args[0];
        const isValid = participantValue.hasOwnProperty(keyToCheck);

        let msg;
        if (isValid) {
            msg = `Participant named "${participantName}" has the required key named "${keyToCheck}"`;
        } else {
            msg = `Participant named "${participantName}" does not have the required key named "${keyToCheck}"`;
        }
        return {
            type: "invariant",
            participantName: participantName,
            participantValue: participantValue,
            invariantType: "hasKey",
            key: keyToCheck,
            isValid: isValid,
            predictions: predictions,
            message: msg,
        }
    }

    minLengthInvariant (participantName, participantValue, keys, args, predictions) {
        for (const key of keys) {
            participantValue = participantValue[key];
        }
        const minLength = args[0];
        const isValid = participantValue.length >= minLength;

        let msg;
        if (!isValid) {
            msg = `Participant named "${participantName}" has length ${participantValue.length} which is less than the minimum length of ${minLength}`;
        } else if (isValid && minLength === participantValue.length) {
            msg = `Participant named "${participantName}" has length ${participantValue.length} which is equal to the minimum length of ${minLength}`;
        } else {
            msg = `Participant named "${participantName}" has length ${participantValue.length} which is greater than the minimum length of ${minLength}`;
        }
        console.log(msg);
        return {
            type: "invariant",
            participantName: participantName,
            participantValue: participantValue,
            invariantType: "minLength",
            minLength: minLength,
            message: msg,
            isValid: isValid,
            predictions: predictions,
        }
    }
}

export default InvariantParser;
