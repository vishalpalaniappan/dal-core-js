import DALEngineError from "./DALEngineError";

class UnknownBehaviorError extends DALEngineError {
    constructor (behaviorName) {
        super(`The behavior named "${behaviorName}" was not found in graph.`);

        this.name = "UnknownBehaviorError";
        this.behaviorName = behaviorName;
    }
}

export default UnknownBehaviorError;
