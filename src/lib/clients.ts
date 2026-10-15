/**
 * Client logos for the homepage trust strip.
 *
 * Drop real client logos into `public/logos/` and add entries below, e.g.:
 *   { name: "Acme Legal", logoSrc: "/logos/acme-legal.svg" }
 *
 * Leave empty until you have logos you are licensed to display. When empty the
 * strip renders an honest "Industries we support" line instead of fake logos —
 * never ship invented client marks.
 */
export interface ClientLogo {
  name: string;
  logoSrc?: string;
  /** Optional href to the client or a case study. */
  href?: string;
}

export const clientLogos: ClientLogo[] = [];

/**
 * SMB verticals we regularly support in Tampa Bay. This is an offering
 * statement (who we work with), not a client list — safe to show by default.
 */
export const industriesServed: string[] = [
  "Law firms",
  "Medical & dental",
  "Accounting & tax",
  "Real estate",
  "Trades & contractors",
  "Retail & e-commerce",
  "Nonprofits",
  "Restaurants & hospitality",
  "Professional services",
  "Property management",
];
