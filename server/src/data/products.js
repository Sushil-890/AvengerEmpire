const products = [
    {
        brand: 'Nike',
        model: 'Air Jordan 1 High OG "Lost & Found"',
        colorway: 'Varsity Red/Black/Sail/Muslin',
        size: 10,
        condition: 'New',
        price: 450,
        images: ['https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Lost-and-Found-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1665037974'],
        description: 'The Air Jordan 1 Lost & Found brings back the famous Chicago colorway with a vintage look.',
        isVerified: true,
        qualityCheck: {
            boxLabel: true, stitching: true, sole: true, logo: true, material: true,
            scent: true, uvLight: true, productionDate: true, accessories: true, overall: true,
            verificationDate: new Date()
        },
        status: 'available'
    },
    {
        brand: 'Adidas',
        model: 'Yeezy Boost 350 V2 "Zebra"',
        colorway: 'White/Core Black/Red',
        size: 9.5,
        condition: 'Used - Like New',
        price: 320,
        images: ['https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1606321670'],
        description: 'One of the most popular Yeezy colorways.',
        isVerified: false,
        status: 'available'
    },
    {
        brand: 'Nike',
        model: 'Nike Dunk Low "Panda"',
        colorway: 'White/Black',
        size: 11,
        condition: 'New',
        price: 180,
        images: ['https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1611001968'],
        description: 'The clean black and white colorway makes this Dunk essential.',
        isVerified: true,
        qualityCheck: {
            boxLabel: true, stitching: true, sole: true, logo: true, material: true,
            scent: true, uvLight: true, productionDate: true, accessories: true, overall: true,
            verificationDate: new Date()
        },
        status: 'available'
    },
    {
        brand: 'Travis Scott x Nike',
        model: 'Air Jordan 1 Low OG "Reverse Mocha"',
        colorway: 'Sail/University Red/Ridgerock',
        size: 10.5,
        condition: 'New',
        price: 1200,
        images: ['https://images.stockx.com/images/Air-Jordan-1-Retro-Low-OG-SP-Travis-Scott-Reverse-Mocha-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&fm=webp&auto=compress&dpr=2&trim=color&updated_at=1658428172'],
        description: 'La Flame strikes again with earthy tones.',
        isVerified: true,
        qualityCheck: {
            boxLabel: true, stitching: true, sole: true, logo: true, material: true,
            scent: true, uvLight: true, productionDate: true, accessories: true, overall: true,
            verificationDate: new Date()
        },
        status: 'available'
    }
];

module.exports = products;
