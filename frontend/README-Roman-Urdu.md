EventSphere Frontend — Simple Guide (Roman Urdu)

Yeh chhota guide aapko dikhata hai ke UI kahan edit karna hai aur kaise customize karna hai.

Files:
- `src/App.css` — Global design system (colors, spacing, utilities). Yahan variables change kar ke site ka rang aur spacing badal saktay ho.
- `src/components/Home.css` — Home page ka style. Hero, services, features yahan define hain.
- `src/components/Navbar.css` — Top navigation ki styling. Agar aap sidebar chahte ho ya nav items badalna ho to ye file edit karo.
- `src/components/EventCarousel.jsx` and `EventCarousel.css` — Carousel component (events). Aap slides array me naya event add kar saktay ho.

Quick tips (Roman Urdu):
- Rang badalna: `--color-primary-500` ko `App.css` me update karo.
- Spacing: `--space-md` etc. variables se spacing control karo.
- Naye events add karna: `EventCarousel.jsx` me `slides` array me object add karo. Har object me `title`, `subtitle`, `date`, `location`, `attendees`, `image`, `color`, `description` rakhna.
- CSS samajhna: Har component ki CSS usi `components` folder me hai. Aaram se edit karo; variables use karne se consistency rahe gi.

Roman-Urdu examples:
- Agar hero title chhota lag raha hai to `Home.css` me `.hero-title` ke `clamp()` value kam karo.
- Agar carousel overflow kare to `EventCarousel.css` me `.carousel-slides` aur `.slide-text` ki `min-width` aur `box-sizing` check karo.

Agar chaho to main aap ke liye color theme ya ek naya hero background bana dunga. Batao kya chahte ho.