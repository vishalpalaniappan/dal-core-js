import DALEngineError from "./DALEngineError";

class MissingAttributes extends DALEngineError {
    constructor (type, attribute) {
        let msg;
        if (Array.isArray(attribute) && attribute.length > 1) {
            msg = `"${type}" must be initialized with the attributes "${attribute}".`
        } else {
            msg = `"${type}" must be initialized with the attribute "${attribute}".`
        }
        super(msg);
    }
}

export default MissingAttributes;
