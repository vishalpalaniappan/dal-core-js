export class Implementation {

    /**
     * This class contains the implementation of a design. It contains the
     * source files that realize the design and it also contains the parsed
     * abstractions for each source file. The implementation is loaded by
     * the workspace to allow the developer to implement the design
     *
     * Each time the source file is saved, a version of it is preserved and
     * a new mapping file is created. In this process, the versions of the
     * source file are diff'ed and the semantic identity of the statements is
     * preserved.
     */
    constructor () {
        this._sourceFiles = [];
    }

    /**
     * Adds a source file to the implementation.
     * @param {String} name Name of the source file.
     * @param {String} path Path of the source file.
     * @param {String} content Content of the source file.
     */
    addSourceFile (name, path, content) {
        const existingFile = this.getSourceFile(path);
        if (existingFile) {
            throw new Error(`Source file with path ${path} already exists in the implementation.`);
        }
        this._sourceFiles.push({
            name: name,
            path: path,
            content: content,
        });
    }

    getSourceFile (path) {
        return this._sourceFiles.find(file => file.path === path);
    }

    getSourceFiles () {
        return this._sourceFiles;
    }

}
