import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/shared/StateMessage";
import { ApiClientError } from "@/lib/api/client";
import { submitContact } from "@/lib/api/resources";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("submitting");

    try {
      await submitContact({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
      });

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof ApiClientError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  const busy = state === "submitting";

  if (state === "success") {
    return (
      <StateMessage
        title="Thank you. Your message has been sent."
        description="Someone from the church will get back to you soon."
        action={
          <Button variant="secondary" onClick={() => setState("idle")}>
            Send another message
          </Button>
        }
      />
    );
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      {state === "error" && (
        <p
          role="alert"
          className="border-l-2 border-error pl-4 text-sm leading-relaxed text-error"
        >
          {errorMessage ||
            "Your message could not be sent. Please try again."}
        </p>
      )}

      {/* Name + Email */}
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Full name{" "}
            <span className="text-error" aria-hidden>
              *
            </span>
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            disabled={busy}
            className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="field-label">
            Email{" "}
            <span className="text-error" aria-hidden>
              *
            </span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={busy}
            className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="field-label">
          Message{" "}
          <span className="text-error" aria-hidden>
            *
          </span>
        </label>

        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          minLength={10}
          disabled={busy}
          placeholder="Write your message here..."
          className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3 text-base leading-relaxed text-primary-900 outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Submit */}
      <div className="pt-1">
        <Button type="submit" disabled={busy} className="min-w-44">
          {busy ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  );
}