const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isForumAuthor, validateForum } = require("../middleware");

const Record = require("../models/records");
const Forum = require("../models/forum");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post(
    "/",
    isLoggedIn,
    validateForum,
    catchAsync(async (req, res) => {
        const record = await Record.findById(req.params.id);
        const forum = new Forum(req.body.forum);
        forum.author = req.user._id;
        record.forum.push(forum);
        await forum.save();
        await record.save();
        req.flash("success", "Successfully made a new comment!");
        res.redirect(`/records/${record._id}`);
    })
);

router.delete(
    "/:forumId",
    isLoggedIn,
    isForumAuthor,
    catchAsync(async (req, res) => {
        const { id, forumId } = req.params;
        await Record.findByIdAndUpdate(id, {
            $pull: { forum: forumId },
        });
        await Forum.findByIdAndDelete(forumId);
        req.flash("success", "Successfully deleted comment!");
        res.redirect(`/records/${id}`);
    })
);

module.exports = router;
