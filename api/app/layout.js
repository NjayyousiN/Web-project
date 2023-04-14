import './globals.css'

export const metadata = {
  title: 'ConfPlus',
  description: 'Our Beautiful ConfPlus Website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
