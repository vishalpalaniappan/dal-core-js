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
            return this.hasKeyInvariant(participants[participant], keys, args, predictions);
        } else if (type === "minLength") {
            // invariant book_name minLength ["book","name"] [0] []
            return this.minLengthInvariant(participants[participant], keys, args, predictions);
        }

        console.log(`Running invariant ${type} on participant ${participant}`);
    }

    hasKeyInvariant (participant, keys, args, predictions) {
        let value = participant;
        for (const key of keys) {
            value = value[key];
        }
        const keyToCheck = args[0];
        const isValid = value.hasOwnProperty(keyToCheck);
        return {
            type: "invariant",
            value,
            invariantType: "hasKey",
            key: keyToCheck,
            isValid,
            predictions: isValid ? [] : predictions,
        }
    }

    minLengthInvariant (participant, keys, args, predictions) {
        let value = participant;
        for (const key of keys) {
            value = value[key];
        }
        const minLength = args[0];
        const isValid = value.length >= minLength;
        return {
            type: "invariant",
            participant,
            invariantType: "minLength",
            minLength,
            isValid,
            predictions: isValid ? [] : predictions,
        }
    }
}

export default InvariantParser;
