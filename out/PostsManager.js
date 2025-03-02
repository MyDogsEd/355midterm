"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const postsFile = path_1.default.join(__dirname, "../storage/posts.json");
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
        // read all posts from the JSON file
        var jsonData = fs_1.default.readFileSync(postsFile).toString();
        // Parse the JSON file
        var posts = JSON.parse(jsonData);
        //console.log(posts)
        // Load the posts into the postsMap
        for (const post of posts) {
            this.postsMap.set(Number(post.id), post);
        }
    }
    writePosts() {
        // write all posts to the posts.json file
        var jsonString = JSON.stringify(this.getPosts());
        fs_1.default.writeFileSync(postsFile, jsonString);
    }
    getPost(id) {
        return this.postsMap.get(id);
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
}
exports.default = PostManager;
