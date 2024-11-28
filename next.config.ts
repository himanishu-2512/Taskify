module.exports = {
  
    typescript: {
      ignoreBuildErrors: true,
    },  
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

