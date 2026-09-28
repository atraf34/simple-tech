const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export function toBengaliNumber(input: number | string): string {
  return input
    .toString()
    .replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Formats a plain number as "৳ ১,৮৫০" with Bengali digits + thousands separators. */
export function formatBDT(amount: number): string {
  const withCommas = amount.toLocaleString("en-IN"); // en-IN gives 1,850 style grouping
  return `৳ ${toBengaliNumber(withCommas)}`;
}
