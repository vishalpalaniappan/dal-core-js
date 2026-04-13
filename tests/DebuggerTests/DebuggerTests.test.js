import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../../src/DALEngine.js";

describe("debugger tests", () => {

    it("debugs an execution trace", async () => {
        const d = new DALEngine({
            name: "Library Manager",
            description: "Manages the library",
        });

        const filePath = resolve(__dirname, "../test_data/library_manager.dal");
        const source = await readFile(filePath);

        d.deserialize(source);

        const traceIds = Object.keys(d.implementation._traces);

        // Trace with no violations
        const traceNoViolations = traceIds[0];

        // Trace with min length violation
        const traceWithViolation = traceIds[1];

        const debuggerInstance = await d.createDebugger(traceWithViolation);

        const filePath2 = resolve(__dirname, "../temp/transitions.txt");
        await writeFile(
            filePath2, JSON.stringify(debuggerInstance._atomicPathsLog, null, 2)
        );
    });
});
