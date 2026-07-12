import BehavioralLanguageParser from "./BehavioralLanguageParser";

export const GetSynthesisPackage = (script) => {

    /**
     * TODO:
     * This method will export the synthesis metadata for the behavior. This
     * includes the participants, the behavior name and the synthesis meta
     * data for each of the transformations in the behavior. This will then be
     * used to synthesize the behavior in the target language. Currently that
     * language is in python and the actual synthesis methods are implemented in
     * a separate tool. In the future, it will be integrated into the engine.
     */

    const synthesisMeta = [];
    const parser = new BehavioralLanguageParser();
    let executionOutput;

    for (const line of script) {
        if (line.trim().startsWith("#")) {
            // Comment line or empty line, skip
            continue;
        }

        try {
            /**
             * TODO:
             * I am setting world state to null to indicate to the
             * behavioral language parser that I only want the synthesis
             * meta. This is getting convoluted because I am making changes
             * building on things I want to change. Soon, once I have a working
             * workflow for the synthesis, I will return to this and rewrite
             * this in a very simple way. This is because once synthesis is
             * working, there is no more applying transformation in the
             * engine, the synthesized behavior is what is executed, so it
             * will become very simple.
             *
             * The main issue is, I am in the exploration phase and its
             * hard to write well planned code (because the plan keeps changing)
             * I am just prioritizing prove out the conclusions of my thoughts,
             * and then I will build cleanly with everything I've learned.
             */
            const worldState = null;
            executionOutput = parser.execute(
                line.trim(), worldState, {}
            );
            if (executionOutput?.synthesisMeta) {
                synthesisMeta.push(executionOutput.synthesisMeta);
            }
        } catch (error) {
            console.error(
            `Error executing line "${line}": ${error}`
            );
        }
    }
    return synthesisMeta;
}

