import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Analytics } from "@vercel/analytics/next"
import { Instrument_Sans } from 'next/font/google';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={instrumentSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        
        <RootProvider search={{enabled: true}}><Analytics />{children}</RootProvider>
      </body>
    </html>
  );
}
