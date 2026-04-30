/**
 * This is a node script that executes the semantic model.
 * It will provide users with a way to provide inputs for behaviors that
 * require an input and it will produce a behavioral trace that can be
 * debugged using the TraceDebugger.
 *
 * I'm implementing it in node to experiment with the functionality and then
 * I will decide how to implement it in the workbench. I don't think it
 * makes sense to run it on the server, I can use workers to run it in the
 * browser.
 *
 * Eventually, we will have concurrent designs and that can also
 * be executed in the same way. In fact, that is a very exciting application
 * of this and it opens up a whole other set of possibilities. Its very hard
 * to test the behavior of distributed systems, working with the semantic model
 * trivializes that process and lets you play out very interesting scenarios
 * in a very effective way.
 */
