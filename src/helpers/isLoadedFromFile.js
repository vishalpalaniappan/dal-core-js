/**
 * Checks if the provided object was loaded from a file. This is determind by
 * checking if the argument is an object and has a "uid" attribute, which is
 * added to all objects when they are created and is written to file when the
 * object is serialized.
 *
 * @param {*} obj The object to check.
 * @returns {Boolean} True if the object was loaded from file, false otherwise.
 */
const isLoadedFromFile = (obj) => {
    return typeof obj === "object" && obj !== null
        && !Array.isArray(obj) && Object.hasOwn(obj, "uid");
};

export default isLoadedFromFile;
