# DC APK Toolkit 🐉
[![Tauri v2](https://img.shields.io/badge/Tauri-v2-blue?logo=tauri)](https://tauri.app/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, clinical utility suite designed for **Dragon City** APK management, recursive asset extraction, and resource deep-diving. Built with **Tauri v2** and **React 19**, it provides a seamless desktop experience for developers and enthusiasts.

---

## ✨ Key Features

- **🚀 Atomic Acquisition**: Automated scraping and high-speed downloading of the latest Dragon City builds directly from trusted repositories.
- **📂 Recursive Extraction**: Advanced extraction engine capable of unpacking nested APKs (like `android_asset_pack.apk`) and performing automatic cleanup of binary remnants.
- **🖼️ Image Gallery**: High-performance viewer with base64 caching for high-resolution sprites and UI assets. Includes multi-format export capabilities.
- **🎵 Audio Library**: Premium audio module with real-time waveform visualization, play/pause controls, and direct asset extraction.
- **📡 System Releases**: Live integration with the [GitHub Mainframe](https://github.com/DC-Highs/dc-apk-toolkit) to fetch stable binary branches and development updates.

---

## 🛠️ Technology Stack

- **Core Framework**: [Tauri v2](https://tauri.app/) (Rust-based security and speed)
- **Frontend Engine**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)

---

## 📥 Installation

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (v20+)
- [Tauri Dependencies](https://tauri.app/v1/guides/getting-started/prerequisites)

### Cloning the Node
```bash
git clone https://github.com/DC-Highs/dc-apk-toolkit.git
cd dc-apk-toolkit
```

### Setup & Development
```bash
npm install
npm run tauri dev
```

---

## 📦 Pipeline Commands

| Command | Description |
| :--- | :--- |
| `npm run tauri build` | Initialize production binary build |
| `npm run dev` | Start frontend development server (Vite) |
| `npm run format` | Enforce code standard via Prettier |
| `npm run lint` | Perform static analysis for errors |

---

## 🛡️ Binary Integrity
The backend engine ensures that all extracted files have their original integrity maintained. APK remnants are automatically wiped post-extraction to optimize storage node health.

## 🤝 Contribution
DC Highs operates as an open-source initiative. Feel free to submit pull requests or report system anomalies in the [Issue Tracker](https://github.com/DC-Highs/dc-apk-toolkit/issues).

---

**Powered by [DC Highs](https://github.com/DC-Highs)**  
*Clinical Utility for Dragon City Assets*
