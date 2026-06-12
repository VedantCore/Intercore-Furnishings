"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Loader2 } from "lucide-react";

interface Review {
  id: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
  }, [productId]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email || null);
    };

    fetchReviews();
    checkUser();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return alert("Please sign in to leave a review.");
    
    setIsSubmitting(true);
    const { error } = await supabase.from('reviews').insert([{
      product_id: productId,
      user_email: userEmail,
      rating,
      comment
    }]);

    setIsSubmitting(false);
    
    if (error) {
      alert("Failed to submit review.");
    } else {
      setComment("");
      setRating(5);
      fetchReviews(); // Refresh the list
    }
  };

  return (
    <div className="mt-16 border-t border-zinc-100 pt-12">
      <h2 className="text-sm uppercase tracking-widest font-medium text-zinc-900 mb-8">Client Reviews</h2>

      {/* Review Submission Form */}
      {userEmail ? (
        <form onSubmit={handleSubmit} className="mb-12 bg-zinc-50 p-6">
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${rating >= star ? 'text-black' : 'text-zinc-300'}`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Your Review</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-zinc-200 p-3 text-sm focus:border-black focus:ring-0 resize-none h-24"
              placeholder="Share your thoughts on this piece..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-900 text-white px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-sm text-zinc-500 mb-12">Please sign in to leave a review.</p>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <p className="text-sm font-light text-zinc-500">No reviews yet. Be the first to review this piece.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-zinc-50 pb-8">
              <div className="flex items-center gap-2 mb-2 text-black">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-zinc-200 fill-transparent'}`} />
                ))}
              </div>
              <p className="text-sm font-light text-zinc-700 mb-2">{review.comment}</p>
              <span className="text-xs text-zinc-400">
                {review.user_email.split('@')[0]} • {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}