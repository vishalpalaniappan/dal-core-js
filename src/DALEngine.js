import {gunzipSync, gzipSync, strFromU8, strToU8} from "fflate";

import Behavior from "./Design/Behavior";
import Graphs from "./Design/BehavioralControlGraph/Graphs";
import Invariant from "./Design/Invariant";
import INVARIANT_TYPES from "./Design/InvariantTypes/InvariantTypes";
import Participant from "./Design/Participant";
import MissingAttributes from "./Errors/MissingAttributes";
import Implementation from "./Implementation/Implementation";

/**
 * This engine can be used to define and execute designs defined in a
 * Design Abstraction Language (DAL).
 *
 * This class is the main interface for users to interact with the
 * engine. It exposes functions to configure the engine and to execute
 * the design. It also exposes functions to serialize and deserialize
 * the engine to and from JSON text.
 *
 * A design can consist of multiple atomic behavioral control graphs and
 * this class allows users to create, select, and delete graphs. It also
 * allows users to add nodes to the graph and to transition between
 * behaviors in the graph. It also allows users to create participants,
 * behaviors, and invariants and assign them to nodes in the graph.
 *
 * The selected graph is determined by the atomic behavior that is observed.
 * The design is executed by transitioning between behaviors in the graph.
 * The values of the participants are set from the observed values and the
 * invariants are checked at each transition to recognize if the design has
 * entered a semantically invalid state.
 */
export class DALEngine {
    constructor (args) {
        this.graphs = new Graphs();
        this.graph = this.graphs.getActiveGraph();
        this.invariant_types = INVARIANT_TYPES;
        this.implementation = new Implementation();
        this._loadArgs(args);
    }

