import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";

describe("SimpleDesignTest", () => {

    it("create simple design", async () => {
        const d = new DALEngine({name: "Library Manager"});
        d.addNode("AcceptChoiceToAddBookToBasket", ["AcceptBookFromUser"]);
        d.addNode("AcceptBookFromUser", ["AddBookToBasket"]);
        d.addNode("AddBookToBasket", []);
        d.addNode("AcceptChoiceToAuditLibrary", ["GenerateAuditReport"]);
        d.addNode("GenerateAuditReport", ["HandAuditToUser"]);
        d.addNode("HandAuditToUser", []);

        d.addNode("AcceptChoiceToPlaceBooksOnShelf", ["GetBookFromBasket"]);
        d.addNode("GetBookFromBasket", ["GetFirstLetterOfBookName"]);
        d.addNode("GetFirstLetterOfBookName", ["CreateSlotOnBookShelf", "AddBookToShelf"]);
        d.addNode("CreateSlotOnBookShelf", ["AddBookToShelf"]);
        d.addNode("AddBookToShelf", ["GetBookFromBasket"]);

        const filePath = resolve(__dirname, "./temp/simple_design_temp.json")
        await writeFile(filePath, d.serialize())

        // Output can be viewed using https://mermaid.live/
        const filePath2 = resolve(__dirname, "./temp/simple_design_mermaid.txt")
        await writeFile(filePath2, d.graph.exportAsMermaid())
    });
});
