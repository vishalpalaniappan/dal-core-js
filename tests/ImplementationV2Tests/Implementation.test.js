import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import ImplementationV2 from "../../src/Implementation/ImplementationV2";

const getFiles = async () => {
    const fileKey = resolve(__dirname, "../test_data/TransactionDB.py")
    const source = await readFile(fileKey, "utf-8");
    const mapPath = resolve(__dirname, "../test_data/TransactionDB_mapping.json");
    const index = await readFile(mapPath, "utf-8");
    const indexJson = JSON.parse(index);
    return {source, indexJson, fileKey};
}

describe("implementation tests", () => {

    it("creates implementation, adds source file and gets source file by UID", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        const retrievedFile = imp.getFile(f._uid);
        expect(retrievedFile).toBeDefined();
        expect(retrievedFile.getKey()).toEqual(fileKey);
    });

    it("removes file from implementation and verifies it is removed", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);

        imp.removeFile(f._uid);
        expect(() => imp.getFile(f._uid))
            .toThrow(`File with uid ${f._uid} not found in implementation.`);

    });

    it("adds file to implementation, adds statement index and gets statement index", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        const retrievedFile = imp.getFile(f._uid);
        const statementIndex = retrievedFile.getStatementIndex();
        statementIndex.forEach((stmt, idx) => {
            expect(stmt._uid).toEqual(indexJson[idx].uid);
        });

        expect(imp.getStatementIndexForFile(f._uid).length).toEqual(indexJson.length);
    });

    it("adds behavior to stmtid of file and throws on invalid stmtid", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const stmt1 = indexJson[0];

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        f.setBehavior(stmt1.uid, "behavior1");
        expect(f.getMappedStatement(stmt1.uid).getBehavior()).toBe("behavior1");

        expect(() => f.setBehavior("asdf", "behavior1"))
            .toThrow("Statement with ID asdf does not exist in the active version.");
    });

    it("adds behavior to stmtid and removes behavior from stmtid", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const stmt1 = indexJson[0];

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        f.setBehavior(stmt1.uid, "behavior1");
        expect(f.getMappedStatement(stmt1.uid).getBehavior()).toBe("behavior1");

        f.clearBehavior(stmt1.uid);
        expect(f.getMappedStatement(stmt1.uid).getBehavior()).toBeNull();
    });

    it("adds behavior to stmtid and gets all statements with given behavior", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const stmt1 = indexJson[0];

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        f.setBehavior(stmt1.uid, "behavior1");
        expect(f.getMappedStatement(stmt1.uid).getBehavior()).toBe("behavior1");

        expect(f.getStatementsWithBehavior("behavior1"))
            .toContainEqual({file: f, statement: f.getMappedStatement(stmt1.uid)});
    });

    it ("adds a participant and variable name to the file given a statement", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const stmt1 = indexJson[0];

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        f.setParticipant(stmt1.uid, "participant1", "variable1");
        expect(f.getParticipant(stmt1.uid, "participant1").variableName).toBe("variable1");
    });

    it ("throws error when setting participant for invalid stmtId", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        expect(() => f.setParticipant("asdf", "participant1", "variable1"))
            .toThrow("Statement with ID asdf does not exist in the active version.");
    });

    it ("adds a participant/variable name and removes participant by name", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const stmt1 = indexJson[0];

        const imp = new ImplementationV2();
        const f = imp.addFile(fileKey, "TransactionDB.py", source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        f.setParticipant(stmt1.uid, "participant1", "variable1");
        expect(f.getParticipant(stmt1.uid, "participant1").variableName).toBe("variable1");

        f.removeParticipant(stmt1.uid, "participant1");
        expect(() => f.getParticipant(stmt1.uid, "participant1"))
            .toThrow("Participant with name participant1 not found.");
    });

    it ("adds multiple files and gets all files", async () => {
        const {source, indexJson, fileKey} = await getFiles();

        const imp = new ImplementationV2();
        const f1 = imp.addFile(fileKey, "TransactionDB.py", source);
        const f2 = imp.addFile(fileKey, "TransactionDB.py", source);
        const f3 = imp.addFile(fileKey, "TransactionDB.py", source);

        const savedFiles = imp.getFiles();
        expect(savedFiles.length).toBe(3);
        expect(savedFiles).toEqual(expect.arrayContaining([f1, f2, f3]));
        savedFiles.forEach((file) => {
            const retrievedFile = imp.getFile(file._uid);
            expect(retrievedFile).toBeDefined();
            expect(retrievedFile.getKey()).toEqual(fileKey);
        });
    });
});
