import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StateMessage } from "@/components/shared/StateMessage";
import { ApiClientError } from "@/lib/api/client";
import { submitContact } from "@/lib/api/resources";

const GIVING_PURPOSES = [
  "General Giving",
  "Tithes",
  "Offering",
  "Missions",
  "Building / Development",
  "Community Outreach",
  "Other",
] as const;

const PAYMENT_METHODS = [
  "Orange Money",
  "Mobile Money",
  "Bank transfer",
  "In person",
  "Other",
] as const;

const GIVING_CURRENCIES = ["LRD", "USD"] as const;

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Submits through the existing /api/contact system (there is no dedicated giving-
 * request backend yet). The structured fields are composed into the message body,
 * and the subject is tagged "Giving request" so it's identifiable in the admin
 * inbox. Reusing this endpoint requires a valid email (its validation is strict),
 * which is why the email field below is now required rather than optional — the
 * one structural change this needed. See the milestone report for the alternative
 * (a dedicated giving-request model) if that's preferred instead.
 */
export function GivingRequestForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("contact") ?? "");
    const purpose = String(formData.get("toward") ?? "");
    const amount = String(formData.get("amount") ?? "");
    const currency = String(formData.get("currency") ?? "");
    const method = String(formData.get("method") ?? "");
    const note = String(formData.get("note") ?? "");

    const message = [
      `Giving purpose: ${purpose}`,
      `Amount: ${amount} ${currency}`,
      `Preferred method: ${method}`,
      note ? `Note: ${note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setState("submitting");
    try {
      await submitContact({
        name,
        email,
        phone: phone || undefined,
        subject: "Giving request",
        message,
      });
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.");
    }
  }

  const busy = state === "submitting";

  return (
    <section id="giving-request" className="bg-surface py-20 sm:py-12">
      <Container>
        {state === "success" ? (
          <div className="mx-auto max-w-2xl">
            <StateMessage
              title="Request received"
              description="Thank you. Someone from NFPC will contact you with the next steps for your preferred payment method."
              action={
                <Button variant="secondary" onClick={() => setState("idle")}>
                  Submit another request
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Intro */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <h2 className="mt-6 max-w-md font-display text-5xl font-semibold leading-[0.98] tracking-tight text-primary-900 sm:text-6xl lg:text-7xl">
                  Let&apos;s take the next step.
                </h2>

                <p className="mt-7 max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
                  Tell us what you&apos;d like to give and how you&apos;d prefer
                  to make your gift. Our team will contact you with the payment
                  instructions.
                </p>

                <p className="mt-8 max-w-md border-l-2 border-accent-500 pl-5 text-sm leading-relaxed text-text-muted">
                  You do not need to provide any PIN, password, card number, or
                  other sensitive payment information.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} noValidate>
                {state === "error" && (
                  <p role="alert" className="mb-8 border-l-2 border-error pl-4 text-sm leading-relaxed text-error">
                    {errorMessage || "Your request could not be sent. Please try again."}
                  </p>
                )}

                {/* Contact information */}
                <div className=" py-8 sm:py-10">
                  <p className="font-display text-2xl font-semibold text-primary-900">
                    Your information
                  </p>

                  <div className="mt-7 space-y-7">
                    {/* Full name + Phone */}
                    <div className="grid gap-7 sm:grid-cols-2">
                      <div>
                        <label htmlFor="give-name" className="field-label">
                          Full name
                        </label>

                        <input
                          id="give-name"
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
                        <label htmlFor="give-contact" className="field-label">
                          Phone number
                        </label>

                        <input
                          id="give-contact"
                          name="contact"
                          type="tel"
                          autoComplete="tel"
                          required
                          disabled={busy}
                          className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <p className="field-help">
                          We&apos;ll use this to contact you with the next steps
                          for your gift.
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="give-email" className="field-label">
                        Email address
                      </label>

                      <input
                        id="give-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={busy}
                        className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Giving details */}
                <div className="pt-8 sm:pt-10">
                  <p className="font-display text-2xl font-semibold text-primary-900">
                    Your gift
                  </p>

                  <div className="mt-7 space-y-7">
                    {/* Giving purpose */}
                    <div>
                      <label htmlFor="give-toward" className="field-label">
                        What would you like to give toward?
                      </label>

                      <select
                        id="give-toward"
                        name="toward"
                        required
                        defaultValue=""
                        disabled={busy}
                        className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors focus:border-accent-500 focus:ring-0"
                      >
                        <option value="" disabled>
                          Choose a giving purpose
                        </option>

                        {GIVING_PURPOSES.map((purpose) => (
                          <option key={purpose} value={purpose}>
                            {purpose}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount + Currency */}
                    <div className="grid gap-7 sm:grid-cols-2">
                      <div>
                        <label htmlFor="give-amount" className="field-label">
                          Amount
                        </label>

                        <input
                          id="give-amount"
                          name="amount"
                          type="text"
                          inputMode="decimal"
                          placeholder="0.00"
                          required
                          disabled={busy}
                          className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label htmlFor="give-currency" className="field-label">
                          Currency
                        </label>

                        <select
                          id="give-currency"
                          name="currency"
                          defaultValue=""
                          required
                          disabled={busy}
                          className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors focus:border-accent-500 focus:ring-0"
                        >
                          <option value="" disabled>
                            Choose currency
                          </option>

                          {GIVING_CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Payment method */}
                    <div>
                      <label htmlFor="give-method" className="field-label">
                        Preferred payment method
                      </label>

                      <select
                        id="give-method"
                        name="method"
                        required
                        defaultValue=""
                        disabled={busy}
                        className="mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-3 text-base text-primary-900 outline-none transition-colors focus:border-accent-500 focus:ring-0"
                      >
                        <option value="" disabled>
                          Choose a method
                        </option>

                        {PAYMENT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Additional note */}
                    <div>
                      <label htmlFor="give-note" className="field-label">
                        Additional note
                        <span className="ml-2 font-normal text-text-muted">
                          (optional)
                        </span>
                      </label>

                      <textarea
                        id="give-note"
                        name="note"
                        rows={3}
                        disabled={busy}
                        placeholder="Anything else you'd like the church to know?"
                        className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3 text-base leading-relaxed text-primary-900 outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-8 sm:pt-10">
                  <Button type="submit" disabled={busy} className="w-full sm:w-auto">
                    {busy ? "Sending..." : "Send giving request"}
                  </Button>

                  <p className="mt-4 text-xs leading-relaxed text-text-muted">
                    Your request will be followed up by the NFPC team.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
