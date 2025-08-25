import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from '@/lib/animations';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </motion.div>
    );
};

export default ProductsGrid;