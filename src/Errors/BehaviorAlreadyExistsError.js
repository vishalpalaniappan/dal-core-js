import DALEngineError from "./DALEngineError";

class BehaviorAlreadyExistsError extends DALEngineError {
    constructor (name) {
        let msg = `Node with Behavior name "${name}" already exists in the graph.`;
        super(msg);
    }
}

export default BehaviorAlreadyExistsError;
