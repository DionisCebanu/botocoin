import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Breadcrumbs = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-warm-gray">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        {item.href ? (
                            <Link to={item.href} className="hover:text-chocolate-brown dark:hover:text-soft-cream transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-semibold text-chocolate-brown dark:text-soft-cream">{item.label}</span>
                        )}
                        {index < items.length - 1 && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;