/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

// module.exports = {
//   redirects: async () => {
//     return [
//       {
//         source: '/',
//         destination: '/login-page.html',
//         permanent: false,
//       },
//     ];
//   },
// };
