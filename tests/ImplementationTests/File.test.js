import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import File from "../../src/Implementation/File";

const getFiles = async () => {
    const filePath = resolve(__dirname, "../test_data/TransactionDB.py")
    const source = await readFile(filePath, "utf-8");
    const mapPath = resolve(__dirname, "../test_data/TransactionDB_mapping.json");
    const index = await readFile(mapPath, "utf-8");
    const indexJson = JSON.parse(index);
    return {source, indexJson, filePath};
}


describe("file tests", () => {

    it("sets behavior ID from the file object", async () => {
        const {source, indexJson, filePath} = await getFiles();
        const firstEntry = indexJson[0];

        const f = new File({name: "sampleFile.py", key: "sampleFile.py"});
        f.addVersion();
        f.setStatementIndex(indexJson);
        f.setContent(source);

        f.setBehavior(firstEntry.uid, "behavior1");
        expect(f.getMappedStatement(firstEntry.uid).getBehavior()).toBe("behavior1");

    });

    it("sets behavior and gets all entries with given behavior", async () => {
        const {source, indexJson, filePath} = await getFiles();
        const firstEntry = indexJson[0];

        const f = new File({name: "sampleFile.py", key: "sampleFile.py"});
        f.addVersion();
        f.setStatementIndex(indexJson);
        f.setContent(source);

        f.setBehavior(firstEntry.uid, "behavior1");
        expect(f.getMappedStatement(firstEntry.uid).getBehavior()).toBe("behavior1");

        expect(f.getStatementsWithBehavior("behavior1"))
            .toContain(f.getMappedStatement(firstEntry.uid));
    });

    it ("adds a participant and variable name to the file given a statement", async () => {
        const {source, indexJson, filePath} = await getFiles();
        const firstEntry = indexJson[0];

        const f = new File({name: "sampleFile.py", key: "sampleFile.py"});
        f.addVersion();
        f.setStatementIndex(indexJson);
        f.setContent(source);

        f.setParticipant(firstEntry.uid, "participant1", "variable1");
        expect(f.getParticipant(firstEntry.uid, "participant1").variableName).toBe("variable1");
    });
});
