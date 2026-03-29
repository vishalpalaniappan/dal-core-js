import GraphWithNameExistsError from "../Errors/GraphWithNameExistsError";
import UnknownGraph from "../Errors/UnknownGraph";
import BehavioralControlGraph from "./BehavioralControlGraph";

/**
 * Class representing a collection of atomic graphs.
 *
 * These graphs together represent the design. Within each graph, every node
 * must be part of the same tree. There cannot be multiple disconnected trees,
 * if there are, then it is a separate graph in this collection. Each graph
 * is identified by a unique name and is selected as the active graph when the
 * atomic behavior is observed. The atomic behavior is not transitioned to from
 * any other behavior, it is the root of the tree.
 */
class Graphs {
    constructor () {
        this._graphs = {};
        this.addGraph("default graph");
    }

    /**
     * Load the graphs from file.
     *
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
     * Given a graph ID, creates the graph and adds it to the collection.
     *
     * @param {String} graphId ID of the graph.
     * @returns {BehavioralControlGraph} The graph that was added.
     * @throws {GraphWithNameExistsError} Raised when a graph with the provided
     * name already exists in the collection of graphs.
     */
    addGraph (graphId) {
        if (graphId in this._graphs) {
            throw new GraphWithNameExistsError(graphId);
        }
        this._graphs[graphId] = new BehavioralControlGraph({name: graphId});
        this._activeGraph = this._graphs[graphId];
        return this._activeGraph;
    }

    /**
     * Returns the graph with the given graphID from the collection.
     *
     * @param {String} graphId ID of the graph to return.
     * @returns {BehavioralControlGraph} The graph with the given graphId.
     * @throws {UnknownGraph} Raised when a graph with the provided graphId does
     * not exist in the collection of graphs.
     */
    getGraph (graphId) {
        if (graphId in this._graphs) {
            return this._graphs[graphId];
        } else {
            throw new UnknownGraph(graphId);
        }
    }

    /**
     * Removes a graph with the given id from the collection of graphs. After
     * the graph is removed, it selects the first graph in the collection of
     * graphs. If there are no graphs left in the collection, it creates a new
     * graph with the name "default graph" and selects it as the active graph.
     *
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
        // TODO: Is there a better policy for which graph to select
        // after the current graph is removed?
        if (Object.keys(this._graphs).length === 0) {
            this.addGraph("default graph");
        } else {
            this._activeGraph = this._graphs[Object.keys(this._graphs)[0]];
        }
    }

    /**
     * Finds the graph with the given graphId and sets it as the active graph.
     *
     * @param {String} graphId Id of the graph to set as active.
     * @returns {BehavioralControlGraph} The currently active graph.
     * @throws {UnknownGraph} Raised when the provided graphId does not exist
     * in the collection of graphs.
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
     *
     * @returns {BehavioralControlGraph} The currently active graph.
     */
    getActiveGraph () {
        return this._activeGraph;
    }

    /**
     * Returns a collection of all the graphs in the design.
     *
     * @returns {Object} The collection of all graphs in the design.
     */
    getGraphs () {
        return this._graphs;
    }

    /**
     * Returns a list of all the graph names in the design.
     *
     * @returns {Array} A list of all graph names in the design.
     */
    getGraphNames () {
        return Object.keys(this._graphs);
    }
}

export default Graphs;
