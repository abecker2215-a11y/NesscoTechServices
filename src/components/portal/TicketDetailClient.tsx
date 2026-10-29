"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Paperclip,
  Shield,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface TicketData {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    source: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
    closedAt?: string | null;
    assignee?: { name: string | null; email: string } | null;
    createdBy: { name: string | null; email: string };
    client: { name: string; slug: string };
    comments: Array<{
      id: string;
      content: string;
      internal: boolean;
      createdAt: string;
      author: { name: string | null; email: string; image?: string | null };
    }>;
  };
  currentUserId: string;
  currentUserRole: string;
}

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(5000),
  internal: z.boolean(),
});

type CommentForm = z.infer<typeof commentSchema>;

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  OPEN: { label: "Open", class: "bg-blue-100 text-blue-800", icon: Clock },
  IN_PROGRESS: { label: "In Progress", class: "bg-yellow-100 text-yellow-800", icon: Activity },
  WAITING_CLIENT: { label: "Waiting on You", class: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  WAITING_VENDOR: { label: "Waiting on Vendor", class: "bg-purple-100 text-purple-800", icon: Clock },
  RESOLVED: { label: "Resolved", class: "bg-green-100 text-green-800", icon: CheckCircle },
  CLOSED: { label: "Closed", class: "bg-muted text-gray-800", icon: CheckCircle },
};

const priorityConfig: Record<string, { label: string; class: string }> = {
  LOW: { label: "Low", class: "bg-muted text-gray-800" },
  MEDIUM: { label: "Medium", class: "bg-blue-100 text-blue-800" },
  HIGH: { label: "High", class: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgent", class: "bg-red-100 text-red-800" },
  EMERGENCY: { label: "Emergency", class: "bg-red-200 text-red-900 animate-pulse" },
};

export function TicketDetailClient({ initialData }: { initialData: TicketData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const { ticket, currentUserRole } = initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { internal: currentUserRole !== "CLIENT" },
  });

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.comments.length]);

  const onSubmit = async (data: CommentForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/portal/tickets/${ticket.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      reset({ content: "", internal: currentUserRole !== "CLIENT" });
      router.refresh();
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || { label: status, class: "bg-muted text-gray-800", icon: Clock };
    const Icon = config.icon;
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium", config.class)}>
        <Icon className="h-4 w-4" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = priorityConfig[priority] || { label: priority, class: "bg-muted text-gray-800" };
    return <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-medium", config.class)}>{config.label}</span>;
  };

  const isClient = currentUserRole === "CLIENT";
  const canSeeInternal = currentUserRole !== "CLIENT";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/portal/tickets" className="p-2 rounded-lg text-muted-foreground hover:text-muted-foreground hover:bg-muted transition-colors" aria-label="Back to tickets">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground">#{ticket.id.slice(-6)}</span>
            <h1 className="text-2xl font-bold text-foreground">{ticket.title}</h1>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {getStatusBadge(ticket.status)}
            {getPriorityBadge(ticket.priority)}
            <span className="text-sm text-muted-foreground capitalize">{ticket.category.toLowerCase().replace("_", " ")}</span>
            <span className="text-sm text-muted-foreground">{ticket.source.toLowerCase().replace("_", " ")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/portal/tickets" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <section className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </div>
          </section>

          {/* Comments / Activity */}
          <section className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Activity & Comments
                <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                  {ticket.comments.length}
                </span>
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {ticket.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  isCurrentUser={comment.author.email === initialData.ticket.createdBy.email}
                  canSeeInternal={canSeeInternal}
                />
              ))}

              {/* Add comment form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-4" noValidate>
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm shrink-0">
                    {initialData.ticket.createdBy.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="flex-1">
                    <textarea
                      {...register("content")}
                      rows={3}
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-lg text-foreground placeholder-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        errors.content ? "border-red-300 bg-red-50" : "border-border"
                      )}
                      placeholder="Add a comment…"
                      disabled={isSubmitting}
                      aria-invalid={errors.content ? "true" : "false"}
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                    )}
                    {!isClient && (
                      <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          {...register("internal")}
                          type="checkbox"
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        Internal note (not visible to client)
                      </label>
                    )}
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          isSubmitting
                            ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Posting…
                          </span>
                        ) : (
                          "Post Comment"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div ref={commentsEndRef} />
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <section className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Ticket Info</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd className="font-medium text-foreground">{format(new Date(ticket.createdAt), "MMM d, yyyy h:mm a")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd className="font-medium text-foreground">
                  {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </dd>
              </div>
              {ticket.resolvedAt && (
                <div>
                  <dt className="text-muted-foreground">Resolved</dt>
                  <dd className="font-medium text-foreground">{format(new Date(ticket.resolvedAt), "MMM d, yyyy h:mm a")}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Created By</dt>
                <dd className="font-medium text-foreground">{ticket.createdBy.name ?? ticket.createdBy.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Assigned To</dt>
                <dd className="font-medium text-foreground">{ticket.assignee?.name ?? "Unassigned"}</dd>
              </div>
            </dl>
          </section>

          {/* Quick Actions */}
          <section className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full btn-secondary justify-start">
                <ExternalLink className="h-4 w-4" />
                View in PSA
              </button>
              <button className="w-full btn-secondary justify-start">
                <Paperclip className="h-4 w-4" />
                Attach Files
              </button>
              <button className="w-full btn-secondary justify-start text-red-600 hover:bg-red-50">
                <Shield className="h-4 w-4" />
                Escalate
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  canSeeInternal,
}: {
  comment: {
    id: string;
    content: string;
    internal: boolean;
    createdAt: string;
    author: { name: string | null; email: string; image?: string | null };
  };
  isCurrentUser?: boolean;
  canSeeInternal: boolean;
}) {
  if (comment.internal && !canSeeInternal) return null;

  return (
    <article className="p-4 hover:bg-muted" data-comment-id={comment.id}>
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm shrink-0">
          {comment.author.name?.[0]?.toUpperCase() ?? comment.author.email[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{comment.author.name ?? comment.author.email}</span>
            {comment.internal && canSeeInternal && (
              <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">Internal</span>
            )}
            <time className="text-xs text-muted-foreground" dateTime={comment.createdAt}>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </time>
          </div>
          <div className="mt-1 text-muted-foreground whitespace-pre-wrap">{comment.content}</div>
        </div>
      </div>
    </article>
  );
}
