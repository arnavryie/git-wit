"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfileRedirect() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    let target = (session?.user as any)?.login || session?.user?.name;
    if (!target && typeof window !== "undefined") {
      target = localStorage.getItem("gitwit_active_user") || localStorage.getItem("ronin_active_user");
    }
    router.replace(`/profile/${target || "arnavryie"}`);
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gh-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gh-blue" />
    </div>
  );
}
