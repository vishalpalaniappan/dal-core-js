// DALEngine.ts
export interface DALEngineOptions {
    name: string;
}

export class DALEngine {
    private _name: string;

    constructor(options: DALEngineOptions) {
        this._name = options.name;
    }

    /**
     * Gets the name of the engine.
     * @returns The name of the engine.
     */
    get name(): string {
        return this._name;
    }

    /**
     * Sasdfays hello using the engine's name.
     */
    sayHello(): void {
        console.log(`Hello my name is ${this._name}!!`);
    }
}