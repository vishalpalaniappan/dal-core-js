
import {describe, expect, it} from "vitest";

import { IsStringInvariant } from "../../src/Design/InvariantTypes/IsStringInvariant";

describe("tests the is string invariant", () => {

    it("tests the is string invariant", async () => {
        const inv = new IsStringInvariant();
        inv.properties.keys.value = [];

        inv.evaluate(1234);
        expect(inv.invariantViolated).toBe(true);

        inv.evaluate("asdf");
        expect(inv.invariantViolated).toBe(false);

        inv.evaluate([1, 2, 3]);
        expect(inv.invariantViolated).toBe(true);

    });
});
