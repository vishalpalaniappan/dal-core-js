import DALEngineError from "./DALEngineError";

class UnknownParticipantError extends DALEngineError {
    constructor (participantName) {
        super(`The participant named "${participantName}" was not found in the behavior.`);
    }
}

export default UnknownParticipantError;
