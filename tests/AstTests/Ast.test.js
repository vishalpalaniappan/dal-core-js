import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import File from "../../src/Implementation/File";

const getFiles = async () => {
    const filePath = resolve(__dirname, "../test_data/library_manager_script.dal")
    return await readFile(filePath, "utf-8");
}


describe("file tests", () => {

    it("gets the ast from the behavioral script", async () => {
        const source = await getFiles();

        const f = new File({name: "library_manager_script.dal", key: "library_manager_script.dal"});
        f.addVersion();
        f.setContent(source);
        const ast = f.getAst();
        const filePath2 = resolve(__dirname, "../temp/ast.json")
        await writeFile(filePath2, JSON.stringify(ast, null, 4));
    });

});
