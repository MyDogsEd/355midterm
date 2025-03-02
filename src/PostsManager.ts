import Post from "./Post"
import fs from "fs"
import path from "path"


const postsFile = path.join(__dirname, "../storage/posts.json")

export default class PostManager {

    private static instance: PostManager

    // There can only be one instance of the PostManager
    public static getInstance(): PostManager {
        if (this.instance) {
            return this.instance;
        } else {
            this.instance = new PostManager();
            return this.instance;
        }
    }

    
    private postsMap = new Map<Number, Post>

    private constructor() {
        // read all posts from the JSON file
        var jsonData = fs.readFileSync(postsFile).toString();

        // Parse the JSON file
        var posts: Array<Post> = JSON.parse(jsonData)
        //console.log(posts)

        // Load the posts into the postsMap
        for(const post of posts) {
            this.postsMap.set(Number(post.id), post)
        }
    }

    private writePosts() : void {
        // write all posts to the posts.json file
        var jsonString = JSON.stringify(this.getPosts())
        fs.writeFileSync(postsFile, jsonString)
    }

    public getPost(id: number): Post | undefined {
        return this.postsMap.get(id)
    }

    public getPosts(): Array<Post> {
        var posts: Array<Post> = []
        this.postsMap.forEach((value: Post) => {
            posts.push(value)
        })
        return posts;
    }

    public newPost(title: string, author: string, content: string): Post | undefined {
        var id = Date.now();

        // assign the new post to the map
        this.postsMap.set(id, {
            id: id,
            title: title,
            author: author,
            content: content,
            comments: []
        })

        // Write the posts to the JSON file
        this.writePosts();

        return this.postsMap.get(id)
    }

    public updatePost(id: number, title: string, author: string, content: string): Post | undefined {
        if (!this.postsMap.has(id)){
            return
        }
        this.postsMap.set(id, {
            id: id,
            title: title,
            author: author,
            content: content, 
            comments: this.postsMap.get(id)!.comments // we know that the map has a post of this id, so assert
        })
        this.writePosts()
        return this.postsMap.get(id)
    }

    public deletePost(id: number): void {
        if (!this.postsMap.has(id)){
            console.log("id not found in delete")
        }
        this.postsMap.delete(id)
        this.writePosts();
    }
}