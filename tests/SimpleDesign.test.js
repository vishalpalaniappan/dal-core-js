import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";

describe("SimpleDesignTest", () => {

    it("create simple design", async () => {
        const d = new DALEngine({name: "Library Manager"});
        let behavior = d.createBehavior({name: "AcceptChoiceToAddBookToBasket"});
        const AcceptBookFromUser = d.createBehavior({name: "AcceptBookFromUser"});
        d.graph.addNode(behavior, [AcceptBookFromUser]);
        const AddBookToBasket = d.createBehavior({name: "AddBookToBasket"});
        d.graph.addNode(AcceptBookFromUser, [AddBookToBasket]);

        const AcceptChoiceToAuditLibrary = d.createBehavior({name: "AcceptChoiceToAuditLibrary"});
        const GenerateAuditReport = d.createBehavior({name: "GenerateAuditReport"});
        d.graph.addNode(AcceptChoiceToAuditLibrary, [GenerateAuditReport]);
        const HandAuditToUser = d.createBehavior({name: "HandAuditToUser"});
        d.graph.addNode(GenerateAuditReport, [HandAuditToUser]);

        const AcceptChoiceToPlaceBooksOnShelf = d.createBehavior(
            {name: "AcceptChoiceToPlaceBooksOnShelf"}
        );
        const GetBookFromBasket = d.createBehavior({name: "GetBookFromBasket"});
        d.graph.addNode(AcceptChoiceToPlaceBooksOnShelf, [GetBookFromBasket]);
        const GetFirstLetterOfBookName = d.createBehavior({name: "GetFirstLetterOfBookName"});
        d.graph.addNode(GetBookFromBasket, [GetFirstLetterOfBookName]);
        const CreateSlotOnBookShelf = d.createBehavior({name: "CreateSlotOnBookShelf"});
        const AddBookToShelf = d.createBehavior({name: "AddBookToShelf"});
        d.graph.addNode(GetFirstLetterOfBookName, [CreateSlotOnBookShelf]);
        d.graph.addNode(GetFirstLetterOfBookName, [AddBookToShelf]);
        d.graph.addNode(CreateSlotOnBookShelf, [AddBookToShelf]);
        d.graph.addNode(AddBookToShelf, [GetBookFromBasket]);

        const filePath = resolve(__dirname, "./simple_design_temp.json")
        await writeFile(filePath, d.serialize())

        // Output can be viewed using https://mermaid.live/
        const filePath2 = resolve(__dirname, "./temp/simple_design_mermaid.txt")
        await writeFile(filePath2, d.graph.exportAsMermaid())
    });
});
