import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <div className={'flex items-center gap-4 bg-background px-4 py-2'}>
            <ul>
                <li>
                    <Link href="#">HOME</Link>
                </li>
                <li>
                    <Link href="#">NEW ARRIVALS</Link>
                </li>
                <li>
                    <Link href="#">MOST POPULAR</Link>
                </li>
                <li>
                    <Link href="#">SHOP</Link>
                </li>
            </ul>
        </div>
    );
}
