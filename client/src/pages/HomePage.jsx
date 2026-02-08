import React, { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import '../Style/HomePage.css';

const HomePage = () => {
    const { keyword } = useParams();
    const location = useLocation();
    const isShopPage = location.pathname === '/shop';

    const dispatch = useDispatch();
    const productList = useSelector((state) => state.product);
    const { products, loading, error } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword));
    }, [dispatch, keyword]);

    return (
        <div className="home-page animate-fade-in">
            {!keyword && !isShopPage && (
                <section className="hero">
                    <div className="hero-content">
                        <h1>IMPERIAL STYLE<span>FOR ROYALTY</span></h1>
                        <p>Discover our exclusive selection of verified premium artifacts and limited-edition sneakers.</p>
                        <Link to="/shop" className="btn">Shop Collection</Link>
                    </div>
                </section>
            )}

            <section className="container section">
                <div className="section-header">
                    <h2>{keyword ? `Search Results for "${keyword}"` : isShopPage ? 'All Products' : 'Latest Drops'}</h2>
                    {(!keyword && !isShopPage) && <Link to="/shop" className="view-all">View All</Link>}
                </div>

                {loading ? (
                    <div className="loader">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="product-grid">
                        {products && products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;
