"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = require("express-handlebars");
const PostsManager_1 = __importDefault(require("./PostsManager"));
const app = (0, express_1.default)();
const PORT = 3000;
// EXPRESS SETTINGS ----------
// set the views for handlebars
app.set('views', path_1.default.join(__dirname, "../views"));
// set the layouts and partials directories for handlebars
app.engine("hbs", (0, express_handlebars_1.engine)({
    extname: 'hbs',
    layoutsDir: path_1.default.join(__dirname, '../views/layouts'),
    partialsDir: path_1.default.join(__dirname, '../views/partials'),
}));
app.set("view engine", 'hbs');
// register express json middleware
app.use(express_1.default.json());
// WEB APP --------
app.get("/", (req, res) => {
    res.render("home", { post: PostsManager_1.default.getInstance().getPosts() });
});
// POSTS/COMMENTS API ------------
// get all posts
app.get("/posts", (req, res) => {
    res.json(PostsManager_1.default.getInstance().getPosts());
});
// get a specific post by id
app.get("/posts/:id", (req, res) => {
    res.json(PostsManager_1.default.getInstance().getPost(Number.parseInt(req.params.id)));
});
// create a new post
/**
 * {
 *     "title": <title>,
 *     "author": <author>,
 *     "content": <content>
 * }
 */
app.post("/posts", (req, res) => {
    res.json(PostsManager_1.default.getInstance().newPost(req.body.title, req.body.author, req.body.content));
});
// update a post by ID
/**
 * {
 *     "title": <title>,
 *     "author": <author>,
 *     "content": <content>
 * }
 */
app.put("/posts/:id", (req, res) => {
    res.json(PostsManager_1.default.getInstance().updatePost(Number.parseInt(req.params.id), req.body.title, req.body.author, req.body.content));
});
// Delete a post by ID
app.delete("/posts/:id", (req, res) => {
    PostsManager_1.default.getInstance().deletePost(Number.parseInt(req.params.id));
    res.sendStatus(204);
});
app.listen(PORT);
console.log("listening on port " + PORT);
