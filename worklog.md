---
Task ID: 1
Agent: Main Agent
Task: Convert Moka Motors Admin from side panel to full single-page dashboard

Work Log:
- Read all existing components and project structure from previous session
- Identified that AdminPanel.tsx was a slide-in side panel component
- Updated adminStore.ts with new methods: openAdminPage(), closeAdminPage(), and showAdminPage state
- Created new AdminPage.tsx component: a full-page admin dashboard with sidebar navigation
- Admin page features: Dashboard overview, Motorbikes management table, Spare Parts management table, Settings page
- Login screen is now a full-page dark-themed login form
- Updated page.tsx to conditionally render either the customer-facing site OR the admin dashboard
- Updated Navbar.tsx to use openAdminPage() instead of setAdminPanelOpen()
- All API routes, Prisma schema, stores, and WhatsApp integration remain intact
- Ran lint with no errors, dev server compiles successfully

Stage Summary:
- Admin is now a complete full-page single-page application, not a side panel
- Clicking "Login" or "Admin" in the navbar switches the entire view to the admin dashboard
- Admin dashboard has collapsible sidebar, search, table views, and forms for CRUD operations
- "Back to Website" button in sidebar returns to customer-facing page
- All existing features (Cart, WhatsApp, Filtering, Likes) continue to work unchanged

---
Task ID: 2
Agent: Main Agent
Task: Add combined image upload + URL input for admin product forms

Work Log:
- Created /api/upload/route.ts API endpoint for file uploads with validation (type, size 5MB max)
- Uploaded files stored in public/uploads/ with unique filenames (timestamp + random)
- Updated AdminPage.tsx form: replaced simple Image URL field with combined upload/URL component
- Added mode toggle tabs: "Upload File" and "Image URL"
- Upload mode: drag-area with preview, loading spinner, remove button, instant preview via FileReader
- URL mode: text input with live preview below
- Added state: imageMode, isUploading, uploadPreview
- Updated resetForm, handleEditMotorbike, handleEditSparePart to handle image state
- When editing, auto-detects image mode based on URL path (/uploads/ = upload mode)
- Tested upload API: validated file type rejection and successful image upload
- Lint passes with no errors

Stage Summary:
- Admin can now add product images by either uploading a file (JPEG/PNG/GIF/WebP/SVG, max 5MB) or providing a URL
- Both options are combined in a single form section with a toggle tab
- Upload shows instant preview and stores file in /public/uploads/
- URL mode shows live image preview as user types
