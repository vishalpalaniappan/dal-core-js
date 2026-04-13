import { readFile, unlink, writeFile } from "fs/promises"
import { resolve } from "path"
import { describe, expect, it } from "vitest";

import { DALEngine } from "../../src/DALEngine.js";

describe("SimpleDesignTest", () => {

    it("create simple design", async () => {
        const d = new DALEngine({ name: "Library Manager", description: "Manages the library" });
        d.addNode(
            "AcceptChoiceToAddBookToBasket",
            "Accepts a choice to add a book to the basket",
            ["AcceptBookFromUser"]
        );
        d.addNode(
            "AcceptBookFromUser",
            "Accepts a book from the user",
            ["AddBookToBasket"]
        );
        d.addNode(
            "AddBookToBasket",
            "Adds a book to the basket",
            []
        );
        d.addNode(
            "AcceptChoiceToAuditLibrary",
            "Accepts a choice to audit the library",
            ["GenerateAuditReport"]
        );
        d.addNode(
            "GenerateAuditReport",
            "Generates an audit report",
            ["HandAuditToUser"]
        );
        d.addNode(
            "HandAuditToUser",
            "Hands the audit report to the user",
            []
        );

        d.addNode(
            "AcceptChoiceToPlaceBooksOnShelf",
            "Accepts a choice to place books on the shelf",
            ["GetBookFromBasket"]
        );
        d.addNode(
            "GetBookFromBasket",
            "Gets a book from the basket",
            ["GetFirstLetterOfBookName"]
        );
        d.addNode(
            "GetFirstLetterOfBookName",
            "Gets the first letter of the book name",
            ["CreateSlotOnBookShelf", "AddBookToShelf"]
        );
        d.addNode(
            "CreateSlotOnBookShelf",
            "Creates a slot on the bookshelf",
            ["AddBookToShelf"]
        );
        d.addNode(
            "AddBookToShelf",
            "Adds a book to the shelf",
            ["GetBookFromBasket"]
        );


        d.removeNode("GetBookFromBasket");

        const filePath = resolve(__dirname, "../temp/simple_design_temp.json")
        await writeFile(filePath, d.serialize())

        // Output can be viewed using https://mermaid.live/
        const filePath2 = resolve(__dirname, "../temp/simple_design_mermaid.txt")
        await writeFile(filePath2, d.graph.exportAsMermaid())
    });
});
