
import {describe, expect, it} from "vitest";

import {RequiredKeysInvariant} from "../../src/Design/InvariantTypes/RequiredKeysInvariant.js";


describe("tests the required keys invariant", () => {

    it("tests the required keys invariant", async () => {
        const inv = new RequiredKeysInvariant();
        inv.properties.keys.value = [];
        inv.properties.requiredKeys.value = ["requiredKey1", "requiredKey2"];

        const example = [
            {
                requiredKey1: "value1",
                requiredKey2: "value2",
            },
            {
                requiredKey1: "value3",
                requiredKey2: "value4",
            },
        ]

        inv.evaluate(example);
        expect(inv.invariantViolated).toBe(false);

        const example2 = [
            {
                requiredKey1: "value1",
                requiredKey2: "value2",
            },
            {
                requiredKey1: "value3",
            },
        ]

        inv.evaluate(example2);
        expect(inv.invariantViolated).toBe(true);

    });
});
