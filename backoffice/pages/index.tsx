import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Redirect gốc về dashboard admin
export default function RootRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace('/admin'); }, [router]);
    return null;
}
