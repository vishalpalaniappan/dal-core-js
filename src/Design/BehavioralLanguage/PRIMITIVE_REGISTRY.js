/* eslint-disable max-len */
import RequirePrimitive from "./Context/RequirePrimitive/RequirePrimitive.js";
import SelectPrimitive from "./Context/SelectPrimitive/SelectPrimitive.js";
import InvariantParser from "./Invariants/InvariantParser.js";
import CreatePrimitive from "./SemanticPrimitives/CreatePrimitive/CreatePrimitive.js";
import GetFromPosPrimitive from "./SemanticPrimitives/GetFromPosPrimitive/GetFromPosPrimitive.js";
import GetLengthPrimitive from "./SemanticPrimitives/GetLengthPrimitive/GetLengthPrimitive.js";
import GetPrimitive from "./SemanticPrimitives/GetPrimitive/GetPrimitive.js";
import HasKeyPrimitive from "./SemanticPrimitives/HasKeyPrimitive/HasKeyPrimitive.js";
import InsertPrimitive from "./SemanticPrimitives/InsertPrimitive/InsertPrimitive.js";
import IsEqualPrimitive from "./SemanticPrimitives/IsEqualPrimitive/IsEqualPrimitive.js";
import RemoveFromPositionPrimitive from "./SemanticPrimitives/RemoveFromPosPrimitive/RemoveFromPosPrimitive.js";
import RemovePrimitive from "./SemanticPrimitives/RemovePrimitive/RemovePrimitive.js";
import SetPrimitive from "./SemanticPrimitives/SetPrimitive/SetPrimitive.js";

export const PRIMITIVE_REGISTRY = Object.freeze({
    "SET_RE": /^set\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/,
    "INSERT_RE": /insert\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/,
    "GET_RE": /^get\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/,
    "REMOVE_KEY_RE": /^remove\s+(.+?)\s+from\s+(.+?)$/,
    "CREATE_RE": /^create\s+(\S+)\s+(\S+)(?:\s+(.+))?$/,
    "REMOVE_RE": /^remove\s+(.+?)$/,
    "GET_FROM_POS_RE": /^getFromPos\s+(.+?)\s+(.+?)\s+(.+?)$/,
    "REMOVE_FROM_POS_RE": /^removeFromPos\s+(.+?)\s+(.+?)$/,
    "HAS_KEY_RE": /^hasKey\s+(.+?)\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/,
    "REQUIRE_RE": /^require\s+(\w+)(?:\s+(input)|\s+(\[[^\]]*\])\s+(.+))?$/,
    "INVARIANT_RE": /^invariant\s+(.+)$/,
    "IS_EQUAL_RE": /^isEqual\s+(\w+)\s+(\w+)\s+(\w+)$/,
    "GET_LENGTH_RE": /^getLength\s+(\w+)\s+(\w+)$/,
    "SELECT_RE": /^select\s+(\w+)(?:\s+if\s+(\w+))?$/,
});

export const PRIMITIVE_BINDINGS = Object.freeze({
    "SET": {
        "invoke": SetPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.SET_RE,
    },
    "INSERT": {
        "invoke": InsertPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.INSERT_RE,
    },
    "GET": {
        "invoke": GetPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.GET_RE,
    },
    "REMOVE_KEY": {
        "invoke": RemovePrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.REMOVE_KEY_RE,
    },
    "CREATE": {
        "invoke": CreatePrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.CREATE_RE,
    },
    "REMOVE": {
        "invoke": RemovePrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.REMOVE_RE,
    },
    "GET_FROM_POS": {
        "invoke": GetFromPosPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.GET_FROM_POS_RE,
    },
    "REMOVE_FROM_POS": {
        "invoke": RemoveFromPositionPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.REMOVE_FROM_POS_RE,
    },
    "HAS_KEY": {
        "invoke": HasKeyPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.HAS_KEY_RE,
    },
    "REQUIRE": {
        "invoke": RequirePrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.REQUIRE_RE,
    },
    "INVARIANT": {
        "invoke": InvariantParser.bind(this),
        "regex": PRIMITIVE_REGISTRY.INVARIANT_RE,
    },
    "IS_EQUAL": {
        "invoke": IsEqualPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.IS_EQUAL_RE,
    },
    "GET_LENGTH": {
        "invoke": GetLengthPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.GET_LENGTH_RE,
    },
    "SELECT": {
        "invoke": SelectPrimitive.bind(this),
        "regex": PRIMITIVE_REGISTRY.SELECT_RE,
    },
});

