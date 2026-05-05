/* eslint-disable max-len */
import RequirePrimitive from "./Context/RequirePrimitive/RequirePrimitive.js";
import InvariantParser from "./Invariants/InvariantParser.js";
import CreatePrimitive from "./SemanticPrimitives/CreatePrimitive/CreatePrimitive.js";
import GetFromPosPrimitive from "./SemanticPrimitives/GetFromPosPrimitive/GetFromPosPrimitive.js";
import GetLengthPrimitive from "./SemanticPrimitives/GetLengthPrimitive/GetLengthPrimitive.js";
import GetPrimitive from "./SemanticPrimitives/GetPrimitive/GetPrimitive.js";
import HasKeyPrimitive from "./SemanticPrimitives/HasKeyPrimitive/HasKeyPrimitive.js";
import InsertPrimitive from "./SemanticPrimitives/InsertPrimitive/InsertPrimitive.js";
import RemoveFromPositionPrimitive from "./SemanticPrimitives/RemoveFromPosPrimitive/RemoveFromPosPrimitive.js";
import RemovePrimitive from "./SemanticPrimitives/RemovePrimitive/RemovePrimitive.js";
import SetPrimitive from "./SemanticPrimitives/SetPrimitive/SetPrimitive.js";

const re = {
    "SET_RE": /^set\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/,
    "INSERT_RE": /insert\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/,
    "GET_RE": /^get\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/,
    "REMOVE_KEY_RE": /^remove\s+(.+?)\s+from\s+(.+?)$/,
    "CREATE_RE": /^create\s+(\S+)\s+(\S+)$/,
    "REMOVE_RE": /^remove\s+(.+?)$/,
    "GET_FROM_POS_RE": /^getFromPos\s+(.+?)\s+(.+?)\s+(.+?)$/,
    "REMOVE_FROM_POS_RE": /^removeFromPos\s+(.+?)\s+(.+?)$/,
    "HAS_KEY_RE": /^hasKey\s+(.+?)\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/,
    "REQUIRE_RE": /^require\s+(\w+)(?:\s+(input)|\s+(\[[^\]]*\])\s+(.+))?$/,
    "INVARIANT_RE": /^invariant\s+(.+)$/,
    "GET_LENGTH_RE": /^getLength\s+(\w+)\s+(\w+)$/,
};

class BehavioralLanguageParser {
    /**
     * Note: There is a more formal way to implement this, but I am
     * going to implement a simple version to prove this out for myself.
     * By more formal, I mean that there are well defined patterns for how
     * to establish a language parser, I haven't bothered looking it up
     * but I will after I prove some concepts out for myself.
     *
     * In the long run, I want this to be a formal Behavioral Semantic Language
     * (BSL) that can be used to define executable semantic models. I feel that
     * the way that I am using this is just one application, there are much
     * broader implications for a language like this but I am focusing on using
     * it to automate the management of software systems.
     *
     * A simple behavioral language parser that can be used
     * to convert a script into a set of primitives transformations that
     * are executed by the engine. At each step, the parser will
     * use the primitive constructor, perform the transformation
     * and then propogate the world state forward to the next
     * primitive.
     *
     * See readme in semantic primitives folder for more details.
     */
    constructor () {
        this.primitiveConstructors = {};
        this.re = re;
    }

