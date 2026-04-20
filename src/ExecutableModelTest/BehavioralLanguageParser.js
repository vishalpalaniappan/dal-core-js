

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
    constructor () {
        this.primitiveConstructors = {};
    }

    registerPrimitive(primitiveName, constructor) {
        this.primitiveConstructors[primitiveName] = constructor;
    }

    parse (script) {
        // parse script
    }

}

export default BehavioralLanguageParser;
