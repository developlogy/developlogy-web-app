# Developlogy – Instant Website Builder

A production-ready MVP for creating business websites with drag-and-drop functionality, built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

### Core Website Builder
- **Block-based Editor**: Drag & drop interface with 7 different block types
- **20+ Industry Templates**: Pre-configured templates for various business types
- **Theme Customization**: Color schemes and typography scaling
- **SEO Optimization**: Built-in SEO tools and structured data
- **Mobile Responsive**: Fully responsive design across all devices
- **Real-time Preview**: Live preview of changes as you build

### E-commerce Capabilities ✨ NEW
- **Product Management**: Add, edit, and organize products with images, prices, and descriptions
- **Shopping Cart**: Full cart functionality with quantity management
- **Checkout Flow**: Complete checkout process with customer information forms
- **Payment Integration**: Abstracted payment gateway supporting multiple providers
- **Order Management**: Order processing and confirmation system
- **Product Catalog**: Dedicated product listing pages with search and filtering

### Block Types
- **Hero Section**: Eye-catching headers with call-to-action buttons
- **About Us**: Company story and team information
- **Services**: Service listings with descriptions and pricing
- **Products**: E-commerce product showcase with cart integration
- **Gallery**: Image galleries and portfolios
- **Testimonials**: Customer reviews and feedback
- **Contact**: Contact forms and business information

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit/core
- **Forms**: react-hook-form + zod validation
- **Storage**: LocalStorage (easily swappable to database)
- **Authentication**: Mock system (ready for Firebase/Auth0 integration)

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd developlogy-builder
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables** (optional for development)
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

### Required for Production
\`\`\`env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
\`\`\`

### Payment Gateway Integration (Optional)

#### Stripe Integration
\`\`\`env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
\`\`\`

#### Razorpay Integration
\`\`\`env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_key
\`\`\`

### Development URLs
\`\`\`env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

## 🏗 Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── builder/           # Website builder interface
│   ├── checkout/          # E-commerce checkout flow
│   ├── dashboard/         # User dashboard
│   ├── onboarding/        # 3-step setup wizard
│   ├── preview/           # Site preview pages
│   └── products/          # Product catalog pages
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   ├── builder/          # Website builder components
│   ├── cart/             # Shopping cart components
│   ├── dashboard/        # Dashboard components
│   ├── landing/          # Landing page components
│   ├── onboarding/       # Onboarding wizard components
│   ├── preview/          # Preview components
│   ├── products/         # Product display components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication interface
│   ├── content-generator.ts # Industry-specific content
│   ├── payments.ts       # Payment gateway abstraction
│   ├── storage.ts        # Data persistence layer
│   ├── store.ts          # Zustand state management
│   └── templates.ts      # Website templates
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
\`\`\`

## 🎯 Usage Guide

### Creating Your First Website

1. **Sign Up**: Create an account on the landing page
2. **Onboarding**: Complete the 3-step setup wizard:
   - Enter business information
   - Add contact details and social links
   - Choose from industry-specific templates
3. **Customize**: Use the drag-and-drop builder to:
   - Add and arrange content blocks
   - Customize colors and typography
   - Configure SEO settings
4. **Enable E-commerce** (optional):
   - Toggle e-commerce in site settings
   - Add product blocks
   - Configure product details and pricing
5. **Preview & Publish**: Test your site and make it live

### E-commerce Setup

1. **Enable E-commerce**:
   - Go to site settings → Store tab
   - Toggle "Enable E-commerce"

2. **Add Products**:
   - Add a "Products" block to your site
   - Click "Add Product" to create items
   - Configure names, prices, descriptions, and images
   - Add badges like "New", "Sale", "Popular"

3. **Configure Payment**:
   - Set up environment variables for your payment provider
   - The system supports Stripe, Razorpay, or mock payments for testing

4. **Test Shopping Flow**:
   - Preview your site
   - Add products to cart
   - Complete the checkout process

## 🔌 Payment Gateway Integration

### Mock Gateway (Development)
The system includes a mock payment gateway for development and testing:
- Simulates 95% success rate
- 2-second processing delay
- Generates realistic transaction IDs
- No real money processing

### Stripe Integration
To enable Stripe payments:

1. **Install Stripe SDK** (if not already included):
   \`\`\`bash
   npm install stripe @stripe/stripe-js
   \`\`\`

2. **Set environment variables**:
   \`\`\`env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   \`\`\`

3. **The system automatically detects and uses Stripe** when environment variables are present.

### Razorpay Integration
To enable Razorpay payments:

1. **Install Razorpay SDK** (if not already included):
   \`\`\`bash
   npm install razorpay
   \`\`\`

2. **Set environment variables**:
   \`\`\`env
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=your_secret_key
   \`\`\`

3. **The system automatically detects and uses Razorpay** when environment variables are present.

## 🗄 Data Models

### Core Entities
- **Site**: Website configuration and content
- **Block**: Individual content sections
- **User**: User accounts and authentication
- **Theme**: Visual customization settings

### E-commerce Entities
- **Product**: Product information and inventory
- **Cart**: Shopping cart with items
- **Order**: Customer orders and payment status
- **CartItem**: Individual items in cart

## 🔄 State Management

The application uses Zustand for state management with the following stores:

- **App Store**: Global application state
- **Cart Management**: Shopping cart operations
- **Site Management**: Website data and operations
- **Authentication**: User session management

## 🎨 Customization

### Adding New Block Types

1. **Define the block type** in `types/index.ts`
2. **Create a renderer component** in `components/builder/blocks/`
3. **Add to BlockRenderer** switch statement
4. **Update BlocksSidebar** with new block option
5. **Add default content** in `getDefaultBlockContent()`

### Adding New Payment Gateways

1. **Implement the IPayments interface** in `lib/payments.ts`
2. **Add environment variable detection** in `createPaymentGateway()`
3. **Update documentation** with setup instructions

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic deployments on push

### Other Platforms
The application is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🧪 Testing

### E-commerce Testing
1. **Enable e-commerce** in site settings
2. **Add test products** with various configurations
3. **Test cart functionality**: add, remove, update quantities
4. **Complete checkout flow** with mock payment gateway
5. **Verify order confirmation** and success states

### Payment Testing
- **Mock Gateway**: Always available for testing
- **Stripe**: Use test card numbers from Stripe documentation
- **Razorpay**: Use test credentials and card numbers

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for general questions

## 🗺 Roadmap

### Phase 2 Features (Planned)
- **Database Integration**: PostgreSQL/Supabase backend
- **Real Authentication**: Firebase/Auth0 integration
- **Advanced SEO**: Sitemap generation, meta tag optimization
- **Analytics**: Built-in website analytics
- **Custom Domains**: Domain connection and SSL
- **Team Collaboration**: Multi-user editing
- **Advanced E-commerce**: Inventory management, shipping, taxes
- **Email Integration**: Order confirmations, newsletters
- **Performance**: Image optimization, caching
- **Accessibility**: Enhanced a11y features

---

**Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.**
