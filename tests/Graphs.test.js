import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";

describe("multiple graphs test", () => {

    it("create multiple graphs and switch between them", async () => {
        const d = new DALEngine({name: "Library Manager"});
        d.createGraph("graph 1");
        d.addNode("graph1behavior", []);

        d.createGraph("graph 2");
        d.addNode("graph2behavior", []);

        d.selectGraph("graph 1");
        expect(d.getNode("graph1behavior")).toBeTruthy();
        expect(() => d.getNode("graph2behavior")).toThrow();
        await writeFile(resolve(__dirname, "./temp/graph1.json"), d.serialize())

        d.selectGraph("graph 2");
        expect(d.getNode("graph2behavior")).toBeTruthy();
        expect(() => d.getNode("graph1behavior")).toThrow();
        await writeFile(resolve(__dirname, "./temp/graph2.json"), d.serialize())
    });
});
