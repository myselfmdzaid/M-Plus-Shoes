# M+ Shoes - Premium Local Shoe Shop Website (https://myselfmdzaid.github.io/M-Plus-Shoes/)

## 💡 Idea
The core idea was to build a high-impact, single-page, animated website for **M+ Shoes**, a local offline shoe business. The goal was to bridge the gap between offline trust and online convenience by allowing customers to browse the collection in 3D, select their favorites, and book them directly for pickup, without the complexity of a full e-commerce payment gateway.

## 👟 About M+ Shoes
M+ Shoes is a trusted local brand known for blending everyday comfort with standout style. The website reflects this "premium yet accessible" identity.

- **Type**: Offline shoe shop with online browsing & booking.
- **Tagline**: "Step Into Confidence" / "Style That Walks With You."
- **Key Features**:
  - 3D Interactive Shoe Models.
  - Smooth, premium animations.
  - "Browse → Select → Book" workflow.
  - Direct email booking integration.

## 🚧 Problems we faced during development
1. **3D Performance vs. Loading**: Integrating high-quality 3D models (GLB) without making the site heavy or slow to load.
2. **Serverless Functionality**: Needing a booking and enquiry system without setting up a backend server or database.
3. **Complex State Management**: Managing a shopping basket, multiple quantities, and dynamic totals using only Vanilla JavaScript.
4. **Premium Feel**: Ensuring animations (loader, scroll reveals, hover effects) felt "expensive" and smooth, not janky.

## 🛠️ Solutions how we solve
1. **Smart Loading Experience**: We implemented a custom **10-second premium loader** with a progress bar. This ensures all 3D assets are fully ready before the user sees the site, turning the wait time into a branding moment.
2. **Web3Forms API**: We used the Web3Forms API to handle form submissions (Booking & Contact) directly from the frontend, sending structured emails to the shop owner instantly.
3. **Vanilla JS State**: Built a lightweight, custom state management system (`Map` based) to handle the cart logic, discount calculations, and modal triggers without external bloat like Redux.
4. **Modern CSS & 3D Tools**:
   - Used `<model-viewer>` for optimized, interactive 3D rendering.
   - Leveraged CSS `IntersectionObserver` for performant scroll-triggered animations.
   - Added glassmorphism (blur effects) and gradient glows for that modern aesthetic.

## ⚠️ IMPORTANT things
- **No Backend Required**: This is a static HTML/CSS/JS site. It can be hosted anywhere (GitHub Pages, Vercel, Netlify).
- **API Key**: The email function uses a public API key from Web3Forms.
- **Customization**: The shoe data is structured in a simple array in `script.js`, making it easy for the shop owner to update products.
- **Responsiveness**: The design is mobile-first, ensuring the booking flow works perfectly on phones.

## 👨‍💻 About me
**Mohammed Zaid**

I am the visionary and lead developer behind this project. I provided the architectural instructions and design direction to Trae (AI Assistant) to develop this. I also performed manual code refinements, tuned the animations, and adjusted the 3D positioning to ensure the final output matched my exact creative vision.

## 🎯 Conclusion
This project successfully transforms a local business's digital presence. It’s not just a catalog; it’s an interactive brand experience. By focusing on visual storytelling and a friction-less booking process, M+ Shoes is now ready to attract more local customers and streamline their sales process.

## 📸 Screenshots
*(Please replace the paths below with your actual screenshot files)*

### Loading Page
![Loading Page](M+ SHOE WEB IMG (1).png)

### Home & About Section
![Home & About Section](M+ SHOE WEB IMG (2).png)

### Shoes Flow
![Shoes Flow](M+ SHOE WEB IMG (3).png)

### Contact View
![Contact View](M+ SHOE WEB IMG (4).png)

### Location View
![Location View](M+ SHOE WEB IMG (5).png)
