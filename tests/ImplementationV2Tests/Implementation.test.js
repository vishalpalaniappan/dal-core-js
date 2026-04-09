import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import ImplementationV2 from "../../src/Implementation/ImplementationV2";

const getFiles = async () => {
    const filePath = resolve(__dirname, "../test_data/TransactionDB.py")
    const source = await readFile(filePath, "utf-8");
    const mapPath = resolve(__dirname, "../test_data/TransactionDB_mapping.json");
    const index = await readFile(mapPath, "utf-8");
    const indexJson = JSON.parse(index);
    return {source, indexJson, filePath};
}

describe("implementation tests", () => {

    it("creates implementation, adds source file and gets source file by UID", async () => {
        const {source, indexJson, filePath} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile("TransactionDB.py", filePath, source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        const retrievedFile = imp.getFile(f._uid);
        expect(retrievedFile).toBeDefined();
        expect(retrievedFile.getPath()).toEqual(filePath);
    });

    it("removes file from implementation and verifies it is removed", async () => {
        const {source, indexJson, filePath} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile("TransactionDB.py", filePath, source);

        imp.removeFile(f._uid);
        expect(() => imp.getFile(f._uid))
            .toThrow(`File with uid ${f._uid} not found in implementation.`);

    });

    it("adds file to implementation and adds statement index", async () => {
        const {source, indexJson, filePath} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile("TransactionDB.py", filePath, source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        const retrievedFile = imp.getFile(f._uid);
        const statementIndex = retrievedFile.getStatementIndex();
        statementIndex.forEach((stmt, idx) => {
            expect(stmt._uid).toEqual(indexJson[idx].uid);
        });
    });

    it("adds behavior to stmtid of file and throws on invalid stmtid", async () => {
        const {source, indexJson, filePath} = await getFiles();

        const stmt1 = indexJson[0];

        const imp = new ImplementationV2();
        const f = imp.addFile("TransactionDB.py", filePath, source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        f.setBehaviorId(stmt1.uid, "behavior1");
        expect(f.getMappedStatement(stmt1.uid).getBehavior()).toBe("behavior1");

        expect(() => f.setBehaviorId("asdf", "behavior1"))
            .toThrow("Statement with ID asdf does not exist in the active version.");
    });
});
