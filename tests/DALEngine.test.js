// eslint-disable-next-line no-unused-vars
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";
import BehaviorAlreadyExistsError from "../src/Errors/BehaviorAlreadyExistsError.js";
import InvalidTransitionError from "../src/Errors/InvalidTransitionError.js";
import MissingAttributes from "../src/Errors/MissingAttributes.js";
import TransitionAlreadyExistsError from "../src/Errors/TransitionAlreadyExistsError.js";
import UnknownBehaviorError from "../src/Errors/UnknownBehaviorError.js";
import ENGINE_TYPES from "../src/TYPES.js";

describe("DALEngine", () => {
    it("sets the name correctly", () => {
        const dalInstance = new DALEngine({name: "Library Manager"});
        expect(dalInstance.name).toBe("Library Manager");
    });

    it(" throws on missing attributes", () => {
        expect(() => {new DALEngine()}).toThrow(MissingAttributes);
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
        const goToBehaviorIds = ["AddBookToBasket"];
        const node = d.addNode("AcceptBookFromUser", goToBehaviorIds);

        const nodeType = node.type;
        expect(nodeType).toBe(ENGINE_TYPES.GRAPH_NODE);
        expect(node.getBehavior().name).toStrictEqual("AcceptBookFromUser");
        expect(node.getGoToBehaviors()).toStrictEqual(goToBehaviorIds);
    });

    it("throws when a behavior with same name is added to graph", () => {
        const d = new DALEngine({name: "Library Manager"});
        d.addNode("AcceptBookFromUser", []);
        expect(() => {d.addNode("AcceptBookFromUser", [])}).toThrow(BehaviorAlreadyExistsError);
    });

    it("find node that was added using behavior name", () => {
        const d = new DALEngine({name: "Library Manager"});
        const node = d.addNode("AcceptBookFromUser", []);

        expect(() => {d.getNode("AcceptBookFrmUser")}).toThrow(UnknownBehaviorError);

        const foundNode = d.getNode("AcceptBookFromUser");
        expect(foundNode).toStrictEqual(node);
    });

    it("adds node to graph and removes it", () => {
        const d = new DALEngine({name: "Library Manager"});
        d.addNode("AcceptBookFromUser", []);
        d.addNode("AddBookToBasket", []);

        d.getNode("AcceptBookFromUser").addGoToBehavior("AddBookToBasket");

        const node = d.getNode("AcceptBookFromUser");

        const nodeType = node.type;
        expect(nodeType).toBe(ENGINE_TYPES.GRAPH_NODE);
        expect(node.getBehavior().name).toStrictEqual("AcceptBookFromUser");
        expect(node.getGoToBehaviors()).toStrictEqual(["AddBookToBasket"]);
    });

    it("find node and check if observed behavior is valid transition", () => {
        const d = new DALEngine({name: "Library Manager"});
        const node1 = d.addNode("AcceptBookFromUser", []);
        const node2 = d.addNode("AddBookToBasket", []);
        d.addNode("AnotherBehavior", []);

        node1.addGoToBehavior("AddBookToBasket");
        node2.addGoToBehavior("AnotherBehavior");

        // Misspell behavior name to trigger unknown behavior error
        expect(() => {
            d.setCurrentBehavior("AcceptBookromUser");
        }).toThrow(UnknownBehaviorError);

        d.setCurrentBehavior("AcceptBookFromUser");
        expect(d.graph.currentNode).toBe(node1);

        d.goToBehavior("AddBookToBasket")
        expect(d.graph.currentNode).toBe(node2);

        // Reset current behavior so transition is valid
        d.setCurrentBehavior("AcceptBookFromUser");
        d.goToBehavior("AddBookToBasket")
        expect(d.graph.currentNode).toBe(node2);

        // Raises error because current behavior is "AnotherBehavior"
        // and it does not transition to itself.
        expect(() => {
            d.goToBehavior("AddBookToBasket")
        }).toThrow(InvalidTransitionError);

        // Reset the current behavior and then go to a behavior
        // which is misspelled and expect an invalid transition error
        expect(() => {
            d.setCurrentBehavior("AcceptBookFromUser");
            d.goToBehavior("AddBookToasket")
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

    it ("add duplicate transition and check error is raised", () => {
        const d = new DALEngine({name: "Library Manager"});
        const node1 = d.addNode("AcceptBookFromUser", []);
        const node2 = d.addNode("AddBookToBasket", []);
        node1.addGoToBehavior("AddBookToBasket");
        expect(() => {
            node1.addGoToBehavior("AddBookToBasket");
        }).toThrow(TransitionAlreadyExistsError);
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


        d.addNode("AcceptBookFromUser", []);
        d.addNode("AddBookToBasket", []);
        d.addNode("AnotherBehavior", []);

        d.getNode("AcceptBookFromUser").addGoToBehavior("AddBookToBasket");
        d.getNode("AcceptBookFromUser").addGoToBehavior("AnotherBehavior");

        d.getNode("AcceptBookFromUser").getBehavior().addParticipant(book);

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
