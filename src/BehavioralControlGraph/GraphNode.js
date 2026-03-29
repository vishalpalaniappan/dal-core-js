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
        this._behavior = null;
        this._goToBehaviorIds = [];
        this._isAtomic = false;
        this._isDesignFork = false;
        if (typeof args === "object" && args !== null) {
            if (Object.hasOwn(args, "uid")) {
                this._loadNodeFromJSON(args);
            } else {
                /**
                 * TODO: Add required attributes and error handling
                 * for missing attributes as done in Member classes.
                 * Repeat same for BehavioralControlGraph.
                 */
                this._behavior = args.behavior;
                this._goToBehaviorIds = args.goToBehaviorsIds;
                this._isAtomic = args.isAtomic;
                this._isDesignFork = args.isDesignFork;
            }
        }
    }

    /**
     * Loads the nodes from a JSON object.
     * @param {Object} nodesJSON
     */
    _loadNodeFromJSON (nodesJSON) {
        for (const [key, value] of Object.entries(nodesJSON)) {
            if (key === "behavior") {
                this._behavior = new Behavior(value);
            } else if (key === "goToBehaviorsIds") {
                value.forEach(behaviorId => this._goToBehaviorIds.push(behaviorId));
            } else {
                this[key] = nodesJSON[key];
            }
        };
    }

    /**
     * Returns the behavior of the node.
     * @returns {Behavior|Null}
     */
    getBehavior () {
        return this._behavior;
    }

    /**
     * Returns the list of behavior names that this node transitions to.
     * @returns {Array}
     */
    getGoToBehaviors () {
        return this._goToBehaviorIds;
    }

    /**
     * Adds a behavior name to the list of behaviors that this
     * node transitions to.
     * @param {String} behaviorId ID of behavior.
     */
    addGoToBehavior (behaviorId) {
        this._goToBehaviorIds.push(behaviorId);
    }

    /**
     * Adds a behavior name to the list of behaviors that this
     * node transitions to.
     * @param {Array} behaviorIds IDs of behaviors.
     */
    addGoToBehaviors (behaviorIds) {
        this._goToBehaviorIds.push(...behaviorIds);
    }

    /**
     * Remove the behavior from the list of transitions.
     * @param {String} behaviorId
     */
    removeGoToBehavior (behaviorId) {
        const goToIndex = this._goToBehaviorIds.indexOf(behaviorId);
        if (goToIndex > -1) {
            this._goToBehaviorIds.splice(goToIndex, 1);
        }
    }

    /**
     * Raises a flag to indicate if the behavior is atomic or not.
     * @param {Boolean} isAtomic Flag indicates if the behavior is atomic.
     */
    setAtomic (isAtomic) {
        this._isAtomic = isAtomic;
    }

    /**
     * Returns whether the behavior is atomic or not.
     * @returns {Boolean}
     */
    isAtomic () {
        return this._isAtomic;
    }

    /**
     * Raises a flag to indicate if this node is a fork in the design.
     * @param {Boolean} forks Flag indicates if the node is a fork.
     */
    setDesignFork (forks) {
        this._isDesignFork = forks;
    }

    /**
     * Returns whether the node is a fork in the design or not.
     * @returns {Boolean}
     */
    isDesignFork () {
        return this._isDesignFork;
    }

    /**
     * Checks if the provided behavior name is a valid
     * transition from this node.
     * @param {String} behaviorName
     * @returns {Boolean}
     */
    isValidTransition (behaviorName) {
        for (let i = 0; i < this._goToBehaviorIds.length; i++) {
            const behaviorId = this._goToBehaviorIds[i];
            if (behaviorId === behaviorName) {
                return true;
            }
        }
        return false;
    }
}

export default GraphNode;
