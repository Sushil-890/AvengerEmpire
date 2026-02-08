const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                $or: [
                    {
                        name: {
                            $regex: req.query.keyword,
                            $options: 'i',
                        },
                    },
                    {
                        brand: {
                            $regex: req.query.keyword,
                            $options: 'i',
                        },
                    },
                    {
                        model: {
                            $regex: req.query.keyword,
                            $options: 'i',
                        },
                    },
                    {
                        category: {
                            $regex: req.query.keyword,
                            $options: 'i',
                        },
                    },
                ],
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
    const {
        name,
        brand,
        model,
        category,
        colorway,
        size,
        condition,
        price,
        images,
        description,
        boxCondition
    } = req.body;

    const product = new Product({
        seller: req.user._id,
        name,
        brand,
        model,
        category: category || 'Home',
        colorway,
        size,
        condition,
        price,
        images,
        description,
        boxCondition,
        isVerified: false
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update product verification (Admin only)
// @route   PUT /api/products/:id/verify
// @access  Private/Admin
const verifyProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        product.isVerified = true;
        product.qualityCheck = req.body.qualityCheck || product.qualityCheck;
        product.qualityCheck.verifiedBy = req.user._id;
        product.qualityCheck.verificationDate = Date.now();

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    verifyProduct
};
