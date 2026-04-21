/* eslint-disable max-len */
import {describe, expect, it} from "vitest";

import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";

describe("tests the behaviors in the library manager", () => {

    it("accepts a book", async () => {
        // Create basket to initialize world
        let behavior = new ExecutableBehavior();
        behavior.addPrimitive("create basket");
        behavior.setPreWorldState({});
        behavior.setPostWorldState({basket: []});
        behavior.setArgs({initialValue: []});
        let [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.basket).toEqual([]);

        // Creates a pending book
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("create pendingBook");
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({pendingBook: {}});
        behavior.setArgs({initialValue: {}});
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.pendingBook).toEqual({});


        // Accepts a book name
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("create tempName");
        behavior.addPrimitive('set pendingBook tempName ["name"]');
        behavior.addPrimitive("remove tempName");
        behavior.setArgs({initialValue: "Harry Potter"});
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({pendingBook: {"name": "Harry Potter"}});
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.pendingBook).toEqual({"name": "Harry Potter"});

        // Accepts a genre
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("create tempGenre");
        behavior.addPrimitive('set pendingBook tempGenre ["genre"]');
        behavior.addPrimitive("remove tempGenre");
        behavior.setArgs({initialValue: "Fantasy"});
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({pendingBook: {"name": "Harry Potter", "genre": "Fantasy"}});
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.pendingBook).toEqual({"name": "Harry Potter", "genre": "Fantasy"});


        // Create book
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("create book");
        behavior.addPrimitive("set book pendingBook []");
        behavior.addPrimitive("remove pendingBook");
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({book: {"name": "Harry Potter", "genre": "Fantasy"}});
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.book).toEqual({"name": "Harry Potter", "genre": "Fantasy"});

        // Add book to basket
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("insert book basket [] 0");
        behavior.addPrimitive("remove book");
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({basket: [{"name": "Harry Potter", "genre": "Fantasy"}]});
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.basket).toEqual([{"name": "Harry Potter", "genre": "Fantasy"}]);

        expect(updatedParticipants).toEqual({
            basket: [{"name": "Harry Potter", "genre": "Fantasy"}],
        });
        console.log("Final participants:", updatedParticipants);
    });
});
