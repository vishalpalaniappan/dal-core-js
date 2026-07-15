/* eslint-disable max-len */
import RequirePrimitive from "./Context/RequirePrimitive/RequirePrimitive.js";
import SelectPrimitive from "./Context/SelectPrimitive/SelectPrimitive.js";
import InvariantParser from "./Invariants/InvariantParser.js";
import {PRIMITIVE_REGISTRY} from "./PRIMITIVE_REGISTRY.js";
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

const re = PRIMITIVE_REGISTRY;

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
     * TODO:
     * I will be removing all the transformations that are performed
     * by the engine and only generate the metadata to enable the
     * synthesis of behaviors.
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

        // Ex: isEqual <left> <right> <target>
        const isEqual = this.re["IS_EQUAL_RE"].test(script);
        if (isEqual) {
            return this.executeIsEqual(script, participants);
        }

        // Ex: select <behaviorName> if <flagParticipant>
        const isSelect = this.re["SELECT_RE"].test(script);
        if (isSelect) {
            return this.executeSelect(script, participants, args);
        }

        const isInvariant = this.re["INVARIANT_RE"].test(script);
        if (isInvariant) {
            return this.executeInvariant(script, participants);
        }

        throw new Error(`Script "${script}" does not match any known primitive patterns.`);
    }

    getSynthesisMeta (prim) {
        try {
            return prim.get_synthesis_meta();
        } catch (e) {
            return null;
        }
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
        const result = participants?requirePrimitive.run(participantName, input, keys, value):{};
        result["synthesisMeta"] = requirePrimitive.get_synthesis_meta(participantName, input);
        return result
    }

    executeSet (script, participants) {
        const [, targetPName, valuePName, keys] = script.match(this.re["SET_RE"]);
        const input = {
            keys: JSON.parse(keys),
            targetParticipantName: targetPName,
            valueParticipantName: valuePName,
        };
        const prim = new SetPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
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
        const prim = new InsertPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeGet (script, participants) {
        const [, sourcePName, keys, targetPName] = script.match(this.re["GET_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            keys: JSON.parse(keys),
            targetParticipantName: targetPName,
        };
        const prim = new GetPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeCreate (script, participants, args) {
        const [, targetPName, type, value] = script.match(this.re["CREATE_RE"]);
        const input = {
            targetParticipantName: targetPName,
            type: type,
            value: value,
        };
        const prim = new CreatePrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeRemove (script, participants) {
        const [, targetPName] = script.match(this.re["REMOVE_RE"]);
        const input = {
            targetParticipantName: targetPName,
        };
        const prim = new RemovePrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeGetFromPos (script, participants) {
        const [, sourcePName, position, targetPName] = script.match(this.re["GET_FROM_POS_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            position: parseInt(position),
            targetParticipantName: targetPName,
        };
        const prim = new GetFromPosPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeRemoveFromPos (script, participants) {
        const [, sourcePName, position] = script.match(this.re["REMOVE_FROM_POS_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            position: parseInt(position),
        };
        const prim = new RemoveFromPositionPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeGetLength (script, participants) {
        const [, sourcePName, targetPName] = script.match(this.re["GET_LENGTH_RE"]);
        const input = {
            sourceParticipantName: sourcePName,
            targetParticipantName: targetPName,
        };
        const prim = new GetLengthPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeIsEqual (script, participants) {
        const [, leftPName, rightPName, targetPName] = script.match(this.re["IS_EQUAL_RE"]);
        const input = {
            leftParticipantName: leftPName,
            rightParticipantName: rightPName,
            targetParticipantName: targetPName,
        };
        const prim = new IsEqualPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
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
        const prim = new HasKeyPrimitive(input, participants);
        const updatedParticipants = participants?prim.apply_transformations():null;
        return {
            participants: updatedParticipants,
            output: null,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }

    executeSelect (script, participants, args) {
        const [, behaviorName, flagParticipantName] = script.match(this.re["SELECT_RE"]);
        const input = {
            behaviorName: behaviorName,
            flagParticipantName: flagParticipantName,
        };
        const prim = new SelectPrimitive(input, participants);
        const output = prim.apply_transformations();
        return {
            participants: participants,
            output: output,
            synthesisMeta: this.getSynthesisMeta(prim),
        };
    }
}

export default BehavioralLanguageParser;
