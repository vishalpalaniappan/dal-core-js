import {describe, expect, it} from "vitest";

import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";

describe("standalone behaviors semantic execution tests", () => {

    it("tests set primitive without keys", async () => {
        // Set the value of bookCopy to be book
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("set bookCopy book []");

        behavior.setPreWorldState({
            book: {"name": "Harry Potter"},
            bookCopy: null,
        });

        behavior.setPostWorldState({
            book: {"name": "Harry Potter"},
            bookCopy: {"name": "Harry Potter"}
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.bookCopy.name).toBe("Harry Potter");
    });

    it("tests insert primitive into lists", async () => {
        // Insert book into basket at index 0
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("insert book basket [] 0");

        behavior.setPreWorldState({
            book: {"name": "Harry Potter"},
            basket: [],
        });

        behavior.setPostWorldState({
            book: {"name": "Harry Potter"},
            basket: [{"name": "Harry Potter"}],
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.basket[0].name).toBe("Harry Potter");
    });

    it("tests insert primitive into lists with multiple keys", async () => {
        // Insert book into basket key "contents" at index 0
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive('insert book basket ["contents", "nested_content"] 0');

        behavior.setPreWorldState({
            book: {"name": "Harry Potter"},
            basket: {"contents": {"nested_content": []}},
        });

        behavior.setPostWorldState({
            book: {"name": "Harry Potter"},
            basket: {"contents": {"nested_content": [{"name": "Harry Potter"}]}},
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.basket.contents.nested_content[0].name).toBe("Harry Potter");
    });

    it("tests set primitive with multiple keys", async () => {
        //  Set the value of book key "name" and "name_tested"
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive('set book name ["name", "name_nested"]');

        behavior.setPreWorldState({
            book: {"name": {"name_nested": null}},
            name: "Lord of the Rings",
        });

        behavior.setPostWorldState({
            book: {"name": {"name_nested": "Lord of the Rings"}},
            name: "Lord of the Rings",
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.book.name.name_nested).toBe("Lord of the Rings");

    });


    it ("tests get primitive with multiple keys", async () => {
        // Get the value of book keys "name" and "name_tested"
        // and store it in book_name
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive('get book ["name", "name_tested"] book_name');

        behavior.setPreWorldState({
            book: {"name": {"name_tested": "Lord of the Rings"}},
            book_name: null,
        });

        behavior.setPostWorldState({
            book: {"name": {"name_tested": "Lord of the Rings"}},
            book_name: "Lord of the Rings",
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(updatedParticipants.book_name).toBe("Lord of the Rings");
    });

    it("tests get primitive with empty keys", async () => {
        // Get the value of book and store it in book_copy
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive('get book [] book_copy');

        behavior.setPreWorldState({
            book: {"name": "Lord of the Rings"},
            book_copy: null,
        });

        behavior.setPostWorldState({
            book: {"name": "Lord of the Rings"},
            book_copy: {"name": "Lord of the Rings"},
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(updatedParticipants.book_copy.name).toBe("Lord of the Rings");
    });

    it ("tests create primitive", async () => {
        // Create a new book
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive('create book');

        behavior.setPreWorldState({});

        behavior.setPostWorldState({
            book: {"name": "Lord of the Rings"},
        });

        // Initial value of the book being created.
        behavior.setArgs({
            initialValue: {"name": "Lord of the Rings"},
        })

        const [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.book.name).toBe("Lord of the Rings");
    });
});
