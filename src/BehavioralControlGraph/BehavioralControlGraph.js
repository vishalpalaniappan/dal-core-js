import Base from "../Base";
import BehaviorAlreadyExistsError from "../Errors/BehaviorAlreadyExistsError";
import InvalidTransitionError from "../Errors/InvalidTransitionError";
import MissingAttributes from "../Errors/MissingAttributes";
import UnknownBehaviorError from "../Errors/UnknownBehaviorError";
import isLoadedFromFile from "../helpers/isLoadedFromFile";
import Behavior from "../Members/Behavior";
import ENGINE_TYPES from "../TYPES";
import GraphNode from "./GraphNode";


class BehavioralControlGraph extends Base {
    /**
     * Class representing the behavioral control graph. The behavioral control
     * graph is a directed graph where nodes represent behaviors and edges
     * represent valid transitions between behaviors.
     *
     * The graph can be used to execute the design by starting at the atomic
     * node and transitioning to observed behaviors. As the design is executed,
     * the values of the participants are set from the observed values and the
     * invariants are checked at each transition to recognize if the design has
     * entered a semantically invalid state.
     *
     * Currently, it only has to be initialized with a name and the remaining
     * attributes can be added using the provided methods. If the graph is being
     * loaded from a file, then the presence of a UID in the args will select
     * the relevant method to load the graph from a JSON object.
     *
     * @param {Object} args The args to initialize the behavioral control graph.
     */
    constructor (args) {
        super();
        this.type = ENGINE_TYPES.BEHAVIORAL_CONTROL_GRAPH;
        this.nodes = [];
        (isLoadedFromFile(args) ? this._loadFromFile(args) : this._loadArgs(args));
    }

    /**
     * Loads the provided arguments.
     * @throws {MissingAttributes} Thrown when required attr is not present.
     * @param {Object} args
     */
    _loadArgs (args) {
        /**
         * TODO: Move the attributes to private and use getters and setters
         * for them. Repeat for all the other classes.
         */
        const expectedAttributes = ["name"];
        if (typeof args !== "object" || args === null || Array.isArray(args)) {
            // Not an object, so all attributes are missing.
            throw new MissingAttributes("BehavioralControlGraph", expectedAttributes);
        }
        expectedAttributes.forEach((attr) => {
            if (!(attr in args)) {
                throw new MissingAttributes("BehavioralControlGraph", attr);
            }
            this[attr] = args[attr];
        });
    }

    /**
     * Loads the graph from a JSON object..
     * @param {Object} graphJson
     */
    _loadFromFile (graphJson) {
        for (const [key, value] of Object.entries(graphJson)) {
            if (key === "nodes") {
                value.forEach(node => this.nodes.push(new GraphNode(node)));
            } else {
                this[key] = graphJson[key];
            }
        };
    }

    /**
     * Adds a node to the graph with the provided arguments.
     *
     * @param {Behavior} behaviorId ID of the behavior represented by the node.
     * @param {Array} goToBehaviorIds IDs of the behaviors that are valid
     * transitions from this node.
     * @param {Boolean} isAtomic Flag indicating if the behavior represented by
     * the node is atomic.
     * @param {Boolean} isDesignFork Flag indicating if the node is a
     * design fork.
     * @throws {BehaviorAlreadyExistsError} Raised when a node with the provided
     * @returns {GraphNode} The created graph node.
     */
    addNode (behaviorId, goToBehaviorIds, isAtomic, isDesignFork) {
        if (this.nodes.some((node) => node.getBehavior().getName() === behaviorId)) {
            throw new BehaviorAlreadyExistsError(behaviorId);
        }
        const node = new GraphNode({
            behavior: new Behavior({name: behaviorId}),
            goToBehaviorIds: goToBehaviorIds?goToBehaviorIds:[],
            isAtomic: isAtomic?isAtomic:false,
            isDesignFork: isDesignFork?isDesignFork:false,
        });
        this.nodes.push(node);
        return node;
    }


    /**
     * Finds the given node given the behavior name.
     * @param {String} behaviorName
     * @throws {UnknownBehaviorError} Raised when the provided behavior
     * does not exist in the graph.
     * @returns {GraphNode} The found graph node.
     */
    findNode (behaviorName) {
        const node = this.nodes.find(
            (node) => node.getBehavior().getName() === behaviorName
        );
        if (!node) {
            throw new UnknownBehaviorError(behaviorName);
        }
        return node;
    }

    /**
     * Sets the active node given the behavior name.
     *
     * @param {String} behaviorName
     */
    setCurrentBehavior (behaviorName) {
        const node = this.findNode(behaviorName);
        /**
         * TODO: Ensure it is atomic because the execution
         * will only set a behavior when its the first one.
         * It will walk using goToBehavior after that.
         */
        this.currentNode = node;
    }

    /**
     * Check if the observed behavior is a valid transition
     * given the current node.
     *
     * @param {String} nextBehaviorName Name of the next behavior to
     * transition to.
     * @throws {InvalidTransitionError} Raised when the provided
     * behavior is not a valid transition.
     */
    goToBehavior (nextBehaviorName) {
        if (this.currentNode.isValidTransition(nextBehaviorName)) {
            this.currentNode = this.findNode(nextBehaviorName);
        } else {
            throw new InvalidTransitionError(
                this.currentNode.getBehavior().getName(), nextBehaviorName
            );
        }
    }

    /**
     * Exports the graph represented using mermaid syntax for visualization.
     * @returns {String} Graph as mermaid diagram.
     */
    exportAsMermaid () {
        let mermaid = "flowchart TD\n";
        this.nodes.forEach((node) => {
            node.getGoToBehaviors().forEach((behaviorId) => {
                mermaid += `  ${node.getBehavior().getName()} --> ${behaviorId}\n`;
            });
        });
        return mermaid;
    }
};

export default BehavioralControlGraph;
