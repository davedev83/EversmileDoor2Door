# Auto-Save Duplicate Prevention Fix

## Problem
The multi-step form was creating duplicate visit records when users navigated back and forth between form steps. This happened because:

1. Auto-save was triggered every 30 seconds when there were unsaved changes
2. For new visits (not editing existing ones), the `isEditing` flag was always `false`
3. This caused `saveVisit()` to always call `createVisit()` instead of `updateVisit()`
4. Each auto-save created a new visit record in the database

## Solution
Implemented a localStorage-based visit ID tracking system:

### Key Changes Made

1. **Added Visit ID Tracking State**
   ```javascript
   const [currentVisitId, setCurrentVisitId] = useState(null);
   const [formSessionKey] = useState(() => `visitForm_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
   ```

2. **localStorage Integration**
   - Store visit ID after first successful save
   - Check for existing visit ID on form initialization
   - Use unique session keys to prevent conflicts between multiple form instances

3. **Updated Save Logic**
   ```javascript
   const hasVisitId = isEditing || currentVisitId;
   if (isEditing) {
     data._id = existingData._id;
   } else if (currentVisitId) {
     data._id = currentVisitId;
   }
   const result = await saveVisit(data, hasVisitId);
   ```

4. **Cleanup Mechanisms**
   - Clear localStorage on successful final save
   - Clear localStorage when user navigates back (cancels form)
   - Clear localStorage on page unload (if not editing existing visit)

### How It Works

1. **New Visit Flow:**
   - User starts new form → no visit ID exists
   - First auto-save creates new visit → visit ID stored in localStorage
   - Subsequent auto-saves update the existing visit using stored ID
   - Final save clears localStorage

2. **Edit Existing Visit Flow:**
   - User edits existing visit → uses existing visit ID
   - localStorage is not used for tracking
   - All saves update the existing visit

3. **Navigation/Cancellation:**
   - User navigates back → localStorage cleared
   - Page refresh/close → localStorage cleared (for new visits only)

## Testing the Fix

### Manual Testing Steps

1. **Start New Visit:**
   ```
   1. Go to http://localhost:3000
   2. Click "Add New Visit"
   3. Fill in some form fields
   4. Navigate between steps (triggers auto-save)
   5. Check browser DevTools → Application → Local Storage
   6. Should see visitForm_* key with visit ID value
   ```

2. **Verify No Duplicates:**
   ```
   1. Continue with above test
   2. Navigate back and forth between steps multiple times
   3. Check database/visit list - should only see one draft visit
   4. Complete and save the form
   5. localStorage should be cleared
   ```

3. **Test Existing Visit Edit:**
   ```
   1. Edit an existing visit from the list
   2. Make changes and navigate between steps
   3. localStorage should not be used (no visitForm_* keys)
   4. Should update the existing visit, not create new ones
   ```

### Browser DevTools Verification

1. Open DevTools (F12)
2. Go to Application tab → Local Storage → localhost:3000
3. Look for keys matching pattern: `visitForm_[timestamp]_[random]`
4. Value should be the MongoDB visit ID

### Database Verification

Check your MongoDB collection to ensure:
- Only one draft visit is created per form session
- No duplicate visits with identical or similar data
- Existing visit edits update the same record

## Files Modified

- `components/forms/MultiStepForm.js` - Main implementation
- `__tests__/autoSaveDuplicatePrevention.test.js` - Test coverage

## Benefits

1. **Prevents Duplicate Records:** No more duplicate visits from auto-save
2. **Maintains User Experience:** Auto-save still works seamlessly
3. **Handles Edge Cases:** Page refresh, navigation, cancellation
4. **Backward Compatible:** Existing visit editing unchanged
5. **Session Isolation:** Multiple form instances don't interfere

## Technical Notes

- Uses unique session keys to prevent conflicts between multiple browser tabs
- localStorage is automatically cleaned up to prevent accumulation
- Gracefully handles localStorage unavailability (falls back to original behavior)
- Does not interfere with existing visit editing workflow
