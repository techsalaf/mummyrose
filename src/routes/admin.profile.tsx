import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { ProfileEditor } from "@/components/profile-editor";
import { ChangePasswordCard } from "@/components/profile-security-card";

export const Route = createFileRoute("/admin/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My profile - Mummy Rose Admin" },
      { name: "description", content: "Update your admin name, phone, email, photo and password." },
      { property: "og:title", content: "My profile - Mummy Rose Admin" },
      { property: "og:description", content: "Manage your Mummy Rose admin profile and password." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProfile,
});

function AdminProfile() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <div>
        <h1 className="font-display text-3xl">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your credentials, personal details and security.</p>
      </div>
      {user ? (
        <div className="space-y-8">
          <ProfileEditor user={user} roleLabel="Team member" />
          <ChangePasswordCard user={user} />
        </div>
      ) : null}
    </div>
  );
}
