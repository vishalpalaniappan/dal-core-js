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

    for (const line of this.script) {
        if (line.trim().startsWith("#")) {
            // Comment line or empty line, skip
            continue;
        }

        let executionOutput;
        try {
            // Worldstate null to only get the synthesis meta
            const worldState = null;
            executionOutput = this.BehavioralLanguageParser.execute(
                line, worldState, this.args
            );
            if (executionOutput?.synthesisMeta) {
                synthesisMeta.push(executionOutput.synthesisMeta);
            }
        } catch (error) {
            console.error(`Error executing line "${line}": ${error.message}`);
        }
    }

}

