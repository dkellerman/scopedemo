"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { KEY_USERNAME } from "@/constants";

// Login/splash page
export default function LoginPage() {
  const [username, setUsername] = useState("david_kellerman");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = username?.trim();
    if (!val) return;
    sessionStorage.setItem(KEY_USERNAME, val);
    router.push("/videos");
  }

  return (
    <main className="flex items-center justify-center md:min-h-[70dvh]">
      <Card className="w-full max-w-sm">
        <h2 className="text-2xl mb-6">Sign in to continue</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
              className="border border-gray-400 rounded px-3 py-2"
            />
          </label>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </form>
      </Card>
    </main>
  );
}
