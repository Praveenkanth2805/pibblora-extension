# Pibblora ✨

**A Little Magic in Every Click.**

Pibblora is a cute, playful browser customization product that transforms your browser into a soft, creative space with animated pets, magical cursor effects, pastel themes, and a dreamy new tab experience.

## 🚀 Tech Stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Extension:** Chrome Extension Manifest V3
- **Storage:** Chrome Storage API / LocalStorage

## 🛠️ Features

### 🌐 Website

- **Landing Page:** Discover Pibblora.
- **Dashboard:** A cozy overview of your setup.
- **Pet Studio:** Choose from Pikachu, Snail, Spider, Cat, and more. Customize colors and animations.
- **Cursor Studio:** Stars, hearts, neon trails, and custom gradients.
- **Theme Studio:** Seven beautiful presets, including a special Devotional theme.
- **Widget Manager:** Live preview of your DreamTab widgets.
- **Settings:** Import, export, and reset your preferences.

### 🧩 Chrome Extension

- **Browser Buddy:** Animated pets that roam your screen. After 30 seconds of inactivity, they walk around the screen edges. Move your mouse to recall them to the bottom-right corner.
- **Cursor Magic:** Click ripples and trailing effects.
- **DreamTab:** A beautiful new-tab replacement with a clock, search, shortcuts, timer, notes, and checklist.
- **Custom Pet Upload:** Upload your own image to use as your pet.

## 📦 Project Structure

```text
pibblora/
├── extension/            # MV3 manifest and content scripts
├── src/
│   ├── web/              # Website React components
│   ├── ext/              # Extension popup and DreamTab
│   └── shared/           # Shared components, types, storage, and themes
├── public/
├── index.html            # Website entry
├── popup.html            # Extension popup entry
├── newtab.html           # Extension DreamTab entry
├── vite.config.ts        # Build configuration
├── package.json
└── README.md
```

## 💻 Development

### Install Dependencies

```bash
npm install
```

### Run the Website Locally

```bash
npm run dev
```

### Build the Website

```bash
npm run build
```

### Build the Chrome Extension

```bash
npm run build:ext
```

The extension build generates a `dist-extension` folder.

## 🔌 How to Install the Extension

1. Clone or download this repository.
2. Install dependencies and run `npm run build:ext`.
3. Open Google Chrome and navigate to `chrome://extensions`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the generated `dist-extension` folder containing `manifest.json`.
7. Open a new tab and enjoy Pibblora!

## 👨‍💻 Created By

**Praveenkanth G**

- **Portfolio:** [praveenkanth-g.vercel.app](https://praveenkanth-g.vercel.app/)
- **GitHub:** [Praveenkanth2805](https://github.com/Praveenkanth2805)
- **Instagram:** [@praveenkanth2805](https://www.instagram.com/praveenkanth2805/)
- **LinkedIn:** [Connect with me](https://www.linkedin.com/in/praveenkanth2805/)

## ⭐ Support Pibblora

If you like Pibblora, please consider giving this repository a **⭐ Star on GitHub**!

Your support motivates me to keep improving Pibblora and bringing more magic to your browsing experience. ✨

If you find it useful, share it with your friends and help the project reach more people.

## 📄 License

No license has been specified yet. Please add a `LICENSE` file before distributing the project for reuse.

---

**Made with ❤️ by Praveenkanth G for a better browsing experience.**

*A Little Magic in Every Click.* ✨
