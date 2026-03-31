export const INVARIANT_TYPES = [
    {
        type: "min_length",
        label: "Minimum Length",
        description: "Ensures a string has a minimum length",
        properties: [
            {
                key: "key",
                label: "Key of value in object",
                type: "Array",
                required: true,
            },
            {
                key: "value",
                label: "Minimum Length",
                type: "string",
                required: true,
            },
        ],
    },
];

INVARIANT_TYPES = Object.freeze(INVARIANT_TYPES);

export default INVARIANT_TYPES;
