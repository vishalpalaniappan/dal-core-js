import isEqual from "lodash-es/isEqual";

import BehavioralLanguageParser from "./BehavioralLanguageParser.js";

class SemanticEvaluator {
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
     * state and in the post stage, we are checking the validity of the
     * post transform world state using the observed state.
     *
     * I want the script to be the authority for how the world state is managed.
     * The script will be responsible for outlining every step in the process
     * and this class will simply carry out the instructions in the script.
     * This makes it much more maintainable and extensible in the long run.
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
     * @param {Array} script Each element is a line in the script.
     * @param {Object} initialWorldState Object containing the participants.
     * @param {Object} expectedPostWorldState Object containing the expected
     * state of the world after the script is executed.
     * @param {Object} args Object containing any arguments that are needed
     * to execute the script, for example, the value for primitives which
     * accept arguments like create.
     * @param {Boolean} implementationFailure Boolean indicating whether the
     * implementation failed or not.
     */
    constructor (script, initialWorldState, expectedPostWorldState, args, implementationFailure) {
        this.script = script;
        this.worldState = initialWorldState;
        this.expectedPostWorldState = expectedPostWorldState;
        this.args = args;
        this.BehavioralLanguageParser = new BehavioralLanguageParser();
        this.implementationFailure = implementationFailure;
        this.transformFailure = false;
        this.output = {};
        this.transformValidFlag = false;
        this.invariantsViolatedFlag = false;
    }

    /**
     * This method runs the script. It uses the BehavioralLanguageParser
     * to execute each line and update the world state accordingly. It also
     * keeps track of the mode of execution (pre, transform, post). The
     * larger principle is, the script itself should dictate the validation
     * (keeping the control with the developer) and this simply executes
     * the script.
     *
     * TODO:
     * So the next stage is, this class needs to provide a summary of the
     * world's validity after the script is executed. There are many validity,
     * checks, invariant checks, participant existence checks, unknown
     * participant checks, transform output validity check etc. So I need to
     * track all of these in an object and provide the output that the debugger
     * can use. The debugger will use each semantic invalidity to predict which
     * behaviors will fail and then check those predictions against the observed
     * behaviors to automatically debug the execution. So the output of this
     * is the input into the automated debugger.
     *
     * TODO:
     * Create a process that will allow the generation of natural language
     * messages summarising the execution of the behavioral semantics.
     * This will be used to generate messges that the debugger can use
     * to explain the behavior to the dev using natural language.
     * Since this is a semantic engine, the ability to create meaningful
     * sentences is intrinically possible. In the end, I imagine that the
     * engine will produce an output in natural language that explains exactly
     * what went wrong and the user will only inspect the raw data if they want.
     *
     * To start, I can do something very simple and build up from there:
     * meta:
     *   success I accepted the name <post_name> from the user.
     *   failure I failed while trying to accept a name from the user.
     *
     * This will get the name from the post behavior world state and create
     * the sentence using it.
     */
    run () {
        for (const line of this.script) {
            if (line.trim().startsWith("#")) {
                // Comment line or empty line, skip
                continue;
            }

            if (line.startsWith("pre:")) {
                this.mode = "pre";
                this.output.pre = [];
                continue;
            }

            if (line.startsWith("transform:")) {
                this.mode = "transform";
                this.output.transform = [];
                continue;
            }

            if (line.startsWith("post:")) {
                this.mode = "post";
                this.output.post = [];
                continue;
            }

            if (line.startsWith("validate transformation")) {
                const output =this.validatePostWorldState();
                this.output.transform.push(output);
                continue;
            }

            let executionOutput;
            try {
                executionOutput = this.BehavioralLanguageParser.execute(
                    line, this.worldState, this.args
                );
                const output = executionOutput.output;
                if (output?.type === "invariant" && !output.isValid) {
                    this.invariantsViolatedFlag = !output.isValid;
                }
                this.output[this.mode].push({
                    type: "success",
                    line: line,
                    output: output,
                });
            } catch (error) {
                console.error(`Error executing line "${line}": ${error.message}`);
                this.output[this.mode].push({
                    type: "error",
                    line: line,
                    message: error.message,
                });
                this.transformFailure = true;
                break;
            }
            this.worldState = executionOutput.participants;
        }

        // Note: I chose to keep the convention of both so true means valid. So
        // is invariants were not violated, then invariants were respected.
        // Transform validity is true if transform is valid, no inversion needed
        this.output["transformValidFlag"] = this.transformValidFlag;
        this.output["invariantsRespectedFlag"] = !this.invariantsViolatedFlag;
        this.output["implementationFailure"] = this.implementationFailure;
        this.output["transformFailure"] = this.transformFailure;
    }

    /**
     * This method is called after the transform is complete. It checks the
     * validity of the computed post world state by comparing it to the
     * expected post world state.
     *
     * In the scripting playground, the pre and post world states are provided
     * by the user or loaded from a collected trace.In the debugger, the pre
     * and post world states are observed from the execution trace.
     *
     * In either case, this method is responsible for checking the validity of
     * the provided post behavior world state by comparing it to the computed
     * post behavior world state.
     *
     * @returns {Object} Object containing the validity of the post world state
     */
    validatePostWorldState () {
        const output = {
            type: "validate",
            isValid: null,
            transformationOutput: this.worldState,
            missingParticipants: [],
            unexpectedParticipants: [],
            mismatchedParticipants: [],
        }

        // Check for missing participants
        for (const participant in this.expectedPostWorldState) {
            if (!(participant in this.worldState)) {
                output.missingParticipants.push(participant);
                output.isValid = false;
            }
        }

        // Check for unexpected participants
        for (const participant in this.worldState) {
            if (!(participant in this.expectedPostWorldState)) {
                output.unexpectedParticipants.push(participant);
                output.isValid = false;
            }
        }


        // Check for equality of participants
        for (const participant in this.expectedPostWorldState) {
            if (participant in this.worldState) {
                if (!isEqual(
                    this.worldState[participant], this.expectedPostWorldState[participant]
                )) {
                    output.mismatchedParticipants.push(participant);
                    output.isValid = false;
                }
            }
        }

        if (output.isValid === null) {
            output.isValid = true;
        }

        this.transformValidFlag = output.isValid;

        return output;
    }
}

export default SemanticEvaluator;
