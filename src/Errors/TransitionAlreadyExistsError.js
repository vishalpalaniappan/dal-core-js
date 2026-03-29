import DALEngineError from "./DALEngineError";

class TransitionAlreadyExistsError extends DALEngineError {
    constructor (behaviorName, transitionName) {
        let msg = `Node with behavior named "${behaviorName}" already has a transition\
         to behavior "${transitionName}".`;
        super(msg);
    }
}

export default TransitionAlreadyExistsError;
