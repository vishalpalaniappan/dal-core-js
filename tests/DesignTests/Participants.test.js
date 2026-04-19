// eslint-disable-next-line no-unused-vars
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../../src/DALEngine.js";
import MissingAttributes from "../../src/Errors/MissingAttributes.js";

describe("participantTests", () => {

    it("add a participant", () => {
        let d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.addNode("AcceptBookFromUser", []);
        const node = d.getNode("AcceptBookFromUser");
        const behavior = node.getBehavior();

        // Create and Add Participant
        const participant = d.createParticipant({
            name: "User",
            description: "Represents a user in the library"
        });
        behavior.addParticipant(participant);
        expect(behavior.getParticipants()[0].getName()).toBe("User");
    });

    it("add and remove participant", () => {
        let d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        d.addNode("AcceptBookFromUser", []);
        const node = d.getNode("AcceptBookFromUser");
        const behavior = node.getBehavior();

        // Create and Add Participant
        const participant = d.createParticipant({
            name: "User",
            description: "Represents a user in the library"
        });
        behavior.addParticipant(participant);
        expect(behavior.getParticipants()[0].getName()).toBe("User");

        // Remove participant
        behavior.removeParticipant(participant);
        expect(behavior.getParticipants().length).toBe(0);

        // Create and Add 2 Participant
        const participant1 = d.createParticipant({
            name: "User",
            description: "Represents a user in the library"
        });
        const participant2 = d.createParticipant({
            name: "User2",
            description: "Represents another user in the library"
        });
        behavior.addParticipant(participant1);
        behavior.addParticipant(participant2);
        expect(behavior.getParticipants()[0].getName()).toBe("User");
        expect(behavior.getParticipants()[1].getName()).toBe("User2");
        expect(behavior.getParticipants().length).toBe(2);

        // Remove participant using name
        behavior.removeParticipant("User");
        expect(behavior.getParticipants()[0].getName()).toBe("User2");
        expect(behavior.getParticipants().length).toBe(1);

        // Remove participant using instance
        behavior.removeParticipant(participant2);
        expect(behavior.getParticipants().length).toBe(0);
    });
})
