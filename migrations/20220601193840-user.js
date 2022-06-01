module.exports = {
    async up(db, client) {
        return await db.collection("users").insertMany(
            [
                {
                    name: "Василий",
                    phone: "+79225485423",
                    __v: 0
                },
            ],
            {},
        );
    },

    async down(db, client) {
        return await db.collection("users").deleteMany({});
    },
};
