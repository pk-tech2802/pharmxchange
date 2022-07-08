const { recordsSchema, forumSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Record = require("./models/records");
const Forum = require("./models/forum");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.validateRecord = (req, res, next) => {
    const { error } = recordsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    if (!record.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission");
        return res.redirect(`/records/${id}`);
    }
    next();
};

module.exports.validateForum= (req, res, next) => {
    const { error } = forumSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isForumAuthor = async (req, res, next) => {
    const { id, forumId } = req.params;
    const forum = await Forum.findById(forumId);
    if (!forum.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/records/${id}`);
    }
    next();
}; 
