import Providers from './providers';
import '@/styles/index.css';

export const metadata = {
  title: 'DevPulse',
  description: 'Live developer analytics dashboard',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
