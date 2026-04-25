class BehavioralScriptRunner {
    /**
     * This class is responsibile for running a script writting in the
     * behavioral language. It is a stateful class that uses identifiers
     * to keep track of the mode of execution. For example, the script
     * can be broken down into three parts:
     *
     * pre:
     *    exists <participant>
     *    invariant <participant> <type> <arg1> <arg2> ...
     *    flag unknown participants
     *
     * transform:
     *    create <participant>
     *    set <target_participant> <value_participant> [keys]
     *    validate computed world
     *
     * post:
     *    exists <participant>
     *    invariant <participant> <type> <arg1> <arg2> ...
     *    flag unknown participants
     *
     * The reason I am breaking it down into these stage is as because
     * in the pre stage, we are processing the initial world state. In
     * the transform stage, we are generateing the computed post world
     * state from the pre world state and in the post stage, we are
     * checking the validity of the post transform world state.
     *
     * Pre:
     *  - Check that the initial world state has all the required participants.
     *  - Enforce the invariants on the participants.
     *  - Check if there are unexepcted participants in the initial world state.
     *  - All three of these will be done using the script.
     *
     * Transform:
     *  - Execute the transforms in the script to generate the postworld state.
     *  - Check that the computed output state is the same as the expected post
     *    world state, this will also be done with the script syntax.
     *
     * Post:
     *   - Check that the post world state has all the required participants.
     *   - Enforce the invariants on the participants.
     *   - Check if there are unexepcted participants in the post world state.
     *
     * In the end, the actual script will outline every step in the process and
     * it will be the source of truth for what the runner does. I guess there
     * was no need to break it down into three stages but I think there is value
     * in organizing the script and in the long run it will provide ways for me
     * to exten this.
     *
     * @param {Array} script Each element is a line in the script.
     * @param {Object} initialWorldState Object containing the participants.
     * @param {Object} expectedPostWorldState Object containing the expected
     *  state of the world after the script is executed.
     */
    constructor (script, initialWorldState, expectedPostWorldState) {
        this.script = script;
        this.worldState = initialWorldState;
        this.expectedPostWorldState = expectedPostWorldState;
    }

    run () {
        for (const line of this.script) {
            if (line.startsWith("pre:")) {
                this.mode = "pre";
                continue;
            }
            if (line.startsWith("transform:")) {
                this.mode = "transform";
                continue;
            }
            if (line.startsWith("post:")) {
                this.mode = "post";
                continue;
            }

            // Process the line.
        }
    }
}

export default BehavioralScriptRunner;
