import {describe, expect, it} from "vitest";

import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";

describe("standalone behaviors semantic execution tests", () => {

    it("creates a behavior with multiple primitives and executes transformation", async () => {
        /**
         * This is a separate test just for testing the behavior class
         * in isolation. I am using this because I don't want to run
         * all the other tests at the same time while developing.
         */

        // Transformation #1
        // Set the value of bookCopy to be book
        let behavior = new ExecutableBehavior();
        behavior.addPrimitive("set bookCopy book []");

        behavior.setPreWorldState({
            book: {"name": "Harry Potter"},
            bookCopy: null,
        });

        behavior.setPostWorldState({
            book: {"name": "Harry Potter"},
            bookCopy: {"name": "Harry Potter"}
        });

        let [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.bookCopy.name).toBe("Harry Potter");

        // Transformation #2
        // Insert book into basket at index 0
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("insert book basket [] 0");

        behavior.setPreWorldState({
            book: {"name": "Harry Potter"},
            basket: [],
        });

        behavior.setPostWorldState({
            book: {"name": "Harry Potter"},
            basket: [{"name": "Harry Potter"}],
        });

        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.basket[0].name).toBe("Harry Potter");

        // Transformation #3
        // Insert book into basket key "contents" at index 0
        behavior = new ExecutableBehavior();
        behavior.addPrimitive('insert book basket ["contents", "nested_content"] 0');

        behavior.setPreWorldState({
            book: {"name": "Harry Potter"},
            basket: {"contents": {"nested_content": []}},
        });

        behavior.setPostWorldState({
            book: {"name": "Harry Potter"},
            basket: {"contents": {"nested_content": [{"name": "Harry Potter"}]}},
        });

        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.basket.contents.nested_content[0].name).toBe("Harry Potter");

        // Transformation #4
        //  Set the value of book key "name" to be name participant
        behavior = new ExecutableBehavior();
        behavior.addPrimitive('set book name ["name"]');

        behavior.setPreWorldState({
            book: {"name": ""},
            name: "Lord of the Rings",
        });

        behavior.setPostWorldState({
            book: {"name": "Lord of the Rings"},
            name: "Lord of the Rings",
        });

        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.book.name).toBe("Lord of the Rings");


        // Transformation #5
        // Get the value of book keys "name" and "name_tested"
        // and store it in book_name
        behavior = new ExecutableBehavior();
        behavior.addPrimitive('get book ["name", "name_tested"] book_name');

        behavior.setPreWorldState({
            book: {"name": {"name_tested": "Lord of the Rings"}},
            book_name: null,
        });

        behavior.setPostWorldState({
            book: {"name": {"name_tested": "Lord of the Rings"}},
            book_name: "Lord of the Rings",
        });

        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(updatedParticipants.book_name).toBe("Lord of the Rings");


        // Transformation #6
        // Get the value of book and store it in book_copy
        behavior = new ExecutableBehavior();
        behavior.addPrimitive('get book [] book_copy');

        behavior.setPreWorldState({
            book: {"name": "Lord of the Rings"},
            book_copy: null,
        });

        behavior.setPostWorldState({
            book: {"name": "Lord of the Rings"},
            book_copy: {"name": "Lord of the Rings"},
        });

        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(updatedParticipants.book_copy.name).toBe("Lord of the Rings");

    });
});
