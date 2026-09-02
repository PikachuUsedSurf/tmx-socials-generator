import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Standalone output is only needed for the Docker build (see Dockerfile,
    // which copies .next/standalone and runs server.js). It conflicts with
    // Vercel's own build packaging (onBuildComplete fails looking for
    // next-server.js.nft.json), so it's skipped when building on Vercel,
    // which always sets the VERCEL env var during builds.
    output: process.env.VERCEL ? undefined : "standalone",
    turbopack: {
        root: __dirname,
    },
};

export default nextConfig;

