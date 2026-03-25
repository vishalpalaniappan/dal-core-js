import BehavioralControlGraph from "./BehavioralControlGraph/BehavioralControlGraph";
import Behavior from "./Members/Behavior";
import Invariant from "./Members/Invariant";
import Participant from "./Members/Participant";

/**
 * An object representing an engine written in Design
 * abstraction language. It exposes functions
 * configure the engine through the DAL specification.
 *
 * The design specified in this engine is mapped onto
 * the implementation using abstraction ids. The
 * implementation is then instrumented and the resulting
 * execution trace is fed back into the engine and is
 * automatically debugged by transforming the execution
 * into the behavior of the design and enforcing the
 * invariants.
 */
export class DALEngine {
    constructor (args) {
        this.graph = new BehavioralControlGraph();
        for (const [key, value] of Object.entries(args)) {
            this[key] = value;
        }
    }

    /**
     * Exports the behavioral control graph to JSON text.
     * @returns {String}
     */
    serialize () {
        return JSON.stringify(this.graph);
    }

    /**
     * Import the behavioral control graph from JSON text.
     * @param {String} jsonText
     */
    deserialize (jsonText) {
        this.graph = new BehavioralControlGraph();
        this.graph.loadGraphFromJSON(JSON.parse(jsonText));
    }

    /**
     * Creates a participant.
     * @param {Object} args
     * @returns {Participant}
     */
    createParticipant (args) {
        return new Participant(args);
    }

    /**
     * Creates a behavior.
     * @param {Object} args
     * @returns {Behavior}
     */
    createBehavior (args) {
        return new Behavior(args);
    }

    /**
     * Creates an invariant.
     * @param {Object} args
     * @returns {Invariant}
     */
    createInvariant (args) {
        return new Invariant(args);
    }
}
