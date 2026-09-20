/**
 * External API integration (US-07).
 * Fetches an inspirational quote from the public DummyJSON quotes service.
 * No API key is required. A bundled quote is served if the network fails.
 */

const API_BASE = 'https://dummyjson.com';
const REQUEST_TIMEOUT = 8000;

const FALLBACK_QUOTES = [
  { content: 'The present moment is the only moment available to us, and it is the door to all moments.', author: 'Thich Nhat Hanh' },
  { content: 'Quiet the mind, and the soul will speak.', author: 'Ma Jaya Sati Bhagavati' },
  { content: 'Meditation is not evasion; it is a serene encounter with reality.', author: 'Thich Nhat Hanh' },
];

function pickFallback() {
  const quote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  return { ...quote, source: 'fallback' };
}

/**
 * fetch() that always settles: it rejects once the timeout elapses even if the
 * underlying request never resolves. Relying on AbortController alone is not
 * enough on every platform, so the race guarantees the UI leaves its loading state.
 */
function fetchWithTimeout(url, ms = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms)
  );
  return Promise.race([fetch(url, { signal: controller.signal }), timeout]);
}

/**
 * Retrieve one inspirational quote.
 * @returns {Promise<{content: string, author: string, source: string}>}
 */
export async function fetchDailyQuote() {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/quotes/random`);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.quote,
      author: data.author,
      source: 'api',
    };
  } catch (error) {
    console.warn('[api] fetchDailyQuote failed, serving fallback:', error.message);
    return pickFallback();
  }
}

/**
 * Retrieve several quotes at once, used by the inspiration carousel.
 * @param {number} limit
 */
export async function fetchQuoteList(limit = 5) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/quotes?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return (data.quotes || []).map((q) => ({
      content: q.quote,
      author: q.author,
      source: 'api',
    }));
  } catch (error) {
    console.warn('[api] fetchQuoteList failed, serving fallback:', error.message);
    return FALLBACK_QUOTES.map((q) => ({ ...q, source: 'fallback' }));
  }
}
