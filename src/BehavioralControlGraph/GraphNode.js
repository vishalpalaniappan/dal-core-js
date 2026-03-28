import Base from "../Base";
import Behavior from "../Members/Behavior";
import ENGINE_TYPES from "../TYPES";
/**
 * Class representing a behavioral control graph node.
 */
class GraphNode extends Base {
    /**
     * Initialize the node.
     * @param {String} name
     * @param args
     */
    constructor (args) {
        super();
        this.type = ENGINE_TYPES.GRAPH_NODE;
        this.goToBehaviorsIds = [];
        if (typeof args === "object" && args !== null) {
            if (Object.hasOwn(args, "uid")) {
                this.loadNodeFromJSON(args);
            } else {
                this.behavior = args.behavior;
                this.goToBehaviorsIds = args.goToBehaviorsIds;
            }
        }
    }

    /**
     * Loads the nodes from a JSON object.
     * @param {Object} nodesJSON
     */
    loadNodeFromJSON (nodesJSON) {
        for (const [key, value] of Object.entries(nodesJSON)) {
            if (key === "behavior") {
                this.behavior = new Behavior(value);
            } else if (key === "goToBehaviorsIds") {
                value.forEach(behaviorId => this.goToBehaviorsIds.push(behaviorId));
            } else {
                this[key] = nodesJSON[key];
            }
        };
    }

    /**
     * Adds a behavior name to the list of behaviors that this
     * node transitions to.
     * @param {String} behaviorId ID of behavior.
     */
    addGoToBehavior (behaviorId) {
        this.goToBehaviorsIds.push(behaviorId);
    }

    /**
     * Adds a behavior name to the list of behaviors that this
     * node transitions to.
     * @param {Array} behaviorIds IDs of behaviors.
     */
    addGoToBehaviors (behaviorIds) {
        this.goToBehaviorsIds.push(...behaviorIds);
    }

    /**
     * Checks if the provided behavior name is a valid
     * behavior that the control flow selects as a
     * result of the this nodes state transformation. i.e.
     * is this behavior in the goToBehavior list.
     * @param {String} behaviorName
     * @returns {Boolean}
     */
    isValidGoToBehavior (behaviorName) {
        for (let i = 0; i < this.goToBehaviorsIds.length; i++) {
            const behaviorId = this.goToBehaviorsIds[i];
            if (behaviorId === behaviorName) {
                return true;
            }
        }
        return false;
    }
}

export default GraphNode;
