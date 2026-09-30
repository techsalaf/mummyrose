import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { ProfileEditor } from "@/components/profile-editor";

export const Route = createFileRoute("/admin/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My profile — Mummy Rose Admin" },
      { name: "description", content: "Update your admin name, phone, email and photo." },
      { property: "og:title", content: "My profile — Mummy Rose Admin" },
      { property: "og:description", content: "Manage your Mummy Rose admin profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProfile,
});

function AdminProfile() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="font-display text-3xl">My profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">How you appear to your team.</p>
      <div className="mt-6">{user ? <ProfileEditor user={user} roleLabel="Team member" /> : null}</div>
    </div>
  );
}
