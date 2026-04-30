import LogEntry from "./LogEntry";

class TraceDebugger {
    /**
     * Initializes a trace debugger that accepts the design and the trace. The
     * design serves as an authoritative semantic model that is used to
     * determine the correctness of the traces behavior and automatically
     * debug it. The result of a debugger being unable to debug a trace is
     * an input into the design that results it in learning new semantics.
     *
     * In this sense, this debugger is a tool for the design to learn new
     * semantics by being exposed to new traces that it cannot explain.
     * It also serves as the authoritative model for testing the traces
     * produced by implementations of the design, meaning, it can be used
     * to verify that the traces produced by implementations are semantically
     * valid and respect the invariants of the design.
     *
     * @param {Object} design The design to use as the authoritative semantic
     * model for debugging.
     * @param {Array} traceLogs The logs of the trace to debug.
     */
    constructor (design, traceLogs) {
        this._design = design;
        this._logs = traceLogs.map((log) => new LogEntry(log));

        // This is currently used for logging. However, once I am done setting
        // up the process trace variable, I will swithc to it.
        this._atomicPathsLog = [];
        this._currentPathLog = [];

        // Indiciates if an invalid transition was found
        this._instrumentationFailure = false;

        // This stores the processed versions of the trace logs. It groups
        // each behavior with its pre, post participants and arguments. This
        // will be used to run the executable semantic models.
        this.processedTrace = [];
        this.processedTraces = [];

        // Stores the computed output of each behavior in the trace. This will
        // be an input into the automated debugging process and will be used to
        // generate the final report of the debugging process.
        this._executableSemanticModelOutput = [];
        this._executableSemanticModelOutputs = [];
    }

    run () {
        if (!this._logs || this._logs.length === 0) return;
        this.currentIndex = 0;
        this.currentBehavior = null;

        this.visitCurrentNode();
        this._atomicPathsLog.push(this._currentPathLog);
        this.processedTraces.push(this.processedTrace);
        this.runSemanticModels();

        this.debug();

        return this._atomicPathsLog;
    }

    /**
     * The processed trace array contains a list of behaviors with their
     * world state. This function initializes the semantic evaluator with
     * the world state and computes the transformation. The output is then
     * saved and passed to the debugger which then automatically debugs the
     * execution or learns new semantics from the execution.
     */
    runSemanticModels () {
        let runningIndex = 0;
        for (const processedTrace of this.processedTraces) {
            for (const [index, trace] of Object.entries(processedTrace)) {
                const currentNode = this.findNodeByBehaviorName(trace.behavior);
                const currBehavior = currentNode.getBehavior();

                // Pass the world state to semantic evaluator
                currBehavior.setPreWorldState(structuredClone(trace.preParticipants));
                currBehavior.setPostWorldState(structuredClone(trace.postParticipants));
                currBehavior.setPrimitiveArgs(structuredClone(trace.arguments));
                currBehavior.setImplementationFailure(trace.failure);

                // Compute the transformation
                const transformInfo = currBehavior.computeTransformations();

                // Save the output
                this._executableSemanticModelOutput.push({
                    behavior: trace.behavior,
                    index: Number(index) + runningIndex,
                    output: transformInfo.output,
                    input: transformInfo.input,
                });
            }
            this._executableSemanticModelOutputs.push(
                this._executableSemanticModelOutput
            );
            runningIndex = runningIndex + processedTrace.length;
            this._executableSemanticModelOutput = [];
        }
    }

    /**
     * Find the behavior given the name.
     *
     * TODO: I really don't like using name as the identifier but for now I
     * am going to leave this because I don't allow duplicate names in a
     * single graph. When I enable multiple graphs at the same time in the
     * debugger, this will become a problem and relying on UID's will be the
     * right solution.
     *
     * @param {String} behaviorName Name of the behavior to find.
     * @returns {GraphNode} The node in the design with the behavior name.
     */
    findNodeByBehaviorName (behaviorName) {
        const graphs = this._design.getGraphs();
        for (const graph of Object.keys(graphs)) {
            try {
                const behavior = graphs[graph].findNode(behaviorName);
                return behavior;
            } catch {}
        }
    }

    addLog (currentNode, reachedAtomic = false) {
        this._currentPathLog.push(currentNode);
        if (reachedAtomic) {
            this._atomicPathsLog.push(this._currentPathLog);
            this._currentPathLog = [];
            this.processedTraces.push(this.processedTrace);
            this.processedTrace = [];
        }
    }

    /**
     * Process the participant logs by updating the latest entry in the
     * processed trace with the participant values. I consider the arguments
     * as participants as well because it is a representation of the environment
     * as a participant.
     */
    processParticipant () {
        const currLog = this._logs[this.currentIndex];
        const entry = this.processedTrace[this.processedTrace.length - 1];
        const logEntry = currLog["userGenerated"];
        if (logEntry["type"] === "participant" && logEntry["participantType"] === "pre") {
            entry.preParticipants[logEntry.participantName] = logEntry["participantValue"];
        } else if (logEntry["type"] === "participant" && logEntry["participantType"] === "post") {
            entry.postParticipants[logEntry.participantName] = logEntry["participantValue"];
        } else if (logEntry["type"] === "argument") {
            entry.arguments[logEntry.argumentName] = logEntry["argumentValue"];
        }
    }

