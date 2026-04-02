import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Trash2, Reply, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

const CommentSection = ({ slug, blogOwnerId }) => {
  const { axios, user } = useAppContext();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch Comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/api/v1/users/blogs/${slug}/comments`);
        if (data.success) setComments(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [slug]);

  // Submit Comment
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/v1/users/blogs/${slug}/comments`, {
        text: commentText,
      });
      if (data.success) {
        setComments((prev) => [{ ...data.data, replies: [] }, ...prev]);
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  //Submit Reply
  const handleReplySubmit = async (parentCommentId) => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/v1/users/blogs/${slug}/comments`, {
        text: replyText,
        parentCommentId,
      });
      if (data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentCommentId ? { ...c, replies: [...(c.replies || []), data.data] } : c,
          ),
        );
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  //  React to Comment/Reply
  const handleReact = async (commentId, type, isReply = false, parentId = null) => {
    try {
      const { data } = await axios.patch(`/api/v1/users/blogs/comments/${commentId}/react`, {
        type,
      });
      if (data.success) {
        const updateReaction = (c) =>
          c._id === commentId
            ? {
                ...c,
                likes: Array(data.data.likes).fill(null),
                dislikes: Array(data.data.dislikes).fill(null),
                userLiked: data.data.userLiked,
                userDisliked: data.data.userDisliked,
              }
            : c;

        setComments((prev) =>
          prev.map((c) => {
            if (!isReply) return updateReaction(c);
            if (c._id === parentId) {
              return { ...c, replies: c.replies.map(updateReaction) };
            }
            return c;
          }),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  //  Delete Comment/Reply
  const handleDelete = async (commentId, isReply = false, parentId = null) => {
    try {
      const { data } = await axios.delete(`/api/v1/users/blogs/comments/${commentId}`);
      if (data.success) {
        if (!isReply) {
          setComments((prev) => prev.filter((c) => c._id !== commentId));
        } else {
          setComments((prev) =>
            prev.map((c) =>
              c._id === parentId
                ? { ...c, replies: c.replies.filter((r) => r._id !== commentId) }
                : c,
            ),
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-14">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">💬 Comments ({comments.length})</h2>

      {/* Add Comment Box*/}
      {user ? (
        <div className="flex gap-3 mb-8">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {user.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={submitting || !commentText.trim()}
              className="mt-2 flex items-center gap-2 bg-primary text-white text-sm px-5 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition cursor-pointer"
            >
              <Send size={14} /> {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-6">Please first login to add a comment</p>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No comments yet. Be the first! 🚀
          </p>
        )}

        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            {/* Comment Header */}
            <div className="flex items-center gap-3 mb-3">
              {comment.author?.image?.url ? (
                <img
                  src={comment.author.image.url}
                  className="h-8 w-8 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {comment.author?.name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-800">{comment.author?.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {(user?._id === comment.author?._id || user?._id === blogOwnerId) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="ml-auto text-gray-300 hover:text-red-400 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Comment Text */}
            <p
              className={`text-sm text-gray-600 mb-3 ${comment.isDeleted ? 'italic text-gray-400' : ''}`}
            >
              {comment.text}
            </p>

            {/* Reactions and Reply Button */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <button
                onClick={() => handleReact(comment._id, 'like')}
                className={`flex items-center gap-1 hover:text-green-500 transition cursor-pointer ${comment.userLiked ? 'text-green-500' : ''}`}
              >
                <ThumbsUp size={13} /> {comment.likes?.length || 0}
              </button>
              <button
                onClick={() => handleReact(comment._id, 'dislike')}
                className={`flex items-center gap-1 hover:text-red-400 transition cursor-pointer ${comment.userDisliked ? 'text-red-400' : ''}`}
              >
                <ThumbsDown size={13} /> {comment.dislikes?.length || 0}
              </button>
              {user && !comment.isDeleted && (
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo?.id === comment._id
                        ? null
                        : { id: comment._id, authorName: comment.author?.name },
                    )
                  }
                  className="flex items-center gap-1 hover:text-primary transition cursor-pointer"
                >
                  <Reply size={13} /> Reply
                </button>
              )}
            </div>

            {/* Reply Input */}
            {replyingTo?.id === comment._id && (
              <div className="mt-4 flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Replying to ${replyingTo.authorName}...`}
                  rows={2}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    disabled={submitting || !replyText.trim()}
                    className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={12} />
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 border rounded-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies?.length > 0 && (
              <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-100 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply._id}>
                    <div className="flex items-center gap-2 mb-1">
                      {reply.author?.image?.url ? (
                        <img
                          src={reply.author.image.url}
                          className="h-7 w-7 rounded-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {reply.author?.name?.charAt(0)}
                        </div>
                      )}
                      <p className="text-xs font-semibold text-gray-700">{reply.author?.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(reply.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {(user?._id === reply.author?._id || user?._id === blogOwnerId) && (
                        <button
                          onClick={() => handleDelete(reply._id, true, comment._id)}
                          className="ml-auto text-gray-300 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <p
                      className={`text-xs text-gray-600 mb-2 ${reply.isDeleted ? 'italic text-gray-400' : ''}`}
                    >
                      {reply.text}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <button
                        onClick={() => handleReact(reply._id, 'like', true, comment._id)}
                        className={`flex items-center gap-1 hover:text-green-500 transition cursor-pointer ${reply.userLiked ? 'text-green-500' : ''}`}
                      >
                        <ThumbsUp size={11} /> {reply.likes?.length || 0}
                      </button>
                      <button
                        onClick={() => handleReact(reply._id, 'dislike', true, comment._id)}
                        className={`flex items-center gap-1 hover:text-red-400 transition cursor-pointer ${reply.userDisliked ? 'text-red-400' : ''}`}
                      >
                        <ThumbsDown size={11} /> {reply.dislikes?.length || 0}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
