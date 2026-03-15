import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";
import InvalidTransitionError from "../src/Errors/InvalidTransitionError.js";
import MissingAttributes from "../src/Errors/MissingAttributes.js";
import UnknownBehaviorError from "../src/Errors/UnknownBehaviorError.js";
import ENGINE_TYPES from "../src/TYPES.js";

describe("DALEngine", () => {
    it("sets the name correctly", () => {
        const dalInstance = new DALEngine({name: "Library Manager"});
        expect(dalInstance.name).toBe("Library Manager");
    });

    it("throws on missing attributes", () => {
        const d = new DALEngine({name: "Library Manager"});
        expect(() => {d.createBehavior()}).toThrow(MissingAttributes);
        expect(() => {d.createBehavior({})}).toThrow(MissingAttributes);
        expect(() => {d.createBehavior({"rule": "adsf"})}).toThrow(MissingAttributes);
        expect(() => {d.createInvariant({"name": "asdf"})}).toThrow(MissingAttributes);
        expect(() => {d.createParticipant()}).toThrow(MissingAttributes);
        expect(() => {d.createParticipant({})}).toThrow(MissingAttributes);
    });

    it("adds node to graph", () => {
        const d = new DALEngine({name: "Library Manager"});
        const behavior1 = d.createBehavior({name: "AcceptBookFromUser"});
        const behavior2 = d.createBehavior({name: "AddBookToBasket"});
        const goToBehaviors = [behavior2];

        const node = d.graph.addNode(behavior1, goToBehaviors)

        const nodeType = node.type;
        expect(nodeType).toBe(ENGINE_TYPES.GRAPH_NODE);
        expect(node.behavior).toStrictEqual(behavior1);
        expect(node.goToBehaviors).toStrictEqual([behavior2]);

        const foundNode = d.graph.findNode("AcceptBookFromUser");
        expect(foundNode).toStrictEqual(node);
    });

    it("find node that was added using behavior name", () => {
        const d = new DALEngine({name: "Library Manager"});
        const behavior1 = d.createBehavior({name: "AcceptBookFromUser"});
        const behavior2 = d.createBehavior({name: "AddBookToBasket"});
        const node = d.graph.addNode(behavior1, [behavior2])

        const foundNode = d.graph.findNode("AcceptBookFromUser");
        expect(foundNode).toStrictEqual(node);
    });

    it("find node and check if observed behavior is valid transition", () => {
        const d = new DALEngine({name: "Library Manager"});
        const behavior1 = d.createBehavior({name: "AcceptBookFromUser"});
        const behavior2 = d.createBehavior({name: "AddBookToBasket"});
        const behavior3 = d.createBehavior({name: "AnotherBehavior"});
        d.graph.addNode(behavior1, [behavior2, behavior3])
        d.graph.addNode(behavior2, [])
        d.graph.addNode(behavior3, [])

        // Misspell behavior name to trigger unknown behavior error
        expect(() => {
            d.graph.setCurrentBehavior("AcceptBookromUser");
        }).toThrow(UnknownBehaviorError);

        d.graph.setCurrentBehavior("AcceptBookFromUser");
        expect(d.graph.currentNode.behavior).toBe(behavior1);

        d.graph.goToBehavior("AddBookToBasket")
        expect(d.graph.currentNode.behavior).toBe(behavior2);

        // Reset current behavior so transition is valid
        d.graph.setCurrentBehavior("AcceptBookFromUser");
        d.graph.goToBehavior("AnotherBehavior")
        expect(d.graph.currentNode.behavior).toBe(behavior3);

        // Raises error because current behavior is "AnotherBehavior"
        // and it does not transition to itself.
        expect(() => {
            d.graph.goToBehavior("AnotherBehavior")
        }).toThrow(InvalidTransitionError);

        // Reset the current behavior and then go to a behavior
        // which is misspelled and expect an invalid transition error
        expect(() => {
            d.graph.setCurrentBehavior("AcceptBookFromUser");
            d.graph.goToBehavior("AddBookToasket")
        }).toThrow(InvalidTransitionError);
    });

    it("add invariant to participant", () => {
        const d = new DALEngine({name: "Library Manager"});
        const book = d.createParticipant({name: "book"});
        const invariant = d.createInvariant(
            {
                "name": "MinLengthConstraint",
                "rule": {
                    "type": "minLength",
                    "keys": ["value", "name"],
                    "value": 1,
                },
            }
        );

        book.addInvariant(invariant);

        const lastInvariant = book.invariants[book.invariants.length - 1];
        expect(lastInvariant).toBe(invariant);
    });

    it("serialize to file and deseralize from file", async () => {
        let d = new DALEngine({name: "Library Manager"});
        const book = d.createParticipant({name: "book"});
        const invariant = d.createInvariant(
            {
                "name": "MinLengthConstraint",
                "rule": {
                    "type": "minLength",
                    "keys": ["value", "name"],
                    "value": 1,
                },
            }
        );
        book.addInvariant(invariant);

        const behavior1 = d.createBehavior({name: "AcceptBookFromUser"});
        behavior1.addParticpant(book);
        const behavior2 = d.createBehavior({name: "AddBookToBasket"});
        const behavior3 = d.createBehavior({name: "AnotherBehavior"});
        d.graph.addNode(behavior1, [behavior2, behavior3]);
        d.graph.addNode(behavior2, []);
        d.graph.addNode(behavior3, []);

        const filePath = resolve(__dirname, "./temp/inspectSerializeTemp.json")
        await writeFile(filePath, d.serialize())

        d = new DALEngine({name: "Library Manager"});
        d.deserialize(await readFile(filePath, "utf-8"));
        expect(d.graph.nodes.length).toBe(3);

        // Intentionally not cleaning up the file because I want to inspect
        // await unlink(filePath)

        // This is a temporary file I create for my own inspection
        const filePath2 = resolve(__dirname, "./temp/inspectDeseralizeTemp.json")
        await writeFile(filePath2, d.serialize())
    });
});
