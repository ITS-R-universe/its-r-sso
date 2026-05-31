import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'ITS-R SSO — Single Sign-On', description: 'ITS-R Universe Single Sign-On System' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
