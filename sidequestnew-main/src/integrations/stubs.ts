// === Integration Stubs matching Express backend API ===

// ── Navigator (Gemini + Google Search grounding) ──────────────────────────────

export interface Waypoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
}

const RADIUS_BY_MODE: Record<string, number> = {
  walk: 2,
  car: 15,
  cycle: 7,
};

export async function findWaypoints(
  lat: number,
  lng: number,
  theme: string,
  travelMode: 'walk' | 'car' | 'cycle' = 'walk',
  stops: number = 3
): Promise<{ waypoints: Waypoint[] }> {
  console.log(`[Navigator Stub] findWaypoints(${lat}, ${lng}, "${theme}", "${travelMode}", ${stops}) — radius ${RADIUS_BY_MODE[travelMode] ?? 2}km`);
  // Simulated waypoints
  return {
    waypoints: Array.from({ length: stops }, (_, i) => ({
      name: `${theme} Spot ${i + 1}`,
      address: `${100 + i} Main St`,
      lat: lat + (Math.random() - 0.5) * 0.01,
      lng: lng + (Math.random() - 0.5) * 0.01,
      description: `A hidden ${theme.toLowerCase()} gem worth exploring.`,
    })),
  };
}

// ── Vault (Supabase Storage presigned uploads) ────────────────────────────────

export interface PresignedUpload {
  uploadUrl: string;
  token: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
}

export async function createPresignedUploadUrl(
  filename: string,
  contentType: string = 'application/octet-stream',
  expiresIn: number = 600
): Promise<PresignedUpload> {
  console.log(`[Vault Stub] createPresignedUploadUrl("${filename}", "${contentType}", ${expiresIn})`);
  const ext = filename.includes('.') ? filename.split('.').pop() : 'bin';
  const key = `uploads/${crypto.randomUUID()}.${ext}`;
  return {
    uploadUrl: `https://example.com/storage/v1/upload/sign/${key}`,
    token: 'stub-token-' + Date.now(),
    key,
    publicUrl: `https://example.com/storage/v1/object/public/sidequest-uploads/${key}`,
    expiresIn,
  };
}

// ── Rewards (Solana cNFT minting via Metaplex Bubblegum) ─────────────────────

export interface MintResult {
  signature: string;
  explorerUrl: string;
  leafIndex: number;
}

export interface BadgeMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints?: number;
}

export async function mintBadge(
  recipientAddress: string,
  metadata: BadgeMetadata,
  treeAddress?: string
): Promise<MintResult> {
  console.log(`[Rewards Stub] mintBadge("${recipientAddress}", ${JSON.stringify(metadata)}, "${treeAddress ?? 'default-tree'}")`);
  const sig = Array.from({ length: 64 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
  return {
    signature: sig,
    explorerUrl: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
    leafIndex: Math.floor(Math.random() * 10000),
  };
}

// ── Auth0 (unchanged) ────────────────────────────────────────────────────────

export async function authSignIn(_provider: 'apple' | 'google' | 'guest'): Promise<{ userId: string; name: string }> {
  console.log('[Auth0 Stub] Signing in...');
  return { userId: 'u_' + Math.random().toString(36).slice(2, 8), name: 'Explorer' };
}

// ── Snowflake analytics (unchanged) ──────────────────────────────────────────

export async function sendAnalyticsEvent(_event: string, _data: Record<string, unknown>): Promise<void> {
  console.log('[Snowflake Stub] Sending event:', _event, _data);
}

// ── Gemini AI helpers (kept for in-app features) ─────────────────────────────

export async function analyzeMemoryPhoto(_imageUrl: string): Promise<{ vibeTags: string[]; category: string; captionSuggestions: string[] }> {
  console.log('[Gemini Stub] Analyzing photo...');
  return { vibeTags: ['cozy', 'golden hour', 'urban'], category: 'Art', captionSuggestions: ['A hidden gem in the city', 'Discovered something magical today'] };
}

export async function generateRouteStory(_mode: string, _stopTypes: string[]): Promise<string> {
  console.log('[Gemini Stub] Generating route story...');
  return 'A winding path through the city\'s creative heart — where murals meet matcha and every corner tells a story.';
}

// ── ElevenLabs (unchanged) ───────────────────────────────────────────────────

export async function generateAudioGuide(_spotName: string, _description: string): Promise<string> {
  console.log('[ElevenLabs Stub] Generating audio guide...');
  return 'https://example.com/audio-guide-placeholder.mp3';
}

// ── API base URL (Vultr-hosted) ──────────────────────────────────────────────

export const API_BASE_URL = 'https://api.sidequest.app/v1';
