import BehavioralControlGraph from "./BehavioralControlGraph";

/**
 * Class representing a collection of atomic graphs.
 *
 * These graphs together represent the design. I chose to separate
 * them into their graphs because as the design grows larger, it will
 * be easier to manage the design if it is separated into smaller graphs.
 * It is also easier to visualize in the UI in managable way.
 */
export class Graphs {

    constructor () {
        this._graphs = {};
    }

    /**
     * Adds a graph to the collection of graphs.
     * @param {String} graphId ID of the graph.
     * @returns {BehavioralControlGraph} The graph that was added.
     */
    addGraph (graphId) {
        this._graphs[graphId] = new BehavioralControlGraph();
        return this._graphs[graphId];
    }

    /**
     * Returns the graph with the given graphId.
     * @param {String} graphId ID of the graph to return.
     * @returns {BehavioralControlGraph} The graph with the given graphId.
     */
    getGraph (graphId) {
        return this._graphs[graphId];
    }
}
