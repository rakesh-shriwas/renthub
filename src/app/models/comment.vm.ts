export interface ICommentRequest {
    postId: number;
    userId: number;
    userName: string;
    comment: string;
    createdAt: string;
}
export interface ICommentResponse extends ICommentRequest {
    id: number;
}
