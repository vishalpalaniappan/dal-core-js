import DALEngineError from "./DALEngineError";

class UnknownInvariantError extends DALEngineError {
    constructor (invariantName) {
        super(`The invariant named "${invariantName}" was not found in the participant.`);
    }
}

export default UnknownInvariantError;
