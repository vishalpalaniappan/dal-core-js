import { describe, expect, it } from "vitest";

import { DALEngine } from "../src/DALEngine.js";

describe("Implementation tests", () => {

    it("add file to implementation", async () => {
        const d = new DALEngine({ name: "Library Manager", description: "Manages the library" });
        d.addFile("testFile", "Test File", "This is a test file.");
        const file = d.getFile("testFile");
        expect(file).toBeDefined();
        expect(file.name).toBe("Test File");
        expect(file.content).toBe("This is a test file.");

        d.addFile("testFile2", "Test File 2", "This is another test file.");
        const file2 = d.getFile("testFile2");
        expect(file2).toBeDefined();
        expect(file2.name).toBe("Test File 2");
        expect(file2.content).toBe("This is another test file.");

        d.getFiles().forEach(file => {
            expect(file).toBeDefined();
            expect(file.name).toBeDefined();
            expect(file.content).toBeDefined();
        });

        expect(d.getFiles().length).toBe(2);
    });

    it("throws errors when adding file with empty key or name", () => {
        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        expect(() => d.addFile("", "Test File", "This is a test file.")).toThrow(Error);
        expect(() => d.addFile("testFile", "", "This is a test file.")).toThrow(Error);
    });

    it("adds and removes source files", () => {
        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.addFile("A", "Test File", "This is a test file.");
        expect(d.getFiles().length).toBe(1);
        d.removeFile("A");
        expect(() => d.getFile("A")).toThrow(Error);
        expect(d.getFiles().length).toBe(0);
    });
});