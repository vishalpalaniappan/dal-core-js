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
        const participantName = "User";
        const behavior = node.getBehavior();
        behavior.addParticipant(participantName);
        expect(behavior.participants[0].name).toBe(participantName);
        behavior.removeParticipant(participantName);
        expect(behavior.participants.length).toBe(0);
    });
})
