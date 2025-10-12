'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8090/api/hello')
      .then(res => res.text())
      .then(setMessage)
      .catch(() => setMessage('Error connecting to backend.'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Next.js + Spring Boot</h1>
      <p className="text-lg">{message}</p>
    </main>
  );
}