    execute (script, participants, args) {
        // Ex: set <target_participant> <value_participant> [keys]
        const isSet = this.re["SET_RE"].test(script);
        if (isSet) {
            return this.executeSet(script, participants);
        }

        // Ex: insert <value> <target> [keys] <position>
        const isInsert = this.re["INSERT_RE"].test(script);
        if (isInsert) {
            return this.executeInsert(script, participants);
        }

        // Ex: get <from> ["keys"] <target>
        const isGet = this.re["GET_RE"].test(script);
        if (isGet) {
            return this.executeGet(script, participants);
        }

        // Ex: create <participant>
        const isCreate = this.re["CREATE_RE"].test(script);
        if (isCreate) {
            return this.executeCreate(script, participants, args);
        }

        // Ex: remove <participant>
        const isRemove = this.re["REMOVE_RE"].test(script);
        if (isRemove) {
            return this.executeRemove(script, participants);
        }

        // Ex: getFromPos <source> <position> <target>
        const isGetFromPos = this.re["GET_FROM_POS_RE"].test(script);
        if (isGetFromPos) {
            return this.executeGetFromPos(script, participants);
        }

        // Ex: removeFromPos <source> <position>
        const isRemoveFromPos = this.re["REMOVE_FROM_POS_RE"].test(script);
        if (isRemoveFromPos) {
            return this.executeRemoveFromPos(script, participants);
        }

        // Ex: hasKey <source> <key> <target> [keys]
        const isHasKey = this.re["HAS_KEY_RE"].test(script);
        if (isHasKey) {
            return this.executeHasKey(script, participants);
        }

        // Ex: require <participant> input
        const isRequire = this.re["REQUIRE_RE"].test(script);
        if (isRequire) {
            return this.executeRequire(script, participants, args);
        }

        // Ex: getLength <participant> <target>
        const isGetLength = this.re["GET_LENGTH_RE"].test(script);
        if (isGetLength) {
            return this.executeGetLength(script, participants);
        }

        const isInvariant = this.re["INVARIANT_RE"].test(script);
        if (isInvariant) {
            return this.executeInvariant(script, participants);
        }

        throw new Error(`Script "${script}" does not match any known primitive patterns.`);
    }

    executeInvariant (script, participants) {
        const invariantParser = new InvariantParser();
        const output = invariantParser.run(script, participants)
        return {
            participants,
            output: output,
        };
    }

    executeRequire (script, participants, args) {
        const [, participantName, input, keys, value] = script.match(this.re["REQUIRE_RE"]);
        const requirePrimitive = new RequirePrimitive(participants, args);
        return requirePrimitive.run(participantName, input, keys, value);
    }

    executeSet (script, participants) {
        const [, targetPName, valuePName, keys] = script.match(this.re["SET_RE"]);
        const input = {
            keys: JSON.parse(keys),
            targetParticipantName: targetPName,
            valueParticipantName: valuePName,
        };
        const updatedParticipants = new SetPrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeInsert (script, participants) {
        const [, valuePName, targetPName, keys, position] = script.match(this.re["INSERT_RE"]);
        const input = {
            targetParticipantName: targetPName,
            keys: JSON.parse(keys),
            valueParticipantName: valuePName,
            index: parseInt(position),
        };
        const updatedParticipants = new InsertPrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeGet (script, participants) {
        const [, sourcePName, keys, targetPName] = script.match(this.re["GET_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            keys: JSON.parse(keys),
            targetParticipantName: targetPName,
        };
        const updatedParticipants = new GetPrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeCreate (script, participants, args) {
        const [, targetPName, type] = script.match(this.re["CREATE_RE"]);
        const input = {
            targetParticipantName: targetPName,
            type: type,
        };
        const updatedParticipants = new CreatePrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeRemove (script, participants) {
        const [, targetPName] = script.match(this.re["REMOVE_RE"]);
        const input = {
            targetParticipantName: targetPName,
        };
        const updatedParticipants = new RemovePrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeGetFromPos (script, participants) {
        const [, sourcePName, position, targetPName] = script.match(this.re["GET_FROM_POS_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            position: parseInt(position),
            targetParticipantName: targetPName,
        };
        const updatedParticipants = new GetFromPosPrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeRemoveFromPos (script, participants) {
        const [, sourcePName, position] = script.match(this.re["REMOVE_FROM_POS_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            position: parseInt(position),
        };
        const updatedParticipants = new RemoveFromPositionPrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeGetLength (script, participants) {
        const [, sourcePName, targetPName] = script.match(this.re["GET_LENGTH_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            targetParticipantName: targetPName,
        };
        const updatedParticipants = new GetLengthPrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeHasKey (script, participants) {
        const [, sourcePName, keyPName, targetPName, keys] = script.match(this.re["HAS_KEY_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            keyParticipantName: keyPName,
            targetParticipantName: targetPName,
            keys: JSON.parse(keys),
        };
        const updatedParticipants = new HasKeyPrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }
}

export default BehavioralLanguageParser;
