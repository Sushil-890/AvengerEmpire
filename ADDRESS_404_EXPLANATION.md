# Address 404 Error - Expected Behavior

## Overview
The 404 error you're seeing when accessing `/api/address` is **EXPECTED BEHAVIOR** and not an actual error.

## Why This Happens

### First Time Users
When a user accesses the address page for the first time, they don't have an address saved in the database yet. The API correctly returns a 404 status code with the message "No address found".

### API Response Flow
```
User opens Address page
  ↓
App calls GET /api/address
  ↓
Backend checks database for user's address
  ↓
No address found
  ↓
Returns 404 with message: "No address found"
  ↓
App catches 404 error
  ↓
App shows empty form for user to create address
```

## This is NOT an Error

The 404 response is the correct HTTP status code for "resource not found". It's how the app knows whether to:
- Show an empty form (404 = no address exists)
- Show a pre-filled form (200 = address exists)

## How the App Handles It

### Mobile App (`MobileApp/app/address.tsx`)
```typescript
const fetchAddress = async () => {
    try {
        const { data } = await api.get('/address');
        setAddress(data);
        setHasAddress(true);
    } catch (error: any) {
        if (error.response?.status === 404) {
            // No address found - user can create one
            setHasAddress(false);
            console.log('No address found - user can create one');
        } else {
            // Actual error
            console.error('Error fetching address:', error);
            Alert.alert('Error', 'Failed to load address. Please try again.');
        }
    } finally {
        setLoading(false);
    }
};
```

### Backend (`server/src/controllers/addressController.js`)
```javascript
const getUserAddress = async (req, res) => {
    try {
        const address = await Address.findOne({ user: req.user._id });
        
        if (!address) {
            return res.status(404).json({ message: 'No address found' });
        }
        
        res.json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};
```

## User Experience

### Scenario 1: First Time User (404)
1. User clicks "ROYAL ADDRESSES" in drawer
2. App calls GET /api/address
3. Backend returns 404 (no address found)
4. App shows empty form with "Add Address" title
5. User fills in details
6. User clicks "Save Address"
7. App calls POST /api/address
8. Backend creates address and returns 201
9. App shows success message

### Scenario 2: Returning User (200)
1. User clicks "ROYAL ADDRESSES" in drawer
2. App calls GET /api/address
3. Backend returns 200 with address data
4. App shows pre-filled form with "Edit Address" title
5. User can edit details
6. User clicks "Update Address"
7. App calls POST /api/address
8. Backend updates address and returns 200
9. App shows success message

## Log Messages Explained

### Normal Logs (Not Errors)
```
LOG  🚀 API Request: {"baseURL": "http://192.168.152.220:5000/api", "fullURL": "http://192.168.152.220:5000/api/address", "method": "GET", "url": "/address"}
```
This shows the app is making a request to fetch the address.

```
LOG  ❌ API Error: {"baseURL": "http://192.168.152.220:5000/api", "code": "ERR_BAD_REQUEST", "message": "Request failed with status code 404", "status": 404, "url": "/address"}
```
This shows the API returned 404, which means "no address found". The ❌ emoji is misleading - this is actually expected behavior for first-time users.

### Actual Error Logs (Problems)
If you see status codes like:
- `500` - Server error (something wrong with backend)
- `401` - Unauthorized (user not logged in)
- `403` - Forbidden (user doesn't have permission)
- `400` - Bad request (invalid data sent)

These would indicate actual problems that need fixing.

## Testing the Feature

### Test Case 1: Create Address
1. Login as a user who has never added an address
2. Open drawer → Click "ROYAL ADDRESSES"
3. You'll see 404 in logs (this is normal)
4. Fill in all required fields
5. Click "Save Address"
6. Should see success message
7. Address is now saved

### Test Case 2: View/Edit Address
1. Login as a user who has an address
2. Open drawer → Click "ROYAL ADDRESSES"
3. You'll see 200 in logs (address found)
4. Form is pre-filled with existing data
5. Edit any field
6. Click "Update Address"
7. Should see success message

### Test Case 3: Delete Address
1. Login as a user who has an address
2. Open drawer → Click "ROYAL ADDRESSES"
3. Form is pre-filled
4. Click "Delete Address"
5. Confirm deletion
6. Should see success message
7. Next time you visit, you'll see 404 again (expected)

## Summary

✅ **404 on first visit = NORMAL**
- User doesn't have an address yet
- App shows empty form
- User can create address

✅ **200 on subsequent visits = NORMAL**
- User has an address
- App shows pre-filled form
- User can edit or delete

❌ **500, 401, 403, 400 = ACTUAL ERRORS**
- These indicate real problems
- Need investigation and fixing

## Conclusion

The 404 error you're seeing is **not a bug** - it's the correct behavior for users who haven't created an address yet. The app handles this gracefully by showing an empty form for the user to fill out.

If you want to suppress the error log for 404s, you can update the API interceptor to not log 404 errors as errors, but as info messages instead.
