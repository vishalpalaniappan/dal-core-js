import InsertPrimitive from "./SemanticPrimitives/InsertPrimitive.js";
import SetPrimitive from "./SemanticPrimitives/SetPrimitive.js";

const re = {
    "SET_RE": /^set\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/,
    "INSERT_RE": /insert\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/,
}

class BehavioralLanguageParser {
    /**
     * Note: There is a more formal way to implement this, but I am
     * going to implement a simple version to prove this out for myself.
     * By more formal, I mean that there is well defined patterns for how
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
     * I am starting with just the set and insert primitive. A world
     * state has to provided with participants and these participants
     * will be refrenced in the script and the transformations will
     * be applied by the primitives.
     */
    constructor () {
        this.primitiveConstructors = {};
    }

    execute (script, participants) {
        // Ex: set <target_participant> <value_participant> <key>
        const isSet = re["SET_RE"].test(script);
        if (isSet) {
            return this.executeSet(script, participants);
        }

        // Ex: insert <value> <target> [keys] <position>
        const isInsert = re["INSERT_RE"].test(script);
        if (isInsert) {
            return this.executeInsert(script, participants);
        }
    }

    executeSet (script, participants) {
        console.log("Executing set");
        const [, targetParticipantName, valueParticipantName, keys] = script.match(re["SET_RE"]);
        const input = {
            key: JSON.parse(keys)[0],
            targetParticipantName: targetParticipantName,
            valueParticipantName: valueParticipantName,
        };
        return new SetPrimitive(input, participants).apply_transformations();
    }

    executeInsert (script, participants) {
        console.log( "Executing insert");
        // eslint-disable-next-line max-len
        const [, valueParticipantName, targetParticipantName, keys, position] = script.match(re["INSERT_RE"]);
        const input = {
            targetParticipantName: targetParticipantName,
            key: JSON.parse(keys)[0],
            valueParticipantName: valueParticipantName,
            index: parseInt(position),
        };
        return new InsertPrimitive(input, participants).apply_transformations();
    }
}

export default BehavioralLanguageParser;
