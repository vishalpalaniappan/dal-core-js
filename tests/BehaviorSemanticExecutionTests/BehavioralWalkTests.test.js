
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

describe("behaviors semantic execution tests", () => {

    it("walks the behavioral tansition graph using the behaviors", async () => {
        let currentBehavior = "InitializeWorld";
        let worldState = {};
        let args = {
            name: "The Great Gatsby",
            genre: "Classic",
        }

        do {
            console.log(currentBehavior);

            const [updatedParticipants, isValid] = behaviors[currentBehavior](worldState, args);
            expect(isValid).toBe(true);

            worldState = updatedParticipants;

            const _transitions = TRANSITIONS[currentBehavior];
            if (_transitions.length > 0) {
                // TODO: go through transitions and check world state to
                // determine which transition the state selects
                currentBehavior = TRANSITIONS[currentBehavior][0];
            } else {
                break;
            }
        } while (TRANSITIONS[currentBehavior].length > 0);

        console.log(worldState);
    });

});