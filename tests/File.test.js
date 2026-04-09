import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import File from "../src/Implementation/File";

describe("file tests", () => {

    it("sets behavior ID from the file object", async () => {
        const filePath = resolve(__dirname, "./test_data/TransactionDB.py")
        const source = await readFile(filePath, "utf-8")
        const mapPath = resolve(__dirname, "./test_data/TransactionDB_mapping.json");
        const index = await readFile(mapPath, "utf-8");

        const f = new File("sampleFile.py");
        f.addVersion();
        f.addStatementIndex(JSON.parse(index));
        f.addContent(source);

    });


});
