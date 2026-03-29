import GraphWithNameExistsError from "../Errors/GraphWithNameExistsError";
import UnknownGraph from "../Errors/UnknownGraph";
import BehavioralControlGraph from "./BehavioralControlGraph";

/**
 * Class representing a collection of atomic graphs.
 *
 * These graphs together represent the design. I chose to separate
 * them into their graphs because as the design grows larger, it will
 * be easier to manage the design if it is separated into smaller graphs.
 * It is also easier to visualize in the UI in managable way.
 */
class Graphs {

    constructor () {
        this._graphs = {};
        this.addGraph("default graph");
    }

    /**
     * Load the graphs from JSON text.
     * @param {String} jsonText JSON text representing the collection of graphs.
     */
    loadFromJson (jsonText) {
        const parsed = JSON.parse(jsonText);
        Object.keys(parsed._graphs).forEach(graphId => {
            this._graphs[graphId] = new BehavioralControlGraph(parsed._graphs[graphId]);
        });
        this._activeGraph = this._graphs[Object.keys(this._graphs)[0]];
    }

    /**
     * Adds a graph to the collection of graphs.
     * @param {String} graphId ID of the graph.
     * @returns {BehavioralControlGraph} The graph that was added.
     */
    addGraph (graphId) {
        if (graphId in this._graphs) {
            throw new GraphWithNameExistsError(graphId);
        }
        this._graphs[graphId] = new BehavioralControlGraph({name: graphId});
        this._activeGraph = this._graphs[graphId];
        return this._activeGraph
    }

    /**
     * Returns the graph with the given graphId.
     * @param {String} graphId ID of the graph to return.
     * @returns {BehavioralControlGraph} The graph with the given graphId.
     */
    getGraph (graphId) {
        if (graphId in this._graphs) {
            return this._graphs[graphId];
        } else {
            throw new UnknownGraph(graphId);
        }
    }

    /**
     * Removes a graph from the collection of graphs.
     * @param {String} graphId ID of the graph to remove.
     * @throws {UnknownGraph} Raised when the provided graphId does not exist
     * in the collection of graphs.
     */
    removeGraph (graphId) {
        if (graphId in this._graphs) {
            delete this._graphs[graphId];
        } else {
            throw new UnknownGraph(graphId);
        }
        if (Object.keys(this._graphs).length === 0) {
            this.addGraph("default graph");
        } else {
            this._activeGraph = this._graphs[Object.keys(this._graphs)[0]];
        }
    }

    /**
     * Sets the active graph.
     * @param {String} graphId ID of the graph to set as active.
     * @throws {UnknownGraph} Raised when the provided graphId does not exist
     * in the collection of graphs.
     * @returns {BehavioralControlGraph} The graph that was set as active.
     */
    setActiveGraph (graphId) {
        if (graphId in this._graphs) {
            this._activeGraph = this._graphs[graphId];
        } else {
            throw new UnknownGraph(graphId);
        }
        return this._activeGraph;
    }

    /**
     * Returns the active graph.
     * @returns {BehavioralControlGraph}
     */
    getActiveGraph () {
        return this._activeGraph;
    }

    /**
     * Returns a collection of all the graphs in the design.
     * @returns {Object}
     */
    getGraphs () {
        return this._graphs;
    }

    /**
     * Returns a list of all the graph names in the design.
     * @returns {Array}
     */
    getGraphNames () {
        return Object.keys(this._graphs);
    }
}

export default Graphs;
