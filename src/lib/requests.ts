// Customer requests (orders, quotes, messages) — shared by the public forms and the admin panel.
import type { Locale } from "./i18n";
import { sendWhatsApp } from "./utils";

export const requestTypes = {
  order: "Cart order",
  purchase: "Purchase request",
  aluminium: "Aluminium quote",
  service: "Service request",
  kitchen: "Kitchen estimate",
  estimate: "Project estimate",
  message: "Contact message",
  supplier: "Supplier registration",
  customer: "Customer registration",
  review: "Product review",
} as const;

export type RequestType = keyof typeof requestTypes;

export const requestStatuses = {
  new: "New",
  accepted: "Accepted",
  completed: "Completed",
  rejected: "Rejected",
} as const;

export type RequestStatus = keyof typeof requestStatuses;

type Line = string | false | null | undefined;

export type RequestInput = {
  type: RequestType;
  lang: Locale;
  name?: FormDataEntryValue | string | null;
  phone?: FormDataEntryValue | string | null;
  email?: FormDataEntryValue | string | null;
  location?: FormDataEntryValue | string | null;
  total?: number | null;
  lines: Line[];
};

const makeRef = () =>
  `DK-${(Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 4)).toUpperCase()}`;

/** Saves the request for the admin panel in the background; returns its reference number. */
function save({ type, lang, name, phone, email, location, total, lines }: RequestInput) {
  const ref = makeRef();
  const [title, ...rest] = lines;
  const message = [title, `Ref: ${ref}`, ...rest];
  const text = (v: RequestInput["name"]) => (v ? String(v) : "");

  try {
    fetch("/api/orders", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref,
        type,
        lang,
        name: text(name),
        phone: text(phone),
        email: text(email),
        location: text(location),
        total: total ?? null,
        summary: message.filter((l) => l !== false && l !== null && l !== undefined).join("\n"),
      }),
    }).catch(() => {});
  } catch {}
  return { ref, message };
}

export const saveRequest = (input: RequestInput) => save(input).ref;

/**
 * Saves the request and opens WhatsApp with the same text (including the reference number).
 * WhatsApp opens synchronously inside the click handler so browsers never block the new tab.
 */
export function submitRequest(input: RequestInput) {
  const { ref, message } = save(input);
  sendWhatsApp(message);
  return ref;
}
