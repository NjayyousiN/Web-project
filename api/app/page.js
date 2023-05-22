"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  useEffect(() => {
    // Redirect to the login page on the client-side
    if (typeof window !== 'undefined') {
      const router = useRouter();
      router.push('/login-page.html');
    }
  }, []);

  return null;
}
