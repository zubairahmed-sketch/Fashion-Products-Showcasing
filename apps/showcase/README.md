# Fashion Product Showcase

A modern, one-page fashion product showcase website built with React and Vite.

## Features

- **One-Page Product Display**: All products rendered on a single page with smooth filtering
- **Category Filters**: Filter by categories (Hoodies, Rings, Belts, Accessories, Bags, Footwear, Halloween)
- **Search by Product ID**: Integer-only search with partial and exact matching
- **Random Shuffle**: Display products in random order
- **Responsive Grid**: Fully responsive design for desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI with smooth transitions
- **External Redirect**: Click any product to open the brand's purchase URL in a new tab

## Project Structure

```
src/
├── components/          # React components
│   ├── ProductShowcase.jsx    # Main showcase component
│   ├── ProductGrid.jsx        # Product grid display
│   ├── ProductCard.jsx        # Individual product card
│   └── Sidebar.jsx            # Filter sidebar
├── styles/
│   └── global.css       # Global dark theme styles
├── services/            # API services (placeholder)
├── hooks/               # Custom React hooks (placeholder)
├── utils/               # Utility functions (placeholder)
├── App.jsx              # Root component
└── main.jsx             # Entry point
```

## Setup & Installation

### Prerequisites

- Node.js 16+ 
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Environment Variables

Create a `.env.local` file in the root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## How It Works

### Filtering

- **Category Filter**: Select a category from the sidebar to show only matching products
- **Search**: Enter a product ID (numbers only) to find products by ID (partial matches supported)
- **Random**: Shuffle all products in random order

### Product Card

Each card displays:
- Product image
- Product name (if available)
- Category
- Product ID
- "View Product" button (opens source URL in new tab)

### Responsive Design

- **Desktop**: 4-column grid
- **Tablet**: 3-column grid with sidebar
- **Mobile**: 2-column grid with collapsible sidebar

## API Integration

The app expects products from the backend API with this format:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "productId": 101,
  "name": "Denim Skirt",
  "category": "Accessories",
  "imageUrl": "/uploads/skirt.png",
  "sourceUrl": "https://brandwebsite.com/product/101"
}
```

Fetch endpoint (currently commented out):
```javascript
GET /api/products
```

## Styling

The app uses CSS variables for theming. Modify `src/styles/global.css` to customize colors, spacing, and transitions.

### Dark Theme Colors

- Primary Background: `#1a1a1a`
- Secondary Background: `#2d2d2d`
- Text Primary: `#ffffff`
- Accent: `#6366f1`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- Product images are responsive and maintain aspect ratio
- All filtering happens client-side (products are fetched once on mount)
- No pagination implemented (all products display on one page)
- Search accepts only integer input for product IDs
