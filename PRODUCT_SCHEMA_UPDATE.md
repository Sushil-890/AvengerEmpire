# Product Schema Update - Migration Guide

## Overview
This document outlines the major changes made to the product schema across the entire application (Backend, MobileApp, and Client).

## Changes Made

### New Product Fields
The product schema now includes two new required fields:

1. **name** (String, required) - The full product name (e.g., "Air Jordan 1 Retro High")
2. **category** (String, required, default: "Home") - Product category

### Field Order
The new field order when creating products:
1. **Name** - Product name
2. **Brand** - Brand name (e.g., Nike)
3. **Model** - Model name (e.g., Jordan 1)
4. **Category** - Product category (Home, Electronics, Fashion, Sneakers, Sports, Books, Toys, Other)
5. Other existing fields (colorway, size, condition, price, images, description, boxCondition)

## Files Modified

### Backend (server/)
1. **src/models/Product.js**
   - Added `name` field (required)
   - Added `category` field (required, default: 'Home')

2. **src/controllers/productController.js**
   - Updated `getProducts()` to search by name, brand, model, and category
   - Updated `createProduct()` to accept name and category fields

### Mobile App (MobileApp/)
1. **app/seller/add-product.tsx**
   - Added Product Name input field (first field)
   - Added Category selector with 8 categories
   - Updated form submission to include name and category
   - Improved UI with imperial theme support

2. **app/product/[id].tsx**
   - Updated Product interface to include name and category
   - Display product name as main title
   - Show brand and model as subtitle
   - Display category badge
   - Updated specifications section

3. **app/(drawer)/(tabs)/explore.tsx**
   - Updated Product interface
   - Display product name as main title
   - Show brand • model as subtitle
   - Display category badge on product cards
   - Updated search to include product name

4. **app/(drawer)/(tabs)/index.tsx**
   - Updated Product interface
   - Display product name on featured products
   - Show brand • model as subtitle

### Web Client (client/)
1. **src/pages/SellerDashboard.jsx**
   - Added Product Name input field (first field)
   - Added Category dropdown with 8 options
   - Updated form state to include name and category
   - Reorganized form layout for better UX

2. **src/pages/ProductDetailsPage.jsx**
   - Display product name as main title
   - Show brand • model as subtitle
   - Display category information
   - Updated cart item name

3. **src/components/ProductCard.jsx**
   - Display product name as main title
   - Show brand • model as subtitle
   - Added category badge display

4. **src/components/ProductCard.css**
   - Added styling for category badge
   - Positioned category badge on top-right

## Available Categories
- Home (default)
- Electronics
- Fashion
- Sneakers
- Sports
- Books
- Toys
- Other

## Database Migration

### Important Note
**All existing product data has been deleted** as mentioned by the user to accept the new schema changes.

### For Fresh Start
No migration needed - the new schema will be used for all new products.

### If You Need to Migrate Existing Data (Future Reference)
If you have existing products and need to migrate them:

```javascript
// MongoDB migration script
db.products.updateMany(
  { name: { $exists: false } },
  [
    {
      $set: {
        name: { $concat: ["$brand", " ", "$model"] },
        category: "Home"
      }
    }
  ]
);
```

## Testing Checklist

### Backend
- [ ] Create product with all new fields
- [ ] Search products by name
- [ ] Search products by category
- [ ] Verify default category is "Home"

### Mobile App
- [ ] Add product form displays all fields in correct order
- [ ] Category selector works properly
- [ ] Product details show name and category
- [ ] Product cards display correctly
- [ ] Search includes product name

### Web Client
- [ ] Seller dashboard form has all fields
- [ ] Category dropdown works
- [ ] Product cards show name and category
- [ ] Product details page displays correctly

## API Changes

### POST /api/products
**New Request Body:**
```json
{
  "name": "Air Jordan 1 Retro High",
  "brand": "Nike",
  "model": "Jordan 1",
  "category": "Sneakers",
  "colorway": "Chicago",
  "size": 10,
  "condition": "New",
  "price": 250,
  "images": ["path/to/image.jpg"],
  "description": "Classic sneaker",
  "boxCondition": "Good"
}
```

### GET /api/products?keyword=search
Now searches across:
- name
- brand
- model
- category

## Breaking Changes
⚠️ **Breaking Changes:**
- Products without `name` field will fail validation
- Old product creation requests without `name` will be rejected
- Product display components expect `name` field

## Rollback Plan
If you need to rollback:
1. Revert `server/src/models/Product.js` to remove name and category fields
2. Revert all controller, component, and page files
3. Restore database from backup (if available)

## Support
For issues or questions, refer to the git commit history or contact the development team.

---
**Last Updated:** February 8, 2026
**Version:** 2.0.0
