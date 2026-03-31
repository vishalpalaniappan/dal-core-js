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

        // Create and Add Participant
        const participant = d.createParticipant({name: "User"});
        behavior.addParticipant(participant);
        expect(behavior.getParticipants()[0].getName()).toBe("User");
    });

    it("add and remove participant", () => {
        let d = new DALEngine({name: "Library Manager"});
        d.addNode("AcceptBookFromUser", []);
        const node = d.getNode("AcceptBookFromUser");
        const behavior = node.getBehavior();

        // Create and Add Participant
        const participant = d.createParticipant({name: "User"});
        behavior.addParticipant(participant);
        expect(behavior.getParticipants()[0].getName()).toBe("User");

        // Remove participant
        behavior.removeParticipant(participant);
        expect(behavior.getParticipants().length).toBe(0);
    });
})
