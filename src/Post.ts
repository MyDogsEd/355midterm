export default interface Post {
    readonly id: number // ID of this post
    readonly title: string // title of this post
    readonly author: string 
    readonly content: string
    readonly comments: Array<number> // list of IDs of comments on this post
}