import Base from "../Base";
import BehaviorAlreadyExistsError from "../Errors/BehaviorAlreadyExistsError";
import InvalidTransitionError from "../Errors/InvalidTransitionError";
import MissingAttributes from "../Errors/MissingAttributes";
import UnknownBehaviorError from "../Errors/UnknownBehaviorError";
import Behavior from "../Members/Behavior";
import ENGINE_TYPES from "../TYPES";
import GraphNode from "./GraphNode";

/**
 * Class representing the behavioral control graph.
 */
class BehavioralControlGraph extends Base {
    /**
     * Initialize the behavioral control graph.
     * @param {String} name
     * @param args
     */
    constructor (args) {
        super();

        // Object attributes with default values.
        this.type = ENGINE_TYPES.BEHAVIORAL_CONTROL_GRAPH;
        this.nodes = [];

        // Load from JSON if read from file (has uid attribute).
        if (typeof args === "object" && args !== null && !Array.isArray(args)) {
            if (Object.hasOwn(args, "uid")) {
                this._loadGraphFromJSON(args);
                return;
            }
        }
        // Load from args if creating new graph.
        this._loadArgs(args);
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
    _loadGraphFromJSON (graphJson) {
        for (const [key, value] of Object.entries(graphJson)) {
            if (key === "nodes") {
                value.forEach(node => this.nodes.push(new GraphNode(node)));
            } else {
                this[key] = graphJson[key];
            }
        };
    }

    /**
     * Adds a node to the graph.
     * @param {Behavior} behaviorId
     * @param {Array} goToBehaviorIds
     * @param {Boolean} isAtomic
     * @param {Boolean} isDesignFork
     * @throws {BehaviorAlreadyExistsError} Raised when a node with the provided
     * @returns
     */
    addNode (behaviorId, goToBehaviorIds, isAtomic, isDesignFork) {
        if (this.nodes.some((node) => node.getBehavior().name === behaviorId)) {
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
     * @returns
     */
    findNode (behaviorName) {
        for (let i = 0; i < this.nodes.length; i++) {
            const behavior = this.nodes[i].getBehavior();
            if (behavior.name === behaviorName) {
                return this.nodes[i];
            }
        }
        throw new UnknownBehaviorError(behaviorName);
    }

    /**
     * Sets the active node given the behavior name.
     * The execution provides the next observed
     * behavior and the active node indicates if
     * if it is a valid transition.
     *
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
     * @param {String} nextBehaviorName
     * @throws {InvalidTransitionError} Raised when the provided
     * behavior is not a valid transition.
     */
    goToBehavior (nextBehaviorName) {
        if (this.currentNode.isValidTransition(nextBehaviorName)) {
            this.currentNode = this.findNode(nextBehaviorName);
        } else {
            throw new InvalidTransitionError(this.currentNode.getBehavior().name, nextBehaviorName);
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
                mermaid += `  ${node.getBehavior().name} --> ${behaviorId}\n`;
            });
        });
        return mermaid;
    }
};

export default BehavioralControlGraph;