    /**
     * Sets the provided arguments to the engine.
     *
     * @throws {MissingAttributes} Thrown when required attributes are
     * not present.
     * @param {Object} args Arguments to load.
     */
    _loadArgs (args) {
        const expectedAttributes = ["name", "description"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("Engine", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("Engine", attr);
            }
            this["_" + attr] = args[attr];
        });
    }

    /**
     * Serializes the behavioral control graphs and returns the JSON text.
     *
     * @returns {String} Returns JSON string representing the control graphs.
     */
    serialize () {
        const serialized = JSON.stringify({
            name: this._name,
            description: this._description,
            graphs: this.graphs,
            implementation: this.implementation,
        });
        return gzipSync(strToU8(serialized));
    }

    /**
     * Loads the behavioral control graphs from JSON text and sets
     * the active graph to the first graph in the collection of graphs.
     *
     * @param {String} compressedBytes compressed engine to deseralize
     * @throws {SyntaxError|TypeError} Thrown when the JSON text is invalid.
     */
    deserialize (compressedBytes) {
        // TODO: Improve validation to throw specific error.
        const json = strFromU8(gunzipSync(compressedBytes));

        const parsed = JSON.parse(json);

        this.graphs = new Graphs();
        this.graphs.loadFromJson(parsed.graphs);
        this.graph = this.graphs.getActiveGraph();

        this.implementation = new Implementation();
        this.implementation.loadFromJson(parsed.implementation);

        this._name = parsed.name;
        this._description = parsed.description;
    }

    /**
     * Add a file to the implementation with the given key, name, and content.
     *
     * @param {String} key Key of file in implementation.
     * @param {String} name Name of file to add to implementation.
     * @param {String} content Content of file to add to implementation.
     * @returns {Object} The file that was added to the implementation.
     * @throws {Error} Throws an error if a source file with the given key
     * already exists in the implementation.
     */
    addFile (key, name, content) {
        return this.implementation.addFile(key, name, content);
    }

    /**
     * Gets the file from the implementation with the given UID.
     *
     * @param {String} uid UID of file to get.
     * @returns {Object} The file in the implementation with the given UID.
     * @throws {Error} Throws an error if the source file with the given UID
     * does not exist in the implementation.
     */
    getFile (uid) {
        return this.implementation.getFile(uid);
    }

    /**
     * Gets all the files from the implementation.
     *
     * @returns {Array} An array of all files in the implementation.
     */
    getFiles () {
        return this.implementation.getFiles();
    }


    /**
     * Removes the file from the implementation with the given UID.
     * @param {String} uid UID of source file.
     * @throws {Error} Throws an error if the source file with the given UID
     * does not exist in the implementation.
     */
    removeFile (uid) {
        this.implementation.removeFile(uid);
    }

    /**
     * Creates a graph with the given name and sets it as the active graph.
     *
     * @param {String} name Name of the graph to create.
     * @throws {GraphWithNameExistsError} Thrown when a graph with the
     * provided name already exists.
     */
    createGraph (name) {
        this.graph = this.graphs.addGraph(name);
    }

    /**
     * Sets the active graph to the graph with the given graphId.
     *
     * @param {String} graphId ID of the graph to set as active
     * @throws {UnknownGraph} Thrown when the provided graphId does
     * not exist in the collection of graphs.
     */
    selectGraph (graphId) {
        this.graph = this.graphs.setActiveGraph(graphId);
    }

    /**
     * Removes the graph with the given graphId
     *
     * @param {String} graphId Id of graph to remove.
     * @throws {UnknownGraph} Thrown when the provided graphId does not
     * exist in the collection of graphs.
     */
    removeGraph (graphId) {
        this.graphs.removeGraph(graphId);
        this.graph = this.graphs.getActiveGraph();
    }

    /**
     * Returns the names of all the graphs in the design.
     *
     * @returns {Array} Returns an array of graph names.
     */
    getSelectableGraphs () {
        return this.graphs.getGraphNames();
    }

    /**
     * Creates a participant with the provided args and returns it.
     *
     * @param {Object} args Arguments to create the participant with.
     * @returns {Participant} Returns the created participant.
     * @throws {MissingAttributes} Thrown when required attributes are not
     * present in the args. See Participant class for required attributes.
     */
    createParticipant (args) {
        return new Participant(args);
    }

    /**
     * Creates a behavior with the provided args and returns it.
     *
     * @param {Object} args Arguments to create the behavior with.
     * @returns {Behavior} Returns the created behavior.
     * @throws {MissingAttributes} Thrown when required attributes are not
     * present in the args. See Behavior class for required attributes.
     */
    createBehavior (args) {
        return new Behavior(args);
    }

    /**
     * Creates an invariant with the provided args and returns it.
     *
     * @param {Object} args Arguments to create the invariant with.
     * @returns {Invariant} Returns the created invariant.
     * @throws {MissingAttributes} Raised when required attributes are not
     * present in the args. See Invariant class for required attributes.
     */
    createInvariant (args) {
        return new Invariant(args);
    }

    /**
     * Returns the node in the graph with the given behavior name.
     *
     * @param {String} behaviorId ID of the behavior.
     * @returns {GraphNode} Returns the node in the graph with the
     * given behavior name.
     * @throws {UnknownBehaviorError} Thrown when the provided behaviorId is not
     * a valid behavior in the graph.
     */
    getNode (behaviorId) {
        return this.graph.findNode(behaviorId);
    }

    /**
     * Adds a node to the graph with the given behaviorId and goToBehaviors.
     *
     * @param {String} behaviorId ID of the behavior for the node.
     * @param {String} description Description of the behavior for the node.
     * @param {Array} goToBehaviorIds IDs of the behaviors that this node
     * transitions to.
     * @param {Boolean} isAtomic Flag to indicate if this node contains an
     * atomic behavior.
     * @param {Boolean} isDesignFork Flag to indicate if this node
     * is a fork in the design.
     * @returns {GraphNode} Returns the created graph node.
     * @throws {BehaviorAlreadyExistsError} Raised when a node with the provided
     * behaviorId already exists in the graph.
     */
    addNode (behaviorId, description, goToBehaviorIds, isAtomic, isDesignFork) {
        return this.graph.addNode(
            behaviorId,
            description,
            goToBehaviorIds,
            isAtomic,
            isDesignFork
        );
    }

    /**
     * Deletes a node from the graph with the given behaviorId and
     * removes it from the goToBehavior list of all other nodes.
     *
     * @param {String} behaviorId Behavior ID of the node to delete.
     * @returns {GraphNode} Returns the deleted graph node.
     * @throws {UnknownBehaviorError} Thrown when the provided behaviorId is not
     * a valid behavior in the graph.
     */
    removeNode (behaviorId) {
        // TODO: Move this to graph class, this class shouldn't
        // modifiy the graph structure directly.
        const node = this.graph.findNode(behaviorId);
        const nodeIndex = this.graph.nodes.indexOf(node);
        const removedNode = this.graph.nodes.splice(nodeIndex, 1);
        for (const node of this.graph.nodes) {
            node.removeGoToBehavior(behaviorId);
        }
        return removedNode[0];
    }

    /**
     * Sets the current behavior in the graph. Since the behavior is not
     * being transitioned from another, it must be an atomic behavior.
     *
     * @param {String} behaviorId ID of the behavior to set as current.
     * @throws {UnknownBehaviorError} Thrown when the provided behavior is not
     * a valid behavior in the graph.
     */
    setCurrentBehavior (behaviorId) {
        this.graph.setCurrentBehavior(behaviorId);
    }

    /**
     * For the current node in the graph, transitions to the node with the given
     * behaviorId if it is a valid transition.
     *
     * @param {String} nextBehaviorId ID of the next behavior.
     * @throws {UnknownBehaviorError} Thrown when the provided behavior is not
     * a valid behavior in the graph.
     * @throws {InvalidTransitionError} Thrown when the provided behavior is not
     * a valid transition from the current node.
     */
    goToBehavior (nextBehaviorId) {
        this.graph.goToBehavior(nextBehaviorId);
    }
}
