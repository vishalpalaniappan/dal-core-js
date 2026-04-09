import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
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

describe("serialization and deserialization", () => {

    it ("serializes and deserializes an implementation correctly", async () => {
        const {source, indexJson, filePath} = await getFiles();

        const shortIndex = [indexJson[0]];
        let d = new DALEngine({name: "", description: ""});

        // Add source, statement index and behavior to statement index
        const f = d.addFileV2("src/test.py", "test.py", "SOURCE");
        f.addStatementIndex(shortIndex);
        f.setBehavior(shortIndex[0].uid, "test behavi3or");

        // For the same stmt index, set the participant and variable name
        f.setParticipant(shortIndex[0].uid, "test participant", "variableName");

        // Serialize and deseralize
        const tempFilePath = resolve(__dirname, "../temp/v2implementation.json")
        await writeFile(tempFilePath, d.serialize())
        d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.deserialize(await readFile(tempFilePath, "utf-8"));

        // Check that there is one fil
        expect(d.implementationV2.getFiles().length).toBe(1);

        // Check that the first file has the correct key
        const retrievedFile = d.implementationV2.getFiles()[0];
        expect(retrievedFile.getKey()).toEqual("src/test.py");

        // Get the stmt from the file and check that its behavior is what was set
        const stmt = retrievedFile.getMappedStatement(shortIndex[0].uid);
        expect(stmt.getBehavior()).toEqual("test behavi3or");

        // Get the participant from the stmt and check that the variable name is correct
        const participant = retrievedFile.getParticipant(shortIndex[0].uid, "test participant");
        expect(participant.variableName).toEqual("variableName");
    });


});