# Aitoonic - Next.js 14 SSR Website

A fully server-side rendered (SSR) AI tools directory built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Full SSR**: All pages are server-side rendered for optimal SEO and performance
- **Next.js 14**: Latest Next.js with App Router and enhanced performance
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive design system
- **SEO Optimized**: Meta tags, structured data, and sitemaps
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Responsive Design**: Mobile-first approach with perfect mobile experience

## 📄 Routes

- `/` - Homepage with featured tools and categories
- `/categories` - Browse all AI tool categories
- `/category/[slug]` - Dynamic category pages
- `/ai/[slug]` - Individual tool detail pages
- `/ai-agent` - AI agents marketplace
- `/ai-agent/[slug]` - Individual agent detail pages
- `/terms` - Terms & Conditions
- `/privacy` - Privacy Policy
- `/about` - About page
- `/contact` - Contact page

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel/Netlify ready
- **Icons**: Lucide React

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aitoonic-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Performance Features

- **Server-Side Rendering**: All content rendered on the server
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Automatic code splitting for optimal loading
- **Prefetching**: Smart prefetching of critical resources
- **Caching**: Intelligent caching strategies for static and dynamic content

## 🔍 SEO Features

- **Meta Tags**: Dynamic meta tags for each page
- **Structured Data**: JSON-LD structured data for rich snippets
- **Sitemaps**: Automatically generated XML sitemaps
- **Open Graph**: Social media sharing optimization
- **Canonical URLs**: Proper canonical URL handling

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first responsive design
- **Touch Optimization**: Optimized touch targets and interactions
- **Performance**: Optimized for mobile Core Web Vitals
- **Accessibility**: WCAG compliant accessibility features

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
npm run export
# Deploy the `out` folder to Netlify
```

## 📈 Core Web Vitals

This website is optimized for Google's Core Web Vitals:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔧 Development

### Project Structure
```
├── pages/              # Next.js pages (SSR routes)
├── components/         # Reusable React components
├── lib/               # Utility functions and configurations
├── styles/            # Global styles and Tailwind CSS
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

### Key Files
- `pages/_app.tsx` - App wrapper with global providers
- `pages/_document.tsx` - Custom document with critical CSS
- `components/Layout.tsx` - Main layout component
- `lib/supabase.ts` - Supabase client configuration
- `styles/globals.css` - Global styles and Tailwind imports

## 📝 Content Management

The website uses Supabase as the backend with the following tables:
- `categories` - AI tool categories
- `tools` - Individual AI tools
- `agents` - AI agents/assistants

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.