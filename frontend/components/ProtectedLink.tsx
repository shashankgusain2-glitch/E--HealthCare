"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProtectedLinkProps {
    href: string;
    children: React.ReactNode;
    requireAuth?: boolean;
    requiredRoles?: string[];
    className?: string;
    [key: string]: any;
}

export default function ProtectedLink({ href, children, requireAuth = false, requiredRoles, className, ...props }: ProtectedLinkProps) {
    const { data: session, status } = useSession() as any;
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Wait for session to finish loading before denying access natively, optional but good practice
        // However, if we block immediately, it's safer.
        if (status === "loading") {
            return;
        }

        if (requireAuth && !session) {
            toast.error("Please sign in to access.");
            return;
        }

        if (requiredRoles && requiredRoles.length > 0) {
            const userRole = session?.user?.role;
            if (!userRole || !requiredRoles.includes(userRole)) {
                toast.error("Unauthorized: You do not have permission to access this area.");
                return;
            }
        }

        router.push(href);
    };

    return (
        <Link href={href} onClick={handleClick} className={className} {...props}>
            {children}
        </Link>
    );
}
