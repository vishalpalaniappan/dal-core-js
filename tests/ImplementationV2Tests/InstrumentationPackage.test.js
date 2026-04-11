import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {json} from "stream/consumers";
import {describe, expect, it} from "vitest";

import {DALEngine} from "../../src/DALEngine";

const getFiles = async () => {
    const filePath = resolve(__dirname, "../test_data/TransactionDB.py")
    const source = await readFile(filePath, "utf-8");
    const mapPath = resolve(__dirname, "../test_data/TransactionDB_mapping.json");
    const index = await readFile(mapPath, "utf-8");
    const indexJson = JSON.parse(index);
    return {source, indexJson, filePath};
}


describe("instrumentation package tests", async () => {
    it("generates instrumentation package", async () => {
        const {source, indexJson, filePath} = await getFiles();
        const firstEntry = indexJson[0];

        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        const f = d.addFile(filePath, "TransactionDB.py", source);

        f.addVersion();
        f.setStatementIndex(indexJson);
        f.setContent(source);

        f.setBehavior(firstEntry.uid, "behavior1");
        expect(f.getMappedStatement(firstEntry.uid).getBehavior()).toBe("behavior1");

        f.setParticipant(firstEntry.uid, "participant1", "variable1");

        const instrumentationPackage = d.implementation.exportForInstrumentation();

        const filePath2 = resolve(__dirname, "../temp/instrumentationExport.json");
        await writeFile(filePath2, instrumentationPackage);
    });

});
