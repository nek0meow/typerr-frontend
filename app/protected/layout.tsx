import { AppRoute, AuthorizationStatus } from '@/const/const';
import { useRouter } from 'next/navigation';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const auth = AuthorizationStatus.Auth

    if (auth !== AuthorizationStatus.Auth) {
        return router.push(AppRoute.Login);
    }

    return <>{children}</>;
}