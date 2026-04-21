import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";

const behaviors = {
    InitializeWorld: (world) => {
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("create basket");
        behavior.setPreWorldState(world);
        behavior.setPostWorldState({basket: []});
        behavior.setArgs({initialValue: []});
        return behavior.computeTransformations();
    },
    CreatePendingBook: (world) => {
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("create pendingBook");
        behavior.setPreWorldState(world);
        behavior.setPostWorldState({pendingBook: {}});
        behavior.setArgs({initialValue: {}});
        return behavior.computeTransformations();
    },
}

export default behaviors;
