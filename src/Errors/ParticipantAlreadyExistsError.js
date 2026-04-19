import DALEngineError from "./DALEngineError";

class ParticipantAlreadyExistsError extends DALEngineError {
    constructor (name) {
        let msg = `Participant with name "${name}" already exists in the behavior.`;
        super(msg);
    }
}

export default ParticipantAlreadyExistsError;
