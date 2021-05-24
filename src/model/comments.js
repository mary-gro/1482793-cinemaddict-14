import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }


  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update, comments) {
    this._comments = comments;

    this._notify(updateType, update);
  }

  deleteComment(updateType, commentId) {
    this._comments = this._comments.filter((comment) => comment.id !== commentId);

    this._notify(updateType);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        emoji: comment.emotion,
      },
    );

    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        emotion: comment.emoji,
      },
    );

    delete adaptedComment.emoji;

    return adaptedComment;
  }
}
