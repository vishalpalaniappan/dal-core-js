import Base from "../Base";
import InvalidTransitionError from "../Errors/InvalidTransitionError";
import UnknownBehaviorError from "../Errors/UnknownBehaviorError";
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
        this.type = ENGINE_TYPES.BEHAVIORAL_CONTROL_GRAPH;
        this.nodes = [];
        if (typeof args === "object" && args !== null) {
            if (Object.hasOwn(args, "uid")) {
                this._loadGraphFromJSON(args);
            } else {
                this.name = args.name;
            }
        }
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
     * @param {Behavior} behavior
     * @param {Array} goToBehaviorsIds
     * @returns
     */
    _addNode (behavior, goToBehaviorsIds) {
        const node = new GraphNode({
            behavior: behavior,
            goToBehaviorsIds: goToBehaviorsIds,
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
    _findNode (behaviorName) {
        for (let i = 0; i < this.nodes.length; i++) {
            const behavior = this.nodes[i].behavior;
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
    _setCurrentBehavior (behaviorName) {
        const node = this._findNode(behaviorName);
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
    _goToBehavior (nextBehaviorName) {
        if (this.currentNode.isValidGoToBehavior(nextBehaviorName)) {
            this.currentNode = this._findNode(nextBehaviorName);
        } else {
            throw new InvalidTransitionError(this.currentNode.behavior.name, nextBehaviorName);
        }
    }

    /**
     * Exports the graph represented using mermaid syntax for visualization.
     * @returns {String} Graph as mermaid diagram.
     */
    exportAsMermaid () {
        let mermaid = "flowchart TD\n";
        this.nodes.forEach((node) => {
            node.goToBehaviorsIds.forEach((behaviorId) => {
                mermaid += `  ${node.behavior.name} --> ${behaviorId}\n`;
            });
        });
        return mermaid;
    }
};

export default BehavioralControlGraph;
