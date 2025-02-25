/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client to prevent errors
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pg: false,
        net: false,
        tls: false,
        dns: false,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        buffer: false,
        url: false,
        util: false,
        assert: false,
      };
      
      // Completely exclude pg and related modules from client bundle
      config.externals = [...(config.externals || []), 
        'pg', 
        'pg-pool', 
        'pg-protocol', 
        'pg-types', 
        'pgpass', 
        'pg-connection-string'
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
