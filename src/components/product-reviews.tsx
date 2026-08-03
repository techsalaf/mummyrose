import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { productReviewsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn("size-4", value <= Math.round(rating) ? "fill-accent text-accent" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  );
}

export function ratingSummary(reviews: { rating: number; is_approved: boolean }[]) {
  const approved = reviews.filter((review) => review.is_approved);
  if (approved.length === 0) return { average: 0, count: 0 };
  const total = approved.reduce((sum, review) => sum + Number(review.rating), 0);
  return { average: total / approved.length, count: approved.length };
}

/** Public reviews & ratings block for a product page. */
export function ProductReviews({ productId, productName }: { productId: string; productName: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery(productReviewsQuery(productId));
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const summary = ratingSummary(reviews);
  const visible = reviews.filter((review) => review.is_approved || review.user_id === user?.id);
  const mine = reviews.find((review) => review.user_id === user?.id);

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to review");
      const payload = {
        product_id: productId,
        user_id: user.id,
        author_name: (user.user_metadata?.["full_name"] as string) || user.email?.split("@")[0] || "Customer",
        rating,
        title: title.trim() || null,
        body: body.trim() || null,
      };
      const { error } = mine
        ? await supabase.from("product_reviews").update(payload).eq("id", mine.id)
        : await supabase.from("product_reviews").insert(payload);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Thank you — your review is awaiting approval");
      setTitle("");
      setBody("");
      await queryClient.invalidateQueries({ queryKey: ["product_reviews", productId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <section className="mt-20 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">Reviews &amp; ratings</p>
          <h2 className="mt-2 font-display text-2xl">What cooks say about {productName}</h2>
        </div>
        {summary.count > 0 ? (
          <div className="flex items-center gap-3">
            <Stars rating={summary.average} />
            <span className="text-sm text-muted-foreground">
              {summary.average.toFixed(1)} · {summary.count} review{summary.count === 1 ? "" : "s"}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to share how you cooked with it.
            </p>
          ) : (
            visible.map((review) => (
              <article key={review.id} className="surface-card rounded-lg p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars rating={Number(review.rating)} />
                  <span className="text-sm font-medium">{review.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  {!review.is_approved ? <Badge variant="secondary">Pending approval</Badge> : null}
                </div>
                {review.title ? <h3 className="mt-3 font-display text-lg">{review.title}</h3> : null}
                {review.body ? (
                  <p className="mt-2 leading-relaxed whitespace-pre-line text-muted-foreground">{review.body}</p>
                ) : null}
              </article>
            ))
          )}
        </div>

        <div className="surface-card h-fit rounded-lg p-5">
          <h3 className="font-display text-lg">{mine ? "Update your review" : "Write a review"}</h3>
          {!user ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                Reviews are verified, so you need an account to post one. It takes a few seconds.
              </p>
              <Button asChild variant="clay" className="mt-4">
                <Link to="/account">Sign in to review</Link>
              </Button>
            </>
          ) : (
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                submit.mutate();
              }}
            >
              <div>
                <Label>Your rating</Label>
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${value} star`}
                      onClick={() => setRating(value)}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          "size-6 transition-transform hover:scale-110",
                          value <= rating ? "fill-accent text-accent" : "text-muted-foreground/40",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-title">Headline</Label>
                <Input
                  id="review-title"
                  value={title}
                  maxLength={120}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1.5"
                  placeholder="Rich, fresh and worth it"
                />
              </div>
              <div>
                <Label htmlFor="review-body">Your review</Label>
                <Textarea
                  id="review-body"
                  value={body}
                  rows={4}
                  maxLength={1500}
                  onChange={(event) => setBody(event.target.value)}
                  className="mt-1.5"
                  placeholder="How did you cook with it?"
                />
              </div>
              <Button type="submit" variant="clay" className="w-full" disabled={submit.isPending}>
                {submit.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {mine ? "Update review" : "Submit review"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Reviews are published once our team approves them, usually within a day.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
