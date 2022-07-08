const mongoose = require("mongoose");
const Forum = require("./forum");
const Schema = mongoose.Schema;

const recordsSchema = new Schema({
    name: String,
    disease: String,
    symptoms: String,
    treatment: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    forum: [
        {
            type: Schema.Types.ObjectId,
            ref: "Forum",
        },
    ],
});

recordsSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Forum.deleteMany({
            _id: {
                $in: doc.forum,
            },
        });
    }
});

module.exports = mongoose.model("Records", recordsSchema);
