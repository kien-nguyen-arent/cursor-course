import Image from "next/image";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";

// Import specific CSS module
import styles from "./page.module.css";

// Import local SVGs
import NextJSLogo from '../../public/next.svg';
import VercelLogo from '../../public/vercel.svg';
import FileSVG from '../../public/file.svg';
import WindowSVG from '../../public/window.svg';
import GlobeSVG from '../../public/globe.svg';

export default function Home() {
  // Create absolute URL based on NEXTAUTH_URL or fallback to localhost
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  return (
    <div className={`${styles.main} bg-white dark:bg-gray-900`}>
      {/* Google Sign In button - fixed position */}
      <div className={styles.auth}>
        <LoginButton />
      </div>
      
      <div className={styles.container}>
        <main className="py-16 flex flex-col items-center">
          {/* Next.js Logo */}
          <div className="mb-12">
            <Image
              className="dark"
              src={NextJSLogo}
              alt="Next.js logo"
              width={300}
              height={100}
            />
          </div>
          
          {/* Instructions */}
          <ol className="list-decimal pl-6 mb-10 self-start text-gray-700 dark:text-gray-300">
            <li className="mb-4">
              Get started by editing{" "}
              <code className="px-2 py-1 font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded">
                src/app/page.js
              </code>
            </li>
            <li>
              Save and see your changes instantly.
            </li>
          </ol>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              <Image
                src={VercelLogo}
                alt="Vercel Logo"
                width={16}
                height={16}
                className="mr-2 dark:invert"
              />
              Deploy Now
            </a>
            
            <Link
              href="/dashboards"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              style={{ backgroundColor: 'lightgreen' }}
            >
              API Dashboard
            </Link>
            
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              Read Docs
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className="flex space-x-6 text-gray-600 dark:text-gray-400">
            <a
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Image 
                src={FileSVG}
                alt="Learn icon" 
                width={16} 
                height={16} 
                className="mr-2 opacity-70" 
              />
              Learn
            </a>
            
            <a
              href="https://vercel.com/templates"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Image 
                src={WindowSVG}
                alt="Templates icon" 
                width={16} 
                height={16} 
                className="mr-2 opacity-70" 
              />
              Templates
            </a>
            
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Image 
                src={GlobeSVG}
                alt="Next.js icon" 
                width={16} 
                height={16} 
                className="mr-2 opacity-70" 
              />
              Next.js
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
