import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import Map from "../../src/Implementation/Map";

const getFiles = async () => {
    const filePath = resolve(__dirname, "../test_data/TransactionDB.py")
    const source = await readFile(filePath, "utf-8");
    const mapPath = resolve(__dirname, "../test_data/TransactionDB_mapping.json");
    const index = await readFile(mapPath, "utf-8");
    const indexJson = JSON.parse(index);
    return {source, indexJson, filePath};
}

describe("map tests", () => {

    it("create map, set behavior and participants", async () => {
        const {source, indexJson, filePath} = await getFiles();

        for (const entry of indexJson) {
            const map = new Map(entry);
            map.setBehavior("behavior1");
            map.setParticipant("participant1", "variable1");
            map.setParticipant("participant2", "variable2");
            expect(map.getBehavior()).toEqual("behavior1");
            expect(map.getParticipantByName("participant1"))
                .toEqual({participantName: "participant1", variableName: "variable1"});

        }
    });

    it ("removes participants by name", async () => {
        const map = new Map({
            uid: "map1",
            start_line: 1,
            end_line: 10,
            source: "print('Hello, world!')",
        });
        map.setParticipant("participant1", "variable1");
        map.setParticipant("participant2", "variable2");

        // Remove participant by name and verify
        map.removeParticipantByName("participant1");
        expect(() => map.getParticipantByName("participant1"))
            .toThrow("Participant with name participant1 not found.");

        expect(map.getParticipants())
            .toEqual([{ participantName: "participant2", variableName: "variable2" }]);


        map.removeBehavior();
        expect(map.getBehavior()).toBeNull();
    });
});
