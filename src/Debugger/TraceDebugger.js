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

        // Note: Currently there is no concurrency, so only one failure but
        // for distributed systems, there can be many, so I'm using an array.
        this._failures = [];

        // Stores the processed trace that will be used by UI for visualization
        // Each node is a behavior that has the participant, its value and the
        // semantic validity of the behavior as determined by the design.
        // Each atomic path will have its own UID.
        this.processedTrace = [];

        // Track all the violated invariants
        this._invariantsViolated = [];

        // The output of executable semantic model for each behavior in trace.
        this._executableSemanticModelOutput = [];
    }

    run () {
        if (!this._logs || this._logs.length === 0) return;
        this.currentIndex = 0;
        this.currentBehavior = null;

        this.visitCurrentNode();
        this._atomicPathsLog.push(this._currentPathLog);
        this.debug();

        this.runExecutableSemanticModels();
        return this._atomicPathsLog;
    }

    runExecutableSemanticModels () {
        for (const trace of this.processedTrace) {
            const currentNode = this.findNodeByBehaviorName(trace.behavior);
            const currBehavior = currentNode.getBehavior();
            currBehavior.setPreWorldState(trace.preParticipants);
            currBehavior.setPostWorldState(trace.postParticipants);
            currBehavior.setPrimitiveArgs(trace.arguments);
            const output = currBehavior.computeTransformations();
            this._executableSemanticModelOutput.push({
                behavior: trace.behavior,
                output,
            });
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

    addLog (currentNode, reachedAtomic = false) {
        this._currentPathLog.push(currentNode);
        if (reachedAtomic) {
            this._atomicPathsLog.push(this._currentPathLog);
            this._currentPathLog = [];
        }
    }

    processBehavior (currentNode) {
        const currBehaviorName = currentNode.getBehavior().getName();
        this.currentBehavior = currBehaviorName;
        this.processedTrace.push({
            behavior: currBehaviorName,
            preParticipants: {},
            postParticipants: {},
            arguments: {},
        })
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
                this.processBehavior(currentNode);
                break;
            case "participant":
                this.processParticipant();
                break;
            case "argument":
                this.processParticipant();
                break;
            case "failure":
                this._failures.push(
                    {
                        log: this._logs[this.currentIndex],
                        index: this.currentIndex,
                        rootCauses: [],
                    }
                );
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
        for (const failure of this._failures) {
            this.processFailure(failure);
        }
    }

    processFailure (failure) {
        let rootCause;
        const failedBehavior = failure["log"].getBehavior();
        for (const violation of this._invariantsViolated) {
            for (const prediction of violation.invariant.predictedFailures) {
                if (prediction.behavior != failedBehavior) continue;
                rootCause = [
                    `Root cause of failure at ${failedBehavior}`,
                    `due to invariant ${violation.invariant.getName()}`,
                    `being violated at behavior ${violation.behavior.getName()}.`
                ].join(" ");
                this.addLog(rootCause);
                failure.rootCauses.push({
                    invariant: violation.invariant,
                    behavior: violation.behavior,
                    reason: prediction.reason,
                    summary: rootCause,
                });
            }
        }
    }
}

export default TraceDebugger;
