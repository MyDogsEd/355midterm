import express, {Request, Response} from "express";
import path from "path";
import {engine} from "express-handlebars";
import PostManager from "./PostsManager";
import { isUndefined } from "util";

const app = express();

const PORT = 3000;

// EXPRESS SETTINGS ----------

// set the views for handlebars
app.set('views', path.join(__dirname, "../views"));

// set the layouts and partials directories for handlebars
app.engine("hbs", engine({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
}));

app.set("view engine", 'hbs');

// register express json middleware
app.use(express.json())

// Serve the files in the static dir
app.use(express.static("static"));

// WEB APP --------
app.get("/", (req: Request, res: Response) => {
    res.render("home", {post: PostManager.getInstance().getPosts()})
});

app.get('/posts/:id', (req: Request, res: Response) => {
    var post = PostManager.getInstance().getPost(Number.parseInt(req.params.id))
    if (post === undefined) {
        res.sendStatus(404);
        return
    }

    var comments = []

    post.comments.forEach(element => {
        
    });

    res.render("posts", {
        title: post.title,
        author: post.author,
        content: post.content,
        comment: 
    })
})


// POSTS/COMMENTS API ------------

// get all posts
app.get("/api/posts", (req: Request, res: Response) => {
    res.json(
        PostManager.getInstance().getPosts()
    )
})

// get a specific post by id
app.get("/api/posts/:id", (req: Request, res: Response) => {
    res.json(
        PostManager.getInstance().getPost(Number.parseInt(req.params.id))
    )
})

// create a new post
/**
 * {
 *     "title": <title>,
 *     "author": <author>,
 *     "content": <content>
 * }
 */
app.post("/api/posts", (req: Request, res: Response) => {
    res.json(
        PostManager.getInstance().newPost(
            req.body.title,
            req.body.author,
            req.body.content
        )
    )
})

// update a post by ID
/**
 * {
 *     "title": <title>,
 *     "author": <author>,
 *     "content": <content>
 * }
 */
app.put("/api/posts/:id", (req: Request, res: Response) => {
    res.json(
        PostManager.getInstance().updatePost(
            Number.parseInt(req.params.id),
            req.body.title,
            req.body.author,
            req.body.content
        )
    )
})

// Delete a post by ID
app.delete("/api/posts/:id", (req: Request, res: Response) => {
    PostManager.getInstance().deletePost(Number.parseInt(req.params.id));
    res.sendStatus(204)
})

app.listen(PORT);

console.log("listening on port " + PORT);