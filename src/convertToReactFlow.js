/**
 * Converts a DAL design JSON into React Flow nodes and edges.
 *
 * Each `behavior` in the design's `nodes` array becomes a React Flow node,
 * and each entry in `goToBehaviors` produces a directed edge from the
 * current behavior to the target behavior.
 *
 * @param {Object} data - Parsed DAL design JSON containing a `nodes` array.
 * @returns {{ nodes: Array, edges: Array }} React Flow-compatible nodes and edges.
 */
export function convertToReactFlow(data) {
    const nodesMap = new Map();
    const edgesMap = new Map();

    for (const node of data.nodes) {
        const { behavior, goToBehaviors } = node;

        if (!nodesMap.has(behavior.uid)) {
            nodesMap.set(behavior.uid, {
                id: behavior.uid,
                data: { label: behavior.name },
                position: { x: 0, y: 0 },
            });
        }

        for (const target of goToBehaviors) {
            if (!nodesMap.has(target.uid)) {
                nodesMap.set(target.uid, {
                    id: target.uid,
                    data: { label: target.name },
                    position: { x: 0, y: 0 },
                });
            }

            const edgeId = `edge-${behavior.uid}-${target.uid}`;
            if (!edgesMap.has(edgeId)) {
                edgesMap.set(edgeId, {
                    id: edgeId,
                    source: behavior.uid,
                    target: target.uid,
                });
            }
        }
    }

    const nodes = Array.from(nodesMap.values());
    const edges = Array.from(edgesMap.values());

    const COLS = Math.ceil(Math.sqrt(nodes.length));
    const X_SPACING = 250;
    const Y_SPACING = 100;

    nodes.forEach((node, index) => {
        node.position = {
            x: (index % COLS) * X_SPACING,
            y: Math.floor(index / COLS) * Y_SPACING,
        };
    });

    return { nodes, edges };
}
