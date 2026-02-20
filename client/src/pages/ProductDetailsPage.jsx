import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { listProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { FaCheckCircle, FaShippingFast, FaShieldAlt } from 'react-icons/fa';
import { getImageUrl } from '../utils/imagePath';
import '../Style/ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.product);
    const { product, loading, error } = productDetails;
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(listProductDetails(id));
    }, [dispatch, id]);

    const addToCartHandler = () => {
        dispatch(addToCart({
            product: product._id,
            name: product.name || `${product.brand} ${product.model}`,
            image: product.images[0],
            price: product.price,
            countInStock: 1, // Unique items usually
            qty: 1
        }));
        navigate('/cart');
    };

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container">{error}</div>;
    if (!product || !product.images) return null;

    return (
        <div className="container product-details-page animate-fade-in">
            <div className="product-layout">
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={getImageUrl(product.images[0])} alt={`${product.brand} ${product.model}`} />
                    </div>
                    <div className="image-grid">
                        {product.images.map((img, index) => (
                            <img key={index} src={getImageUrl(img)} alt="" className="thumb" />
                        ))}
                    </div>
                </div>

                <div className="product-info-panel">
                    <h1 className="product-title">{product.name || `${product.brand} ${product.model}`}</h1>
                    <h2 className="brand-title">{product.brand} • {product.model}</h2>
                    {product.category && <p className="product-category">Category: {product.category}</p>}
                    <p className="product-colorway">{product.colorway}</p>

                    <div className="price-section">
                        <h2>₹{product.price}</h2>
                        {product.isVerified && (
                            <span className="verified-badge"><FaCheckCircle /> Authenticity Verified</span>
                        )}
                    </div>

                    <div className="size-selector">
                        <span>Size: US {product.size}</span>
                        <span>Condition: {product.condition}</span>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn btn-block"
                            onClick={addToCartHandler}
                            disabled={product.status === 'sold' || (userInfo && (product.seller === userInfo._id || product.seller?._id === userInfo._id))}
                            style={{
                                opacity: (product.status === 'sold' || (userInfo && (product.seller === userInfo._id || product.seller?._id === userInfo._id))) ? 0.5 : 1,
                                cursor: (product.status === 'sold' || (userInfo && (product.seller === userInfo._id || product.seller?._id === userInfo._id))) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {product.status === 'sold' ? 'Sold Out' : (userInfo && (product.seller === userInfo._id || product.seller?._id === userInfo._id)) ? 'Your Product' : 'Add to Cart'}
                        </button>
                    </div>

                    <div className="trust-features">
                        <div className="feature">
                            <FaShieldAlt style={{ fontSize: '1.5rem', color: 'var(--success)' }} />
                            <div>
                                <h4>10-Point Verification</h4>
                                <p>Every item is verified by our experts.</p>
                            </div>
                        </div>
                        <div className="feature">
                            <FaShippingFast style={{ fontSize: '1.5rem' }} />
                            <div>
                                <h4>Fast Delivery</h4>
                                <p>Ships within 24 hours of verification.</p>
                            </div>
                        </div>
                    </div>

                    {product.qualityCheck && (
                        <div className="quality-check-details">
                            <h3>Authentication Check</h3>
                            <ul>
                                {Object.entries(product.qualityCheck).map(([key, value]) => {
                                    if (key === '_id' || key === 'verifiedBy' || key === 'verificationDate') return null;
                                    return (
                                        <li key={key} className={value ? 'passed' : 'pending'}>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            <strong>{value ? ' PASSED' : ' PENDING'}</strong>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
