import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import File from "../src/Implementation/File";
import Source from "../src/Implementation/Source";

describe("file tests", () => {

    it("creates a file object, adds a source and statement index to latest version", async () => {
        // Load the source file and mapping to be used for testing
        const filePath = resolve(__dirname, "./test_data/TransactionDB.py")
        const source = await readFile(filePath, "utf-8")
        const mapPath = resolve(__dirname, "./test_data/TransactionDB_mapping.json");
        const index = await readFile(mapPath, "utf-8");

        const f = new File("sampleFile.py");
        const s = new Source({uid: "source1"});
        s.setContent(source);
        s.addStatementIndex(JSON.parse(index));
        f.addVersion(s);

        const versions = f.getVersions();
        expect(versions).toBeDefined();
        expect(versions).toBeInstanceOf(Array);
        expect(versions.length).toBe(1);
        expect(versions[0]).toBe(s);

        const latestVersion = f.getLatestVersion();
        expect(latestVersion).toBe(s);

        const versionId = "v1";
        s.setVersionId(versionId);
        const retrievedVersion = f.getVersion(versionId);
        expect(retrievedVersion).toBe(s);

        const v = latestVersion.getStatementIndex();
        expect(v).toBeDefined();
        console.log(s.getStatementIndexEntryByUid(index[0].uid));
    });

});
