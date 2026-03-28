import BehavioralControlGraph from "./BehavioralControlGraph/BehavioralControlGraph";
import MissingAttributes from "./Errors/MissingAttributes";
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
        this.loadArgs(args);
    }

    /**
     * Loads the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args
     */
    loadArgs (args) {
        const expectedAttributes = ["name"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Engine", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Engine", attr);
            }
            this[attr] = args[attr];
        });
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
        this.graph = new BehavioralControlGraph(JSON.parse(jsonText));
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


    /**
     * Returns the node in the graph with the given behavior name.
     * @param {String} behaviorId
     * @returns {GraphNode}
     */
    getNode (behaviorId) {
        return this.graph._findNode(behaviorId);
    }

    /**
     * Adds a node to the graph with the given behaviorId and goToBehaviors.
     * @param {String} behaviorId
     * @param {Array} goToBehaviorsIds
     * @returns {GraphNode}
     */
    addNode (behaviorId, goToBehaviorsIds) {
        const behavior = this.createBehavior({name: behaviorId});
        const goToIds = goToBehaviorsIds?goToBehaviorsIds:[];
        return this.graph._addNode(behavior, goToIds);
    }

    /**
     * Deletes a node from the graph with the given behaviorId and
     * removes it from the goToBehavior list of all other nodes.
     * @param {String} behaviorId
     */
    removeNode (behaviorId) {
        const node = this.graph._findNode(behaviorId);
        const nodeIndex = this.graph.nodes.indexOf(node);
        this.graph.nodes.splice(nodeIndex, 1);

        for (const node of this.graph.nodes) {
            const goToIndex = node.goToBehaviorsIds.indexOf(behaviorId);
            if (goToIndex > -1) {
                node.goToBehaviorsIds.splice(goToIndex, 1);
            }
        }
    }

    /**
     * Sets the current behavior in the graph.
     * @param {String} behaviorId
     */
    setCurrentBehavior (behaviorId) {
        this.graph._setCurrentBehavior(behaviorId);
    }


    /**
     * Transitions the graph to the given behavior if it
     *  is a valid transition from the current behavior.
     * @param {String} nextBehaviorId ID of the next behavior.
     */
    goToBehavior (nextBehaviorId) {
        this.graph._goToBehavior(nextBehaviorId);
    }
}
