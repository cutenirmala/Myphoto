import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyPhotos - Your Personal Photo Gallery',
  description: 'Upload, organize, and share your photos and videos with MyPhotos.',
  keywords: 'photo gallery, video management, cloud storage, photo sharing',
  openGraph: {
    title: 'MyPhotos - Your Personal Photo Gallery',
    description: 'Upload, organize, and share your photos and videos with MyPhotos.',
    url: 'https://myphotos.app',
    siteName: 'MyPhotos',
    images: [
      {
        url: 'https://myphotos.app/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyPhotos - Your Personal Photo Gallery',
    description: 'Upload, organize, and share your photos and videos with MyPhotos.',
    images: ['https://myphotos.app/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
