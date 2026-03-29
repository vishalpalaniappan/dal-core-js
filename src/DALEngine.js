import Graphs from "./BehavioralControlGraph/Graphs";
import MissingAttributes from "./Errors/MissingAttributes";
import Behavior from "./Members/Behavior";
import Invariant from "./Members/Invariant";
import Participant from "./Members/Participant";

/**
 * This engine can be used to define and execute designs defined
 * in a Design Abstraction Language (DAL).
 *
 * This class is the main interface for users to interact with
 * the engine. It exposes functions to configure the engine and to
 * execute the design. It also exposes functions to serialize
 * and deserialize the engine to and from JSON text.
 *
 * A design can consist of multiple atomic behavioral control graphs and
 * this class allows users to create, select, and delete graphs. It also
 * allows users to add nodes to the graph and to transition between
 * behaviors in the graph. It also allows users to create participants,
 * behaviors, and invariants and assign them to nodes in the graph.
 *
 * The selected graph is determined by the atomic behavior that is observed.
 * The design is executed by transitioning between behaviors in the graph. The
 * values of the participants are set from the observed values and the
 * invariants are checked at each transition to recognize if the design has
 * entered a semantically invalid state.
 */
export class DALEngine {
    constructor (args) {
        this.graphs = new Graphs();
        this.graph = this.graphs.getActiveGraph();
        this._loadArgs(args);
    }

    /**
     * Sets the provided arguments to the engine.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args Arguments to load.
     */
    _loadArgs (args) {
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
     * Serializes the behavioral control graphs and returns the JSON text.
     * @returns {String} Returns JSON text representing the
     * behavioral control graphs.
     */
    serialize () {
        return JSON.stringify(this.graphs);
    }

    /**
     * Loads the behavioral control graphs from JSON text and sets
     * the active graph to the first graph in the collection of graphs.
     * @param {String} jsonText JSON text representing the control graphs.
     */
    deserialize (jsonText) {
        this.graphs = new Graphs();
        this.graphs.loadFromJson(jsonText);
        this.graph = this.graphs.getActiveGraph();
    }

    /**
     * Creates a graph with the given name and sets it as the active graph.
     * @param {String} name Name of the graph to create.
     */
    createGraph (name) {
        this.graph = this.graphs.addGraph(name);
    }

    /**
     * Sets the active graph.
     * @param {String} graphId ID of the graph to set as active.
     */
    selectGraph (graphId) {
        this.graph = this.graphs.setActiveGraph(graphId);
    }

    /**
     * Deletes the graph with the given graphId
     * @param {String} graphId Id of graph to delete.
     */
    deleteGraph (graphId) {
        this.graphs.deleteGraph(graphId);
        this.graph = this.graphs.getActiveGraph();
    }

    /**
     * Returns the name of all the graphs in the design.
     * @returns {Array} Returns an array of graph names.
     */
    getSelectableGraphs () {
        return this.graphs.getGraphNames();
    }

    /**
     * Creates a participant with the provided args and returns it.
     * @param {Object} args Arguments to create the participant with.
     * @returns {Participant} Returns the created participant.
     */
    createParticipant (args) {
        return new Participant(args);
    }

    /**
     * Creates a behavior with the provided args and returns it.
     * @param {Object} args Arguments to create the behavior with.
     * @returns {Behavior} Returns the created behavior.
     */
    createBehavior (args) {
        return new Behavior(args);
    }

    /**
     * Creates an invariant with the provided args and returns it.
     * @param {Object} args Arguments to create the invariant with.
     * @returns {Invariant} Returns the created invariant.
     */
    createInvariant (args) {
        return new Invariant(args);
    }

    /**
     * Returns the node in the graph with the given behavior name.
     * @param {String} behaviorId ID of the behavior.
     * @returns {GraphNode} Returns the node in the graph with the
     * given behavior name.
     */
    getNode (behaviorId) {
        return this.graph.findNode(behaviorId);
    }

    /**
     * Adds a node to the graph with the given behaviorId and goToBehaviors.
     * @param {String} behaviorId ID of the behavior for the node.
     * @param {Array} goToBehaviorIds IDs of the behaviors that this node
     * transitions to.
     * @param {Boolean} isAtomic Flag to indicate if this node contains an
     * atomic behavior.
     * @param {Boolean} isDesignFork Flag to indicate if this node
     * is a fork in the design.
     * @returns {GraphNode} Returns the created graph node.
     */
    addNode (behaviorId, goToBehaviorIds, isAtomic, isDesignFork) {
        return this.graph.addNode(
            behaviorId,
            goToBehaviorIds,
            isAtomic,
            isDesignFork
        );
    }

    /**
     * Deletes a node from the graph with the given behaviorId and
     * removes it from the goToBehavior list of all other nodes.
     * @param {String} behaviorId
     */
    removeNode (behaviorId) {
        const node = this.graph.findNode(behaviorId);
        const nodeIndex = this.graph.nodes.indexOf(node);
        this.graph.nodes.splice(nodeIndex, 1);
        for (const node of this.graph.nodes) {
            node.removeGoToBehavior(behaviorId);
        }
    }

    /**
     * Sets the current behavior in the graph.
     * @param {String} behaviorId
     */
    setCurrentBehavior (behaviorId) {
        this.graph.setCurrentBehavior(behaviorId);
    }

    /**
     * Transitions the graph to the given behavior if it
     *  is a valid transition from the current behavior.
     * @param {String} nextBehaviorId ID of the next behavior.
     */
    goToBehavior (nextBehaviorId) {
        this.graph.goToBehavior(nextBehaviorId);
    }
}
