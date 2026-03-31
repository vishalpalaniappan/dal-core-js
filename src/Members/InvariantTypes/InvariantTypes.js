import {MinLengthInvariant} from "./MinLengthInvariant";
import {RangeInvariant} from "./RangeInvariant";

let INVARIANT_TYPES = {
    MIN_LENGTH: MinLengthInvariant,
    RANGE: RangeInvariant,
};
INVARIANT_TYPES = Object.freeze(INVARIANT_TYPES);

export default INVARIANT_TYPES;
