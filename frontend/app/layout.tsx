import './globals.css'
import 'antd/dist/reset.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Video/Camera Demo',
    description: 'Video or camera source demo',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
        <body className={inter.className}>{children}</body>
        </html>
    )
}