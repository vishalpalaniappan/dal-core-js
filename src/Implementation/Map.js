export default class Map {
    constructor () {
        this._behaviorId = null;
        this._participants = [];
    }

    setBehavior (behaviorId) {
        this._behaviorId = behaviorId;
    }

    getBehavior () {
        return this._behaviorId;
    }

    setParticipant (participantName, variableName) {
        this._participants.push({ participantName, variableName });
    }

    getParticipantByName (participantName) {
        return this._participants.find(
            participant => participant.participantName === participantName
        );
    }

    getParticipantByVariable (variableName) {
        return this._participants.find(
            participant => participant.variableName === variableName
        );
    }

    getParticipants () {
        return this._participants;
    }

};
