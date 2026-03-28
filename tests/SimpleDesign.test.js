import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";

describe("SimpleDesignTest", () => {

    it("create simple design", async () => {
        const d = new DALEngine({name: "Library Manager"});
        d.addBehavior("AcceptChoiceToAddBookToBasket", ["AcceptBookFromUser"]);
        d.addBehavior("AcceptBookFromUser", ["AddBookToBasket"]);
        d.addBehavior("AddBookToBasket", []);
        d.addBehavior("AcceptChoiceToAuditLibrary", ["GenerateAuditReport"]);
        d.addBehavior("GenerateAuditReport", ["HandAuditToUser"]);
        d.addBehavior("HandAuditToUser", []);

        d.addBehavior("AcceptChoiceToPlaceBooksOnShelf", ["GetBookFromBasket"]);
        d.addBehavior("GetBookFromBasket", ["GetFirstLetterOfBookName"]);
        d.addBehavior("GetFirstLetterOfBookName", ["CreateSlotOnBookShelf", "AddBookToShelf"]);
        d.addBehavior("CreateSlotOnBookShelf", ["AddBookToShelf"]);
        d.addBehavior("AddBookToShelf", ["GetBookFromBasket"]);

        const filePath = resolve(__dirname, "./temp/simple_design_temp.json")
        await writeFile(filePath, d.serialize())

        // Output can be viewed using https://mermaid.live/
        const filePath2 = resolve(__dirname, "./temp/simple_design_mermaid.txt")
        await writeFile(filePath2, d.graph.exportAsMermaid())
    });
});
