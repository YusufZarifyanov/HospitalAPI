module.exports = {
    async up(db, client) {
        return await db.collection("doctors").insertMany(
            [
                {
                    name: "Светлана",
                    spec: "Терапевт",
                    slots: [new Date("2022-06-02T22:00:00.000Z"), new Date("2022-06-02T00:00:00.000Z")],
                    __v: 0
                },
            ],
            {},
        );
    },

    async down(db, client) {
        await db.collection("entries").deleteMany({});
        return await db.collection("doctors").deleteMany({});
    },
};
