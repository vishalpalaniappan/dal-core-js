import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "src/DALEngine.js",
    output: [
        {
            file: "dist/index.cjs",
            format: "cjs",
            inlineDynamicImports: true,
        },
        {
            file: "dist/index.esm.js",
            format: "esm",
            inlineDynamicImports: true,
        },
    ],
    plugins: [resolve()],
};
