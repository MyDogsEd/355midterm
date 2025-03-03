"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const postsFile = path_1.default.join(__dirname, "../storage/posts.json");
const commentsFile = path_1.default.join(__dirname, "../storage/comments.json");
class PostManager {
    // There can only be one instance of the PostManager
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new PostManager();
            return this.instance;
        }
    }
    constructor() {
        this.postsMap = new Map;
        this.commentsMap = new Map;
        // read all posts from the JSON file
        var jsonData = fs_1.default.readFileSync(postsFile).toString();
        // Parse the JSON file
        var posts = JSON.parse(jsonData);
        // Load the posts into the postsMap
        for (const post of posts) {
            this.postsMap.set(Number(post.id), post);
        }
        // read all comments
        var comments = JSON.parse(fs_1.default.readFileSync(commentsFile).toString());
        // load them into the commentsMap
        for (const comment of comments) {
            this.commentsMap.set(Number(comment.id), comment);
        }
    }
    writePosts() {
        // write all posts to the posts.json file
        var jsonString = JSON.stringify(this.getPosts());
        fs_1.default.writeFileSync(postsFile, jsonString);
    }
    getPost(id) {
        return this.postsMap.get(Number(id));
    }
    getPosts() {
        var posts = [];
        this.postsMap.forEach((value) => {
            posts.push(value);
        });
        return posts;
    }
    newPost(title, author, content) {
        var id = Date.now();
        // assign the new post to the map
        this.postsMap.set(id, {
            id: id,
            title: title,
            author: author,
            content: content,
            comments: []
        });
        // Write the posts to the JSON file
        this.writePosts();
        return this.postsMap.get(id);
    }
    updatePost(id, title, author, content) {
        if (!this.postsMap.has(id)) {
            return;
        }
        this.postsMap.set(id, {
            id: id,
            title: title,
            author: author,
            content: content,
            comments: this.postsMap.get(id).comments // we know that the map has a post of this id, so assert
        });
        this.writePosts();
        return this.postsMap.get(id);
    }
    deletePost(id) {
        if (!this.postsMap.has(id)) {
            console.log("id not found in delete");
        }
        this.postsMap.delete(id);
        this.writePosts();
    }
    addCommentToPost(parentPost, commentId) {
        var post = this.getPost(parentPost);
        this.postsMap.set(Number(parentPost), {
            id: Number(parentPost),
            title: post.title,
            author: post.author,
            content: post.content,
            comments: post.comments.concat(commentId)
        });
        this.writePosts();
    }
    // COMMENTS
    writeComments() {
        var jsonData = JSON.stringify(this.getComments());
        fs_1.default.writeFileSync(commentsFile, jsonData);
    }
    getComments() {
        var comments = [];
        this.commentsMap.forEach((val) => {
            comments.push(val);
        });
        return comments;
    }
    getComment(id) {
        return this.commentsMap.get(id);
    }
    newComment(author, content, parentPost) {
        var id = Date.now();
        // assign the new comment to the map
        this.commentsMap.set(id, {
            id: id,
            author: author,
            content: content,
            parentPost: Number(parentPost)
        });
        // Write the posts to the JSON file
        this.writeComments();
        // add this comment to the parent post's comment list
        this.addCommentToPost(parentPost, id);
        return this.commentsMap.get(id);
    }
    updateComment(id, author, content) {
        if (!this.commentsMap.has(id)) {
            return;
        }
        this.commentsMap.set(id, {
            id: id,
            author: author,
            content: content,
            parentPost: this.commentsMap.get(id).parentPost
        });
        this.writeComments();
        return this.commentsMap.get(id);
    }
    deleteComment(commentId) {
        if (!this.commentsMap.has(commentId)) {
            console.log("id not found in delete");
        }
        // get the id of the parent post of this comment
        var parentId = this.commentsMap.get(commentId).parentPost;
        // if that parent post exists
        if (this.postsMap.has(parentId)) {
            // get the Post object of that parent post
            var parentPost = this.getPost(parentId);
            // update the info in the posts map
            this.postsMap.set(parentId, {
                id: parentPost.id,
                title: parentPost.title,
                author: parentPost.author,
                content: parentPost.content,
                // filter out the id of the comment we want to delete
                comments: parentPost.comments.filter((val) => val != commentId)
            });
            this.writePosts();
        }
        this.commentsMap.delete(commentId);
        this.writeComments();
    }
}
exports.default = PostManager;