    /**
     * When we reach a behavior log, we create a new entry in the processed
     * trace with the placeholders for the world state. Then as we visit
     * the participants, the values are populated and then transformations
     * are computed by the semantic model.
     */
    processBehavior () {
        const currentNode = this.findNodeByBehaviorName(
            this._logs[this.currentIndex].getBehavior()
        );
        const currBehaviorName = currentNode.getBehavior().getName();
        this.currentBehavior = currBehaviorName;
        this.processedTrace.push({
            behavior: currBehaviorName,
            preParticipants: {},
            postParticipants: {},
            arguments: {},
            failure: false,
        })
    }


    /**
     * When a failure log is reached, the current behavior is marked as failed.
     * This tells the computable semantic module that no observed post-behavior
     * world state exists for this behavior.
     *
     * The debugger then determines the root cause by identifying the invariant
     * that predicted the failure. If no invariant predicted the failure, the
     * design has encountered missing semantics and can learn a new invariant.
     */
    processFailure () {
        const entry = this.processedTrace[this.processedTrace.length - 1];
        entry.failure = true
    }

    /**
     * Traverse the trace by visiting the next node in the trace. If
     * the next not is not a valid transition and is not atomic, then
     * this indicates that there is an instrumentation error.
     *
     * When concurrency support is added, if a node is a fork,
     * the UID's will be used to follow the trace through the fork
     * into the next node in the system.
     *
     * When variables are visited, they are processed by updating
     * the value of the participant and enforcing the invariant.
     *
     * All of the invariants are accumulated and used to perform
     * the automated debugging after the trace is fully traversed.
     *
     */
    visitCurrentNode () {
        const currentNode = this.findNodeByBehaviorName(
            this._logs[this.currentIndex].getBehavior()
        );
        const currBehavior = currentNode.getBehavior().getName();

        const logType = this._logs[this.currentIndex].getType();

        switch (logType) {
            case "behavior":
                this.processBehavior();
                break;
            case "participant":
                this.processParticipant();
                break;
            case "argument":
                this.processParticipant();
                break;
            case "failure":
                this.processFailure();
                this.addLog(`Failure: ${this._logs[this.currentIndex].getBehavior()}.`);
                return;
                break;
            default:
                this.addLog("Unknown log type: Instrumentation Failure")
                return;
        }

        if (this.currentIndex < this._logs.length - 1) {
            const nextNode = this.findNodeByBehaviorName(
                this._logs[this.currentIndex + 1].getBehavior()
            );
            const nextBehavior = nextNode.getBehavior().getName();

            if ((currBehavior === nextBehavior) || currentNode.isValidTransition(nextBehavior)) {
                this.currentIndex++;
                this.visitCurrentNode();
            } else {
                if (nextNode.isAtomic()) {
                    this.addLog(`Reached atomic behavior ${nextBehavior}.`, true);
                    this.currentIndex++;
                    this.visitCurrentNode();
                } else {
                    this.instrumentationFailure = true;
                    this.addLog(`Invalid Transition from ${currBehavior}->${nextBehavior}.`);
                }
            }
        } else {
            this.addLog("Reached end of execution");
        }
    }


    debug () {
        /**
         * Note: I wanted to clarify confusing wording I used earlier.
         * Even though atomic paths are separated in the design,
         * the root cause of a failure in one path can be from another path
         * and they are connected by the participants in the world. For
         * example, if you accept a book with no name in one path and then
         * in another path you place it on the book shelf using the first
         * letter of its name, the root cause of the failure is when you
         * accepted the book. I just wanted to group the behaviors by atomic
         * paths before I proceed.
         *
         * TODO:
         * 1. Identify all invariant violations from output of computation.
         * 2. Identify all the failures.
         * 3. For each failure, identify the root cause.
         */
        const invariantViolations = [];
        const failures = [];
        for (const output of this._executableSemanticModelOutputs) {
            for (const entry of Object.values(output)) {
                for (const key of ["pre", "post"]) {
                    if (!(key in entry.output)) continue;
                    for (const line of entry.output[key]) {
                        if (line.output.type === "invariant" && !line.output.isValid) {
                            invariantViolations.push({
                                behavior: entry.behavior,
                                index: entry.index,
                                details: line.output,
                            });
                        }
                    }
                }
                // Currently finding root casue of implementation failure.
                if (entry?.output?.implementationFailure) {
                    failures.push({
                        behavior: entry.behavior,
                        index: entry.index,
                    });
                }
            }
        }

        for (const failure of failures) {
            const predicted = invariantViolations.filter(
                (violation) => {
                    const predictions = violation.details.predictions || [];
                    const behavior = failure.behavior;
                    return (violation.index <= failure.index) && (predictions.includes(behavior));
                }
            );
            if (!("rootCauses" in failure)) {
                failure.rootCauses = [];
            }
            failure.rootCauses.push(...predicted);
        }

        this._failures = failures;
    }

    /**
     * Returns the failures found in the trace along with their root causes and
     * the violated invariants that predicted the failure. This will be used by
     * the UI to populate a view of debugging results and allow the user to
     * inspect the behavior where the invariant violation happened. If no root
     * cause is found, then new semantics will be added in learning mode and it
     * will be associated with this trace where this failure occured.
     * @returns {Object}
     */
    getFailures () {
        return this._failures;
    }
}

export default TraceDebugger;
