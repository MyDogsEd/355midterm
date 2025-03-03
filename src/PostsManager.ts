import Post from "./Post"
import fs from "fs"
import path from "path"
import Comment from "./Comment"


const postsFile = path.join(__dirname, "../storage/posts.json")
const commentsFile = path.join(__dirname, "../storage/comments.json")

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
    private commentsMap = new Map<Number, Comment>

    private constructor() {
        // read all posts from the JSON file
        var jsonData = fs.readFileSync(postsFile).toString();

        // Parse the JSON file
        var posts: Array<Post> = JSON.parse(jsonData)

        // Load the posts into the postsMap
        for(const post of posts) {
            this.postsMap.set(Number(post.id), post)
        }

        // read all comments
        var comments: Array<Comment> = JSON.parse(
            fs.readFileSync(commentsFile).toString()
        );

        // load them into the commentsMap
        for(const comment of comments) {
            this.commentsMap.set(Number(comment.id), comment)
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

    public addCommentToPost(parentPost: number, commentId: number): void {
        var post = this.getPost(parentPost);
        this.postsMap.set(parentPost, {
            id: parentPost,
            title: post!.title,
            author: post!.author,
            content: post!.content,
            comments : post!.comments.concat(commentId)
        })
        this.writePosts();
    }

    // COMMENTS

    private writeComments(): void {
        var jsonData = JSON.stringify(this.getComments())
        fs.writeFileSync(commentsFile, jsonData)
    }

    public getComments(): Array<Comment> {
        var comments: Array<Comment> = []
        this.commentsMap.forEach((val: Comment) => {
            comments.push(val)
        })
        return comments;
    }

    public getComment(id: number): Comment | undefined {
        return this.commentsMap.get(id)
    }

    public newComment(author: string, content: string, parentPost: number): Comment | undefined {
        var id = Date.now();

        // assign the new comment to the map
        this.commentsMap.set(id, {
            id: id,
            author: author,
            content: content,
            parentPost: parentPost
        })

        // Write the posts to the JSON file
        this.writeComments();

        // add this comment to the parent post's comment list
        this.addCommentToPost(parentPost, id)
        return this.commentsMap.get(id)
    }

    public updateComment(id: number, author: string, content: string): Comment | undefined {
        if (!this.commentsMap.has(id)){
            return
        }
        this.commentsMap.set(id, {
            id: id,
            author: author,
            content: content,
            parentPost: this.commentsMap.get(id)!.parentPost
        })
        this.writeComments()
        return this.commentsMap.get(id)
    }

    public deleteComment(commentId: number): void {
        if (!this.commentsMap.has(commentId)){
            console.log("id not found in delete")
        }
        
        // get the id of the parent post of this comment
        var parentId = this.commentsMap.get(commentId)!.parentPost

        // if that parent post exists
        if(this.postsMap.has(parentId)) {

            // get the Post object of that parent post
            var parentPost = this.getPost(parentId)

            // update the info in the posts map
            this.postsMap.set(parentId,{
                id: parentPost!.id,
                title: parentPost!.title,
                author: parentPost!.author,
                content: parentPost!.content,
                // filter out the id of the comment we want to delete
                comments: parentPost!.comments.filter((val) => val != commentId) 
            })
            this.writePosts() 
        }

        this.commentsMap.delete(commentId)
        this.writeComments();
    }
}