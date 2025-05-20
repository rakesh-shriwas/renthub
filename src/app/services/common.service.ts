import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { env } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { IPostRequest, IPostResponse } from '../models/post.vm';
import { IFavoritesResponse } from '../models/favorites.vm';
import { ICommentRequest, ICommentResponse } from '../models/comment.vm';
import { ISignUpRequest, ISignUpResponse, IUser } from '../models/user.vm';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  http = inject(HttpClient);
  private apiUrl = env.api_url;

  constructor() {}

  /**
   * Get all post
   *
   * @return {*}  {Observable<IPostResponse[]>}
   * @memberof CommonService
   */
  getPosts(): Observable<IPostResponse[]> {
    return this.http.get<IPostResponse[]>(`${this.apiUrl}/posts`);
  }
  
  /**
   * Get post list by user id
   *
   * @param {number} userId
   * @return {*}  {Observable<IPostResponse>}
   * @memberof CommonService
   */
  getPostByUserId(userId: number): Observable<IPostResponse[]> {
    return this.http.get<IPostResponse[]>(`${this.apiUrl}/posts?userId=${userId}`)
  }

  /**
   * Get Post by id
   *
   * @param {number} userId
   * @return {*}  {Observable<IPostResponse[]>}
   * @memberof CommonService
   */
  getPostDetailsById(postId: number): Observable<IPostResponse[]> {
    return this.http.get<IPostResponse[]>(`${this.apiUrl}/posts?id=${postId}`);
  }

  /**
   * Create New Post
   *
   * @param {IPostRequest} postObj
   * @return {*}  {Observable<IPostResponse>}
   * @memberof CommonService
   */
  createPost(postObj: IPostRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>(`${this.apiUrl}/posts`, postObj);
  }

  /**
   * Update existing post by post id
   *
   * @param {number} postId
   * @param {IPostRequest} postObj
   * @return {*}  {Observable<IPostResponse>}
   * @memberof CommonService
   */
  updatePostById(
    postId: number,
    postObj: IPostRequest
  ): Observable<IPostResponse> {
    return this.http.patch<IPostResponse>(`${this.apiUrl}/posts/${postId}`, postObj);
  }

  /**
   * Get favorites post by user id
   *
   * @param {number} userId
   * @return {*}  {Observable<IFavoritesResponse[]>}
   * @memberof CommonService
   */
  getFavoriteById(userId: number): Observable<IFavoritesResponse[]> {
    return this.http.get<IFavoritesResponse[]>(
      `${this.apiUrl}/favorites?userId=${userId}`
    );
  }

  addFavorite(obj: any): Observable<IFavoritesResponse[]> {
    return this.http.post<IFavoritesResponse[]>(`${this.apiUrl}/favorites`, obj)
  }
  removeFavorite(postId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/favorites/${postId}`)
  }

  /**
   * Get post comments by post id
   *
   * @param {number} postId
   * @return {*}  {Observable<ICommentResponse[]>}
   * @memberof CommonService
   */
  getCommentsByPostId(postId: number): Observable<ICommentResponse[]> {
    return this.http.get<ICommentResponse[]>(
      `${this.apiUrl}/comments?postId=${postId}&_sort=id&_order=desc`
    );
  }

  /**
   * Post a new comment on a post
   *
   * @param {ICommentRequest} obj
   * @return {*}  {Observable<ICommentResponse[]>}
   * @memberof CommonService
   */
  postAComment(obj: ICommentRequest): Observable<ICommentResponse[]> {
    return this.http.post<ICommentResponse[]>(
      `${this.apiUrl}/comments?postId=${obj.postId}`,
      obj
    );
  }

  /**
   * Create New User
   *
   * @param {ISignUpRequest} userObj
   * @return {*}  {Observable<ISignUpResponse>}
   * @memberof CommonService
   */
  createUser(userObj: Partial<{ name?: string | null | undefined; email: string | null; password: string | null; role: string | null; }>): Observable<ISignUpResponse> {
    return this.http.post<ISignUpResponse>(`${this.apiUrl}/users`, userObj);
  }

  /**
   * Ge All User
   *
   * @return {*}  {Observable<IUser[]>}
   * @memberof CommonService
   */
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/users`);
  }

  /**
   * Logout
   *
   * @return {*}  {Observable<boolean>}
   * @memberof CommonService
   */
  logout(): Observable<boolean> {
    try {
      localStorage.removeItem('loggedInUser');
      return of(true);
    } catch (error) {
      console.error('Logout failed', error);
      return of(false);
    }
  }

  /**
   * Get Authenticated User Details
   *
   * @return {*}  {(Observable<IUser | null>)}
   * @memberof CommonService
   */
  getAuthenticateUser(): Observable<IUser | null> {
    const user = localStorage.getItem('loggedInUser');
    const parsedUser = user ? JSON.parse(user) : null;
    return of(parsedUser);
  }
}
