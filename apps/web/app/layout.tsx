import './globals.css';
import { Providers } from './providers';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'MilCalc',
  description: 'Military Calculators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="bg-background text-text min-h-screen">
            <Navbar />
            <main className="container mx-auto p-4">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}