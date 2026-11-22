/**
 * dsh-nexus-skin — host half.
 *
 * The skin itself is pure client material: a registered theme (tokens) plus a
 * stylesheet that paints the glass surfaces. The theme runtime lives in the
 * browser, so the host entry has nothing durable to do — it exists because the
 * profile patch inserts a loader entry for this package, and a loader entry
 * needs a module with an `apply` export.
 */
export const name = 'nexus-skin';

export function apply() {
  // Intentionally empty: no host service, no persistence, no network.
}
