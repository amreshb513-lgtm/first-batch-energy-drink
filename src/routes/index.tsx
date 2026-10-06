import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import canWide from "@/assets/can-wide.jpg";
import canTall from "@/assets/can-tall.jpg";

const TITLE = "First Batch — Caffeine-Free, Gluten-Free Energy Drink";
const DESC =
  "A caffeine-free, gluten-free sports drink for people who train hard and read labels. Sign up to get a free first-batch case.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Index() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return setError("Please enter your email.");
    if (!EMAIL_RE.test(value) || value.length > 255)
      return setError("That email doesn't look right.");
    setError("");
    setStatus("loading");
    const { error: dbError } = await supabase.from("signups").insert({ email: value });
    if (dbError && dbError.code !== "23505") {
      setStatus("idle");
      return setError("Something went wrong. Please try again.");
    }
    setStatus("done");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="stripe-bar" />
      <section className="flex-1 grid lg:grid-cols-2">
        <div className="flex items-center px-6 py-14 sm:px-12 lg:px-16">
          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 font-mono text-[11px] tracking-widest text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> FIRST BATCH
            </span>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl uppercase leading-[0.95]">
              Stay energized without caffeine or gluten.
            </h1>
            <p className="mt-5 text-base text-muted-foreground">
              A caffeine-free, gluten-free sports drink built for people who train hard and read labels.
              You get smooth energy to the last rep, with nothing your diet rules out.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] tracking-wider">
              {["CAFFEINE-FREE", "GLUTEN-FREE", "NO CRASH"].map((t) => (
                <span key={t} className="rounded-full border border-accent px-3 py-1 text-accent">{t}</span>
              ))}
            </div>
            <div className="mt-6 border-l-4 border-primary bg-muted px-4 py-3 text-sm">
              <p className="font-semibold">Sign up now and we'll send you a free case from the first production run — before we go to market.</p>
              <p className="mt-1 text-muted-foreground">All we ask for is honest feedback.</p>
            </div>

            {status === "done" ? (
              <div role="status" className="mt-8 border-2 border-primary bg-card px-5 py-4">
                <p className="font-mono text-xs tracking-widest text-primary">YOU'RE ON THE LIST</p>
                <p className="mt-1 text-sm text-muted-foreground">We'll email you when your free case from the first batch is ready to ship.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-8">
                <label htmlFor="email" className="font-mono text-xs tracking-widest">GET ON THE LIST</label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="email" type="email" value={email} placeholder="you@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!error}
                    className="flex-1 min-w-0 rounded-md border border-input bg-card px-3 py-3 text-sm outline-none focus:border-ring"
                  />
                  <button
                    type="submit" disabled={status === "loading"}
                    className="rounded-md bg-primary px-5 font-mono text-xs font-bold tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "loading" ? "..." : "SIGN UP"}
                  </button>
                </div>
                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
                <p className="mt-3 text-xs text-muted-foreground">One email when your batch is ready. No spam, no sharing.</p>
              </form>
            )}
          </div>
        </div>

        <div className="stage relative flex items-center justify-center overflow-hidden px-6 py-14">
          <div className="relative w-full max-w-2xl">
            <div className="rounded-t-2xl bg-device p-3 shadow-device">
              <img src={canWide} alt="Red, white and blue energy drink can splashing in ice water" width={1600} height={1008} className="aspect-[16/10] w-full rounded-md object-cover" />
            </div>
            <div className="mx-auto h-3 w-[110%] -translate-x-[4.5%] rounded-b-xl bg-device" />
            <div className="absolute -bottom-6 -left-2 w-[26%] rounded-[1.6rem] bg-device p-1.5 shadow-device sm:-left-6">
              <img src={canTall} alt="Energy drink can close-up" width={640} height={1280} loading="lazy" className="aspect-[9/19] w-full rounded-[1.3rem] object-cover" />
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-accent px-6 py-4 text-center font-mono text-[11px] tracking-widest text-muted-foreground">
        CREATED BY AMRESH KUMAR YADAV
      </footer>
    </main>
  );
}
