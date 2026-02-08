import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { getImageUrl } from '../utils/imagePath';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`}>
                <div className="product-image">
                    <img src={getImageUrl(product.images[0])} alt={product.name || `${product.brand} ${product.model}`} />
                    {product.isVerified && (
                        <span className="card-badge verified">
                            <FaCheckCircle /> Verified
                        </span>
                    )}
                    {product.category && (
                        <span className="card-badge category">
                            {product.category}
                        </span>
                    )}
                </div>
                <div className="product-info">
                    <h3 className="model">{product.name || `${product.brand} ${product.model}`}</h3>
                    <h5 className="brand">{product.brand} • {product.model}</h5>
                    <p className="colorway">{product.colorway}</p>
                    <div className="price-row">
                        <span className="price">${product.price}</span>
                        <span className="size">US {product.size}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
