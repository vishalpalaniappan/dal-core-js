/* eslint-disable max-len */
import InvariantParser from "./Invariants/InvariantParser.js";
import CreatePrimitive from "./SemanticPrimitives/CreatePrimitive/CreatePrimitive.js";
import GetFromPosPrimitive from "./SemanticPrimitives/GetFromPosPrimitive/GetFromPosPrimitive.js";
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
    "CREATE_RE": /^create\s+(.+?)$/,
    "REMOVE_RE": /^remove\s+(.+?)$/,
    "GET_FROM_POS_RE": /^getFromPos\s+(.+?)\s+(.+?)\s+(.+?)$/,
    "REMOVE_FROM_POS_RE": /^removeFromPos\s+(.+?)\s+(.+?)$/,
    "HAS_KEY_RE": /^hasKey\s+(.+?)\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/,
    "REQUIRE_RE": /^require\s+(.+?)(?:\s+(input))?$/,
    "INVARIANT_RE": /^invariant\s+(.+)$/,
};

class BehavioralLanguageParser {
    /**
     * Note: There is a more formal way to implement this, but I am
     * going to implement a simple version to prove this out for myself.
     * By more formal, I mean that there are well defined patterns for how
     * to establish a language parser, I haven't bothered looking it up
     * but I will after I prove some concepts out for myself.
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
    }

    execute (script, participants, args) {
        // Ex: set <target_participant> <value_participant> [keys]
        const isSet = re["SET_RE"].test(script);
        if (isSet) {
            return this.executeSet(script, participants);
        }

        // Ex: insert <value> <target> [keys] <position>
        const isInsert = re["INSERT_RE"].test(script);
        if (isInsert) {
            return this.executeInsert(script, participants);
        }

        // Ex: get <from> ["keys"] <target>
        const isGet = re["GET_RE"].test(script);
        if (isGet) {
            return this.executeGet(script, participants);
        }

        // Ex: create <participant>
        const isCreate = re["CREATE_RE"].test(script);
        if (isCreate) {
            return this.executeCreate(script, participants, args);
        }

        // Ex: remove <participant>
        const isRemove = re["REMOVE_RE"].test(script);
        if (isRemove) {
            return this.executeRemove(script, participants);
        }

        // Ex: getFromPos <source> <position> <target>
        const isGetFromPos = re["GET_FROM_POS_RE"].test(script);
        if (isGetFromPos) {
            return this.executeGetFromPos(script, participants);
        }

        // Ex: removeFromPos <source> <position>
        const isRemoveFromPos = re["REMOVE_FROM_POS_RE"].test(script);
        if (isRemoveFromPos) {
            return this.executeRemoveFromPos(script, participants);
        }

        // Ex: hasKey <source> <key> <target> [keys]
        const isHasKey = re["HAS_KEY_RE"].test(script);
        if (isHasKey) {
            return this.executeHasKey(script, participants);
        }

        // Ex: require <participant> input
        const isRequire = re["REQUIRE_RE"].test(script);
        if (isRequire) {
            return this.executeRequire(script, participants, args);
        }

        const isInvariant = re["INVARIANT_RE"].test(script);
        if (isInvariant) {
            return this.executeInvariant(script, participants);
        }

        // throw new Error(`Script "${script}" does not match any known primitive patterns.`);
        console.error(`Script "${script}" does not match any known primitive patterns.`);
        return {
            participants,
            output: null,
        };
    }

    executeInvariant (script, participants) {
        console.log("Executing invariant");
        const invariantParser = new InvariantParser();
        const output = invariantParser.run(script, participants)
        return {
            participants,
            output: output,
        };
    }

    executeRequire (script, participants) {
        console.log("Executing require");
        const [, participantName, input] = script.match(re["REQUIRE_RE"]);
        if (!input && !(participantName in participants)) {
            throw new Error(`Required participant ${participantName} is missing`);
        }
        if (input) {
            // input is an optional flag to indicate that this participant is required as an input
            // currently this input will be read from the args passed into the semantic evaluator.
            // Soon, the value will be accepted from the user as part of executing the semantic model
            // TODO: Temporary, will remove log after establishing all the tests.
            console.log(`Pariticpant ${participantName} is required as input`);
        }
        return {
            participants,
            output: null,
        };
    }

    executeSet (script, participants) {
        console.log("Executing set");
        const [, targetPName, valuePName, keys] = script.match(re["SET_RE"]);
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
        console.log( "Executing insert");
        const [, valuePName, targetPName, keys, position] = script.match(re["INSERT_RE"]);
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
        console.log("Executing get");
        const [, sourcePName, keys, targetPName] = script.match(re["GET_RE"]);
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
        console.log("Executing create");
        const [, targetPName] = script.match(re["CREATE_RE"]);
        const input = {
            targetParticipantName: targetPName,
            initialValue: args?.initialValue,
        };
        const updatedParticipants = new CreatePrimitive(input, participants).apply_transformations();
        return {
            participants: updatedParticipants,
            output: null,
        };
    }

    executeRemove (script, participants) {
        console.log("Executing remove");
        const [, targetPName] = script.match(re["REMOVE_RE"]);
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
        console.log("Executing getFromPos");
        const [, sourcePName, position, targetPName] = script.match(re["GET_FROM_POS_RE"]);
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
        console.log("Executing removeFromPos");
        const [, sourcePName, position] = script.match(re["REMOVE_FROM_POS_RE"]);
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

    executeHasKey (script, participants) {
        console.log("Executing hasKey");
        const [, sourcePName, keyPName, targetPName, keys] = script.match(re["HAS_KEY_RE"]);
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
