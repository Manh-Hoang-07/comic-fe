'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode, useTransition } from 'react';

interface OptimizedLinkProps extends LinkProps {
    children: ReactNode;
    className?: string;
    prefetch?: boolean;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Optimized Link component with instant navigation feedback
 * Shows loading state immediately when clicked
 */
export function OptimizedLink({
    children,
    href,
    prefetch = true,
    onClick,
    ...props
}: OptimizedLinkProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        // Call custom onClick if provided
        if (onClick) {
            onClick(e);
        }

        // Don't intercept if opening in new tab or with modifier keys
        if (
            e.ctrlKey ||
            e.metaKey ||
            e.shiftKey ||
            e.altKey ||
            e.defaultPrevented
        ) {
            return;
        }

        // For external links, let default behavior happen
        if (typeof href === 'string' && href.startsWith('http')) {
            return;
        }

        // Prevent default and use router for instant feedback
        e.preventDefault();

        startTransition(() => {
            router.push(href.toString());
        });
    };

    return (
        <Link
            href={href}
            prefetch={prefetch}
            onClick={handleClick}
            {...props}
            className={`${props.className || ''} ${isPending ? 'opacity-70 pointer-events-none' : ''}`}
        >
            {children}
        </Link>
    );
}


