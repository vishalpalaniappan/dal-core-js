// eslint-disable-next-line no-unused-vars
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../../src/DALEngine.js";
import GraphWithNameExistsError from "../../src/Errors/GraphWithNameExistsError.js";

describe("multiple graphs test", () => {

    it("create multiple graphs and switch", async () => {
        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.createGraph("graph 1");
        const n1 = d.addNode("graph1behavior", "Graph 1 behavior", []);

        d.createGraph("graph 2");
        const n2 = d.addNode("graph2behavior", "Graph 2 behavior", []);

        expect(d.graphs.getAllBehaviors()).toEqual(
            [n1.getBehavior(), n2.getBehavior()]
        );

        d.selectGraph("graph 1");
        expect(d.getNode("graph1behavior")).toBeTruthy();
        expect(() => d.getNode("graph2behavior")).toThrow();
        await writeFile(resolve(__dirname, "../temp/graph1.json"), d.serialize())

        d.selectGraph("graph 2");
        expect(d.getNode("graph2behavior")).toBeTruthy();
        expect(() => d.getNode("graph1behavior")).toThrow();
        await writeFile(resolve(__dirname, "../temp/graph2.json"), d.serialize())
    });


    it("get list of graphs", async () => {
        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.createGraph("graph 1");
        d.addNode("graph1behavior", "Graph 1 behavior", []);

        d.createGraph("graph 2");
        d.addNode("graph2behavior", "Graph 2 behavior", []);

        expect(d.getSelectableGraphs()).toEqual(["default graph", "graph 1", "graph 2"]);

        d.selectGraph("graph 1");
        expect(d.getNode("graph1behavior")).toBeTruthy();
        expect(() => d.getNode("graph2behavior")).toThrow();
    });

    it("create graph with existing name", async () => {
        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.createGraph("graph 1");
        expect(() => d.createGraph("graph 1")).toThrow(GraphWithNameExistsError);
    });

    it("test that graph is removed", async () => {
        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.createGraph("graph 1");
        d.addNode("graph1behavior", "Graph 1 behavior", []);
        d.createGraph("graph 2");
        d.addNode("graph2behavior", "Graph 2 behavior", []);
        expect(d.getSelectableGraphs()).toEqual(["default graph", "graph 1", "graph 2"]);
        d.removeGraph("graph 1");

        // After removing a graph, the first graph in the list is active.
        // If there are no graphs, a default graph is created and set as active.
        expect(d.getSelectableGraphs()).toEqual(["default graph", "graph 2"]);
        expect(d.graph.name).toBe("default graph");
    });

    it("serialize and deserialize", async () => {
        const d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.createGraph("graph 1");
        d.addNode("graph1behavior", "Graph 1 behavior", []);

        d.createGraph("graph 2");
        d.addNode("graph2behavior", "Graph 2 behavior", []);

        await writeFile(resolve(__dirname, "../temp/graphs.json"), d.serialize());

        d.deserialize(await readFile(resolve(__dirname, "../temp/graphs.json")));
        expect(d.getSelectableGraphs()).toEqual(["default graph", "graph 1", "graph 2"]);
    });
});
