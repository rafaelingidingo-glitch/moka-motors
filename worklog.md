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
