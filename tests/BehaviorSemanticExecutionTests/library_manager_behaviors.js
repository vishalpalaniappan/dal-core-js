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
    AcceptBookName: (world, args) => {
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("create tempName");
        behavior.addPrimitive('set pendingBook tempName ["name"]');
        behavior.addPrimitive("remove tempName");
        behavior.setArgs({initialValue: args.name});
        behavior.setPreWorldState(world);
        return behavior.computeTransformations();
    },
    AcceptBookGenre: (world, args) => {
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("create tempGenre");
        behavior.addPrimitive('set pendingBook tempGenre ["genre"]');
        behavior.addPrimitive("remove tempGenre");
        behavior.setArgs({initialValue: args.genre});
        behavior.setPreWorldState(world);
        return behavior.computeTransformations();
    },
    CreateBook: (world) => {
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("create book");
        behavior.addPrimitive("set book pendingBook []");
        behavior.addPrimitive("remove pendingBook");
        behavior.setPreWorldState(world);
        return behavior.computeTransformations();
    },
    AddBookToBasket: (world) => {
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("insert book basket []");
        behavior.setPreWorldState(world);
        return behavior.computeTransformations();
    },
}

export default behaviors;
