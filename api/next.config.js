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

//Change file extension for the file from ".js" to ".cjs"
//Add "type": "module" property in "package.json"