// eslint-disable-next-line no-unused-vars
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";
import MissingAttributes from "../src/Errors/MissingAttributes.js";

describe("participantTests", () => {

    it("add a participant", () => {
        let d = new DALEngine({name: "Library Manager"});
        d.addNode("AcceptBookFromUser", []);
        const node = d.getNode("AcceptBookFromUser");
        const behavior = node.getBehavior();
        behavior.addParticipant("User");
        expect(behavior.participants[0].name).toBe("User");
        behavior.removeParticipant("User");
        expect(behavior.participants.length).toBe(0);
    });

    it("removes a participant", () => {
        let d = new DALEngine({name: "Library Manager"});
        d.addNode("AcceptBookFromUser", []);
        const node = d.getNode("AcceptBookFromUser");
        const behavior = node.getBehavior();
        behavior.addParticipant("User");
        behavior.removeParticipant("User");
        expect(behavior.participants.length).toBe(0);
    });
})
