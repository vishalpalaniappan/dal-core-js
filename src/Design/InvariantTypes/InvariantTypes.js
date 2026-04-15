import {MinLengthInvariant} from "./MinLengthInvariant";
import {RangeInvariant} from "./RangeInvariant";
import {RequiredKeysInvariant} from "./RequiredKeysInvariant";

let INVARIANT_TYPES = {
    MIN_LENGTH: MinLengthInvariant,
    RANGE: RangeInvariant,
    REQUIRED_KEYS: RequiredKeysInvariant,
};
INVARIANT_TYPES = Object.freeze(INVARIANT_TYPES);

export default INVARIANT_TYPES;
