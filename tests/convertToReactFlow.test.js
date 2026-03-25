import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { convertToReactFlow } from '../src/convertToReactFlow.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const designData = JSON.parse(
    readFileSync(resolve(__dirname, 'simple_design_temp.json'), 'utf-8')
);

describe('convertToReactFlow', () => {
    it('returns an object with nodes and edges arrays', () => {
        const result = convertToReactFlow(designData);
        expect(result).toHaveProperty('nodes');
        expect(result).toHaveProperty('edges');
        expect(Array.isArray(result.nodes)).toBe(true);
        expect(Array.isArray(result.edges)).toBe(true);
    });

    it('creates a node for every unique behavior', () => {
        const { nodes } = convertToReactFlow(designData);

        const uniqueBehaviorUids = new Set();
        for (const node of designData.nodes) {
            uniqueBehaviorUids.add(node.behavior.uid);
            for (const target of node.goToBehaviors) {
                uniqueBehaviorUids.add(target.uid);
            }
        }

        expect(nodes).toHaveLength(uniqueBehaviorUids.size);
    });

    it('each node has a valid React Flow shape', () => {
        const { nodes } = convertToReactFlow(designData);

        for (const node of nodes) {
            expect(node).toHaveProperty('id');
            expect(typeof node.id).toBe('string');
            expect(node).toHaveProperty('data.label');
            expect(typeof node.data.label).toBe('string');
            expect(node).toHaveProperty('position.x');
            expect(node).toHaveProperty('position.y');
            expect(typeof node.position.x).toBe('number');
            expect(typeof node.position.y).toBe('number');
        }
    });

    it('creates an edge for every behavior-to-goToBehavior relationship', () => {
        const { edges } = convertToReactFlow(designData);

        const expectedEdges = new Set();
        for (const node of designData.nodes) {
            for (const target of node.goToBehaviors) {
                expectedEdges.add(`${node.behavior.uid}->${target.uid}`);
            }
        }

        expect(edges).toHaveLength(expectedEdges.size);
    });

    it('each edge has a valid React Flow shape', () => {
        const { edges } = convertToReactFlow(designData);

        for (const edge of edges) {
            expect(edge).toHaveProperty('id');
            expect(typeof edge.id).toBe('string');
            expect(edge).toHaveProperty('source');
            expect(typeof edge.source).toBe('string');
            expect(edge).toHaveProperty('target');
            expect(typeof edge.target).toBe('string');
        }
    });

    it('edge source and target UIDs match existing node IDs', () => {
        const { nodes, edges } = convertToReactFlow(designData);
        const nodeIds = new Set(nodes.map((n) => n.id));

        for (const edge of edges) {
            expect(nodeIds.has(edge.source)).toBe(true);
            expect(nodeIds.has(edge.target)).toBe(true);
        }
    });

    it('does not produce duplicate node IDs', () => {
        const { nodes } = convertToReactFlow(designData);
        const ids = nodes.map((n) => n.id);
        expect(ids.length).toBe(new Set(ids).size);
    });

    it('does not produce duplicate edge IDs', () => {
        const { edges } = convertToReactFlow(designData);
        const ids = edges.map((e) => e.id);
        expect(ids.length).toBe(new Set(ids).size);
    });

    it('node labels match the behavior names from the design', () => {
        const { nodes } = convertToReactFlow(designData);
        const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

        for (const node of designData.nodes) {
            const rfNode = nodeById[node.behavior.uid];
            expect(rfNode.data.label).toBe(node.behavior.name);
        }
    });

    it('handles an empty nodes array without throwing', () => {
        const result = convertToReactFlow({ nodes: [] });
        expect(result.nodes).toHaveLength(0);
        expect(result.edges).toHaveLength(0);
    });
});
