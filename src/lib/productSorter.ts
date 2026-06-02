import { Product } from '@/types';

/**
 * Complex deterministic product ordering algorithm.
 *
 * The "featured" sort order is computed via a multi-factor composite score:
 *
 *  score = w1 * normalizedRating
 *        + w2 * normalizedReviewCount   (popularity)
 *        + w3 * normalizedDiscountPct   (discount attractiveness)
 *        + w4 * stockBonus             (in-stock items get a boost)
 *        + w5 * priceAffordability     (inverse-normalised price – cheaper = more accessible)
 *        + w6 * tagDiversityBonus      (more tags = richer product)
 *        + w7 * idPrimeBonus           (products whose id is a prime number get a small editorial boost)
 *
 * Every factor is normalised to [0, 1] before weighting so no single
 * raw metric can dominate.  After computing the raw float score each
 * product's score is further jittered by a lightweight, fully
 * deterministic pseudo-random offset derived from a xorshift32 hash of
 * the product-id string — this guarantees the order looks organic and
 * never trivially sequential, yet is 100% reproducible across renders
 * and sessions without any stored state.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Clamp a value to [0, 1] */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Min-max normalise an array of numbers to [0, 1]. */
function minMaxNorm(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return values.map(() => 0.5);
  return values.map(v => (v - min) / range);
}

/**
 * Deterministic pseudo-random float in [0, 1) derived from a string key
 * using a xorshift32-based hash.  Produces the same value for the same
 * input every time – no Math.random() involved.
 */
function deterministicJitter(key: string): number {
  let h = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = (Math.imul(h, 0x01000193) | 0) >>> 0; // FNV prime, keep 32-bit unsigned
  }
  // xorshift32 pass for extra mixing
  h ^= h << 13;
  h = h >>> 0;
  h ^= h >> 17;
  h = h >>> 0;
  h ^= h << 5;
  h = h >>> 0;
  // Map to [0, 1)
  return h / 0x100000000;
}

/** Check whether n is a prime number (used for editorial boost). */
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Weights (must sum to 1 for a clean [0, 1] composite output)
// ---------------------------------------------------------------------------
const W_RATING       = 0.28; // quality signal
const W_REVIEWS      = 0.22; // popularity / social proof
const W_DISCOUNT     = 0.18; // deal attractiveness
const W_STOCK        = 0.12; // availability
const W_AFFORDABILITY = 0.10; // price accessibility (inverse)
const W_TAG_DIVERSITY = 0.05; // catalogue richness
const W_PRIME_BONUS  = 0.03; // editorial / fun signal
const W_JITTER       = 0.02; // deterministic organic shuffle

// Compile-time assertion (dev aid)
const _WEIGHT_SUM =
  W_RATING + W_REVIEWS + W_DISCOUNT + W_STOCK +
  W_AFFORDABILITY + W_TAG_DIVERSITY + W_PRIME_BONUS + W_JITTER;

if (Math.abs(_WEIGHT_SUM - 1) > 1e-9) {
  console.warn(`[productSorter] Weights sum to ${_WEIGHT_SUM}, expected 1.0`);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export type ProductWithScore = Product & { _featuredScore: number };

/**
 * Returns a new array of products sorted by the composite featured score
 * (descending – highest score first).  The original array is not mutated.
 */
export function sortByFeatured(products: Product[]): Product[] {
  if (products.length === 0) return [];

  // --- Gather raw vectors ---
  const ratings      = products.map(p => p.rating);
  const reviews      = products.map(p => p.reviewCount);
  const prices       = products.map(p => p.price);
  const discounts    = products.map(p =>
    p.originalPrice ? (p.originalPrice - p.price) / p.originalPrice : 0
  );
  const tagCounts    = products.map(p => p.tags.length);

  // --- Normalise vectors ---
  const normRatings      = minMaxNorm(ratings);
  const normReviews      = minMaxNorm(reviews);
  const normAffordability = minMaxNorm(prices).map(v => 1 - v); // invert: lower price → higher score
  const normDiscounts    = minMaxNorm(discounts);
  const normTagDiversity = minMaxNorm(tagCounts);

  // --- Compute composite scores ---
  const scored: ProductWithScore[] = products.map((p, i) => {
    const stockBonus    = p.inStock ? 1 : 0;
    const primeBonus    = isPrime(parseInt(p.id, 10)) ? 1 : 0;
    const jitter        = deterministicJitter(p.id);

    const score =
      W_RATING        * clamp01(normRatings[i]) +
      W_REVIEWS       * clamp01(normReviews[i]) +
      W_DISCOUNT      * clamp01(normDiscounts[i]) +
      W_STOCK         * stockBonus +
      W_AFFORDABILITY * clamp01(normAffordability[i]) +
      W_TAG_DIVERSITY * clamp01(normTagDiversity[i]) +
      W_PRIME_BONUS   * primeBonus +
      W_JITTER        * jitter;

    return { ...p, _featuredScore: score };
  });

  // --- Sort descending by score ---
  scored.sort((a, b) => {
    const diff = b._featuredScore - a._featuredScore;
    // Stable secondary sort: by id so ties are always resolved identically
    if (Math.abs(diff) < 1e-12) return a.id.localeCompare(b.id);
    return diff;
  });

  // Strip internal score before returning
  return scored.map(({ _featuredScore: _s, ...p }) => p as Product);
}
