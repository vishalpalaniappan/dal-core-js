import clpFfiJsModuleInit from "clp-ffi-js/node";
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../../src/DALEngine.js";

describe("traces tests", () => {

    it("adds a trace and removes a trace", async () => {
        const d = new DALEngine({
            name: "Execution Trace Walker",
            description: "Walks through execution traces",
        });

        const filePath = resolve(
            __dirname, "../test_data/37901387-61a5-4a9c-980a-99bc9a6bd6ec.clp.zst"
        );
        const traceData = await readFile(filePath)
        const traceUid = "37901387-61a5-4a9c-980a-99bc9a6bd6ec.clp.zst";
        d.traces.addTrace({
            uid: traceUid,
            trace: traceData,
        });

        expect(d.traces.getTrace(traceUid).uid).toEqual(traceUid);

        d.traces.deleteTrace(traceUid);
        expect(d.traces.getTraces().length).toEqual(0);
    });
});
