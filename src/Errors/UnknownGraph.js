import DALEngineError from "./DALEngineError";

class UnknownGraph extends DALEngineError {
    constructor (name) {
        let msg = `Graph with name "${name}" does not exist.`;
        super(msg);
    }
}

export default UnknownGraph;
