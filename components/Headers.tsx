"use client";

import { useState } from 'react';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';

export default function Headers() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-end space-x-4 items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}