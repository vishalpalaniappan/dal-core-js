/* eslint-disable max-len */
import {describe, expect, it} from "vitest";

import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";
import behaviors from "./library_manager_behaviors.js";

const BEHAVIORS = [
    "InitializeWorld",
    "CreatePendingBook",
    "AcceptBookName",
    "AcceptBookGenre",
    "CreateBook",
    "AddBookToBasket",
    "GetBookFromBasket",
    "GetFirstLetterOfBookName",
    "CheckIfHaveKeyForFirstLetter",
]

const TRANSITIONS = {
    "InitializeWorld": ["CreatePendingBook"],
    "CreatePendingBook": ["AcceptBookName"],
    "AcceptBookName": ["AcceptBookGenre"],
    "AcceptBookGenre": ["CreateBook"],
    "CreateBook": ["AddBookToBasket"],
    "AddBookToBasket": [],
    "GetBookFromBasket": ["GetFirstLetterOfBookName"],
    "GetFirstLetterOfBookName": ["CheckIfHaveKeyForFirstLetter"],
    ["CheckIfHaveKeyForFirstLetter"]: ["CreateSlotOnShelf", "PlaceBookOnShelf"],
    ["CreateSlotOnShelf"]: ["PlaceBookOnShelf"],
    ["PlaceBookOnShelf"]: [],
}

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

        // Expected final state of participants
        expect(updatedParticipants).toEqual({basket: [{"name": "Harry Potter", "genre": "Fantasy"}]});
        console.log("Final participants:", updatedParticipants);
    });

    it("places a book on the shelf", async () => {
        // Initialize the world
        const initialWorldState = {
            book_shelf: {},
            basket: [
                {name: "The Great Gatsby", genre: "Classic"},
            ],
        }

        // Get book from basket (remove from basket after getting it)
        let behavior = new ExecutableBehavior();
        behavior.addPrimitive("create book");
        behavior.addPrimitive("getFromPos basket 0 book");
        behavior.addPrimitive("removeFromPos basket 0");
        behavior.setPreWorldState(initialWorldState);
        behavior.setPostWorldState({
            basket: [],
            book: {name: "The Great Gatsby", genre: "Classic"},
        });
        behavior.setArgs({
            initialValue: [],
        });
        let [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.basket).toEqual([]);

        // Get first letter of books name
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("create first_letter");
        behavior.addPrimitive("create name");
        behavior.addPrimitive('get book ["name"] name');
        behavior.addPrimitive("getFromPos name 0 first_letter");
        behavior.addPrimitive("remove name");
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({
            book_shelf: {},
            basket: [],
            book: {name: "The Great Gatsby", genre: "Classic"},
            first_letter: "T",
        });
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.first_letter).toBe("T");

        // Generate Flag for if we have the key for the first letter of the book
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("create has_key_for_letter");
        behavior.addPrimitive("hasKey book first_letter has_key_for_letter []");
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({
            book_shelf: {},
            basket: [],
            book: {name: "The Great Gatsby", genre: "Classic"},
            first_letter: "T",
            has_key_for_letter: false,
        });
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
    });


    it("walks the behavioral tansition graph using the behaviors", async () => {
        let currentBehavior = "InitializeWorld";

        let [updatedParticipants, isValid] = behaviors[currentBehavior]({});
        expect(isValid).toBe(true);

        currentBehavior = "CreatePendingBook";
        [updatedParticipants, isValid] = behaviors[currentBehavior](updatedParticipants);

        console.log(updatedParticipants);
    });
});
