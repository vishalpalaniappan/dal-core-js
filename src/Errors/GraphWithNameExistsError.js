import DALEngineError from "./DALEngineError";

class GraphWithNameExistsError extends DALEngineError {
    constructor (name) {
        let msg = `Graph with name "${name}" already exists.`;
        super(msg);
    }
}

export default GraphWithNameExistsError;
