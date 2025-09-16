import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      {/* Main Glass Panel */}
      <div className="glass-panel w-full max-w-4xl">
        <div className="flex flex-col items-center text-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/firebase-www-2023.appspot.com/o/firebase-logo.svg?alt=media&token=3b378a63-b0f3-424a-9524-2198033663a8"
              alt="Firebase Logo"
              width={50}
              height={50}
              className="h-auto w-[50px]"
            />
            <span className="text-4xl font-bold">+</span>
            <Image
              src="https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.svg"
              alt="Next.js Logo"
              width={100}
              height={50}
              className="h-auto w-[100px]"
            />
          </div>

          {/* Title and Description */}
          <h1 className="text-5xl font-bold mb-2">
            Firebase Studio <span style={{ color: 'var(--accent-luminous)' }}>Enhanced</span>
          </h1>

          <p className="text-lg text-secondary max-w-2xl mb-8" style={{color: 'var(--text-secondary)'}}>
            This is your Next.js starter project, now styled with the Dark Liquid Glass theme.
            Edit <code>src/app/page.tsx</code> to start building your application.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              className="glass-panel !py-3 !px-6 !rounded-lg font-semibold border-accent-luminous hover:bg-[var(--accent-luminous)] hover:text-black"
            >
              Get Started
            </button>
            <button 
              className="py-3 px-6 font-semibold hover:text-[var(--accent-luminous)]"
            >
              Learn More →
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
