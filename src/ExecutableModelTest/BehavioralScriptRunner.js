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
     *
     * transform:
     *    create <participant>
     *    set <target_participant> <value_participant> [keys]
     *
     * post:
     *     exists <participant>
     *     invariant <participant> <type> <arg1> <arg2> ...
     *
     * The reason I am breaking it down into these stage is as because
     * in the pre stage, we are processing the initial world state. In
     * the transform stage, we are generateing the computed post world
     * state from the pre world state and in the post stage, we are
     * checking the validity of the post transform world state.
     *
     * There are unique steps that have to happen at each stage, I considered
     * writing these unique steps directly into the language, for example,
     * in post, I can say, check value of <participant> is <value> (this would
     * replace the post world vs computer world state check) but since these
     * are mechanical movements that have to happen at this stage, I decided
     * to just hard code these steps into the runner. This keeps the language
     * simple, and using the initial world state and expected post world state
     * passed as arguments to the runner, we can produce the output.
     *
     * So in the end, this class will determine the validity of the each of
     * the stages: Pre, transform and post. It will check the validity of
     * the conditions, enforce invariants and transforms. The debugger will
     * essentially call this running by passing in the logged pre world state,
     * the behavioral script and the expected post world state. This script
     * will then produce an output that the debugger will use in its root
     * cause analysis.
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
}

export default BehavioralScriptRunner;
