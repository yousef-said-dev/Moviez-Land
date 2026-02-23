import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/store/Provider";
import { auth } from '@/lib/next-Auth'
import SideBar from "@/componnets/SideBar";
import Navbar from "@/componnets/navbar";
import { Toaster } from 'sonner';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoviezLand",
  description: "MoviezLand - Your Personal Movie Tracker",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-900 antialiased`}
      >
        <Provider session={session}>
          <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 flex flex-col md:ml-64 relative min-w-0">
              <Navbar />
              <main className="flex-1 pt-20">
                {children}
              </main>
              <Toaster richColors position="top-right" />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}

