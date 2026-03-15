import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";

describe("SimpleDesignTest", () => {

    it("create simple design", async () => {
        const d = new DALEngine({name: "Library Manager"});
        const behavior1 = d.createBehavior({name: "AcceptBookFromUser"});
        const behavior2 = d.createBehavior({name: "AddBookToBasket"});
        const behavior3 = d.createBehavior({name: "AnotherBehavior"});
        const behavior4 = d.createBehavior({name: "AnotherBehavior4"});
        const behavior5 = d.createBehavior({name: "AnotherBehavior5"});
        d.graph.addNode(behavior1, [behavior2, behavior3]);
        d.graph.addNode(behavior2, [behavior4]);
        d.graph.addNode(behavior3, [behavior5]);
        d.graph.addNode(behavior5, [behavior1]);

        // Output can be viewed using https://mermaid.live/
        const filePath2 = resolve(__dirname, "./temp/simple_design_mermaid.txt")
        await writeFile(filePath2, d.graph.exportAsMermaid())
    });
});
