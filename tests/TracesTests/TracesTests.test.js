import clpFfiJsModuleInit from "clp-ffi-js/node";
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../../src/DALEngine.js";
import { trace } from "console";

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

    it("serializes engine with a trace and loads trace from file", async () => {
        let d = new DALEngine({
            name: "Execution Trace Walker",
            description: "Walks through execution traces",
        });

        const traceFilePath = resolve(
            __dirname, "../test_data/37901387-61a5-4a9c-980a-99bc9a6bd6ec.clp.zst"
        );
        const traceData = await readFile(traceFilePath)
        const traceUid = "37901387-61a5-4a9c-980a-99bc9a6bd6ec.clp.zst";
        d.traces.addTrace({
            uid: traceUid,
            trace: traceData,
        });

        const tempFilePath = resolve(__dirname, "../temp/traceTemp.json")
        await writeFile(tempFilePath, d.serialize())

        d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.deserialize(await readFile(tempFilePath));

        expect(d.traces.getTrace(traceUid).uid).toEqual(traceUid);

        const traceTempPath = resolve(__dirname, "../temp/trace.clp.zst")
        await writeFile(traceTempPath, new Uint8Array(d.traces.getTrace(traceUid).trace.data))
    });
});
