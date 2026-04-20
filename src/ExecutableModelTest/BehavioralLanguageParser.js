import SetPrimitive from "./SemanticPrimitives/SetPrimitive.js";

class BehavioralLanguageParser {
    /**
     * Note: There is a more formal way to implement this, but I am
     * going to implement a simple version to prove this out for myself.
     * By more formal, I mean that there is well defined patterns for how
     * to establish a language parser, I haven't bothered looking it up
     * but I will after I prove some concepts out for myself.
     *
     * A simple behavioral language parser that can be used
     * to convert a script into a set of primitives that are
     * executed by the engine. At each step, the parser will
     * use the primitive constructor, perform the transformation
     * and then propogate the world state forward to the next
     * primitive.
     *
     * I am starting with just the set and insert primitive. A world
     * state has to provided with participants and these participants
     * will be refrenced in the script and the transformations will
     * be applied by the primitives.
     */
    constructor() {
        this.primitiveConstructors = {};
    }

    registerPrimitive (primitiveName, constructor) {
        this.primitiveConstructors[primitiveName] = constructor;
    }

    execute (script, participants, participants_post) {
        // Ex: set <target_participant> <value_participant> <key>
        const SET_RE = /^set\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?$/;

        const isSet = SET_RE.test(script);
        if (isSet) {
            const [, targetParticipantName, valueParticipantName, key] = script.match(SET_RE);
            const updatedParticipants = this.executeSet(
                targetParticipantName,
                valueParticipantName,
                JSON.parse(key)[0],
                participants,
                participants_post
            );
            return updatedParticipants;
        }

        // insert <value> <target> [keys] <position>
        const INSERT_RE = /insert\s+(.+?)\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/;
        const isInsert = INSERT_RE.test(script);
        if (isInsert) {
            const [, valueParticipantName, targetParticipantName, keys, position] = script.match(INSERT_RE);
            console.log(
                "Executing insert with:",
                valueParticipantName,
                targetParticipantName,
                keys,
                position
            );
        }
    }

    executeSet (targetParticipantName, valueParticipantName, key, participants, participants_post) {
        console.log("\n---- Executing Script ----");
        console.log("Executing set with:", targetParticipantName, valueParticipantName, key);

        const input = {
            key: key,
            targetParticipantName: targetParticipantName,
            valueParticipantName: valueParticipantName,
        };
        const p = new SetPrimitive(input, participants, participants_post);
        const output = p.apply_transformations();

        const isValid = p.evaluate_transformation_validity();
        console.log("Does computed state match execution?", isValid);

        // Update the value of the participants as set by the transformation
        for (const key in participants) {
            participants[key].setValue(output[key]._value);
        }
        console.log("---- Done Script----\n");
        return [participants, isValid];
    }

    executeInsert () {

    }
}

export default BehavioralLanguageParser;
