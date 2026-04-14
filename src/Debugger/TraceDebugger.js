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
     * @param {Object} implementation The implementation to use for debugging.
     * @param {String} traceId The ID of the trace to debug.
     * @param {Array} traceLogs The logs of the trace to debug.
     */
    constructor (design, implementation, traceId, traceLogs) {
        this._implementation = implementation;
        this._traceId = traceId;
        this._design = design;
        this._logs = traceLogs.map((log) => new LogEntry(log));

        // Track all the violated invariants
        this._invariantsViolated = [];

        // Automated debugging will be implemented using
        // these invariants.

        // Indiciates if an invalid transition was found
        this._instrumentationFailure = false;

        // Tracks the atomic paths in the execution
        // This will be extended into an object of its own
        // but for now it is used for logging.
        this._atomicPathsLog = [];
        this._currentPathLog = [];

    }

    run () {
        this.currentIndex = 0;
        this.currentBehavior = null;

        this.visitCurrentNode();
        this._atomicPathsLog.push(this._currentPathLog);
    }

    findNode (index) {
        const graphs = this._design.getGraphs();
        for (const graph of Object.keys(graphs)) {
            try {
                const behavior = graphs[graph].findNode(
                    this._logs[index].getBehavior()
                );
                return behavior;
            } catch {}
        }
    }

    addLog (currentNode, reachedAtomic = false) {
        this._currentPathLog.push(currentNode);
        if (reachedAtomic) {
            this._atomicPathsLog.push(this._currentPathLog);
            this._currentPathLog = [];
        }
    }

    processParticipant (currentNode) {
        const currLog = this._logs[this.currentIndex];
        this.addLog(`   Processing participant named ${currLog.getParticipantName()}.`);
        this.addLog(`   Participant Value: ${JSON.stringify(currLog.getParticipantValue())}.`);

        const currBehavior = currentNode.getBehavior();
        const currParticipant = currBehavior.getParticipant(currLog.getParticipantName());

        currParticipant.setValue(currLog.getParticipantValue());
        currParticipant.evaluateInvariants();

        if (currParticipant.getInvariants().length > 0) {
            this.addLog(`   Invariant Violated: ${currParticipant._invariantViolated}.`);
        }

        // Add to the list of violated invariants if the invariant was violated.
        if (currParticipant._invariantViolated) {
            this._invariantsViolated.push({
                index: this.currentIndex,
                behavior: currBehavior,
                participant: currParticipant,
            });
        }
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
        const currentNode = this.findNode(++this.currentIndex);
        const currBehavior = currentNode.getBehavior().getName();

        if (this.currentIndex < this._logs.length - 1) {
            const nextNode = this.findNode(this.currentIndex + 1);
            const nextBehavior = nextNode.getBehavior().getName();

            if (this.currentBehavior !== currBehavior) {
                this.addLog(`Behavior: ${currBehavior}.`);
                this.currentBehavior = currBehavior;
            }

            if (this._logs[this.currentIndex].getType() == "variable") {
                this.processParticipant(currentNode);
            }

            if ((currBehavior === nextBehavior) || currentNode.isValidTransition(nextBehavior)) {
                this.visitCurrentNode();
            } else {
                if (nextNode.isAtomic()) {
                    this.addLog(`Reached atomic behavior ${nextBehavior}.`, true);
                    this.visitCurrentNode();
                } else {
                    this.instrumentationFailure = true;
                    this.addLog(`Invalid Transition from ${currBehavior}->${nextBehavior}.`);
                }
            }
        }
    }
}

export default TraceDebugger;
