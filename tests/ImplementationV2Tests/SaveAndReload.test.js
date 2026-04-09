import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import ImplementationV2 from "../../src/Implementation/ImplementationV2";
import { DALEngine } from "../../src/DALEngine";

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

        let d = new DALEngine({
            name: "Test Implementation",
            description: "This is a test implementation.",
        });

        const f = d.addFileV2("src/test.py", "test.py", "SOURCE");

        const tempFilePath = resolve(__dirname, "../temp/v2implementation.json")
        await writeFile(tempFilePath, d.serialize())
        d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.deserialize(await readFile(tempFilePath, "utf-8"));

        console.log(d.implementationV2.getFiles());
        expect(d.implementationV2.getFiles().length).toBe(1);
        const retrievedFile = d.implementationV2.getFiles()[0];
        expect(retrievedFile.getKey()).toEqual("src/test.py");

    });


});