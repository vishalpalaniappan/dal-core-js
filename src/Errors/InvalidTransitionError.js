import DALEngineError from "./DALEngineError";

class InvalidTransitionError extends DALEngineError {
    constructor (from, to) {
        super(`Invalid transition from "${from}" to "${to}"`);

        this.name = "InvalidTransitionError";
        this.prevBehavior = from;
        this.nextBehavior = to;
    }
}

export default InvalidTransitionError;
