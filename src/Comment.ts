export default interface Comment {
    readonly parentPost: number // id of the parent post that this comment is on.
    readonly author: string
    readonly content: string
    readonly id: number
}