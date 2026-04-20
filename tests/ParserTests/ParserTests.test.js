import {describe, expect, it} from "vitest";
import BehavioralLanguageParser from "../../src/ExecutableModelTest/BehavioralLanguageParser.js";


describe("parser tests", () => {

    it("tests a simple parser script", async () => {
        const parser = new BehavioralLanguageParser();
        parser.parse('set book.location shelf ["key1","key2"]');
    });
});
