import CreatePrimitive from "./SemanticPrimitives/CreatePrimitive/CreatePrimitive.js";
import GetPrimitive from "./SemanticPrimitives/GetPrimitive/GetPrimitive.js";
import InsertPrimitive from "./SemanticPrimitives/InsertPrimitive/InsertPrimitive.js";
import SetPrimitive from "./SemanticPrimitives/SetPrimitive/SetPrimitive.js";

const re = {
    "SET_RE": /^set\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/,
    "INSERT_RE": /insert\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/,
    "GET_RE": /^get\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/,
    "REMOVE_KEY_RE": /^remove\s+(.+?)\s+from\s+(.+?)$/,
    "CREATE_RE": /^create\s+(.+?)$/,
}

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
    }

    executeSet (script, participants) {
        console.log("Executing set");
        const [, targetPName, valuePName, keys] = script.match(re["SET_RE"]);
        const input = {
            keys: JSON.parse(keys),
            targetParticipantName: targetPName,
            valueParticipantName: valuePName,
        };
        return new SetPrimitive(input, participants).apply_transformations();
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
        return new InsertPrimitive(input, participants).apply_transformations();
    }

    executeGet (script, participants) {
        console.log("Executing get");
        const [, sourcePName, keys, targetPName] = script.match(re["GET_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            keys: JSON.parse(keys),
            targetParticipantName: targetPName,
        };
        return new GetPrimitive(input, participants).apply_transformations();
    }

    executeCreate (script, participants, args) {
        console.log("Executing create");
        const [, targetPName] = script.match(re["CREATE_RE"]);
        const input = {
            targetParticipantName: targetPName,
            initialValue: args.initialValue,
        };
        return new CreatePrimitive(input, participants).apply_transformations();
    }

}

export default BehavioralLanguageParser;
