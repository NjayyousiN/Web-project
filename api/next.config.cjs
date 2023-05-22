/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

module.exports = {
  redirects: async() => {
    return [
      {
        source: 'http://localhost:3000/',
        destination: 'http://localhost:3000/login-page.html',
        permanent: true,
      }
    ]
  }
}