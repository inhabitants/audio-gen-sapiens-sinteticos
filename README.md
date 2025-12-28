# Audio Gen Sapins Sinteticos (Open Source) 🍌

[![Built with Gemini 3](https://img.shields.io/badge/Built%20with-Gemini%203-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Powered by Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![ElevenLabs Voice](https://img.shields.io/badge/ElevenLabs-Voice%20AI-orange?style=for-the-badge)](https://elevenlabs.io/)

**Nano Banana** is a next-generation, voice-controlled creative interface that lets you converse with an AI to generate stunning visuals in real-time. Built for the **Gemini 3 Global Hackathon**, it demonstrates the power of multimodal interaction by combining conversational voice agents with Google's latest image generation models.

Stop typing prompts. **Just say what you see.**

---

## 🚀 Hackathon Submission: Gemini 3 Integration

This project is built explicitly to leverage the capabilities of the **Gemini 3 family**.

### How we use Gemini 3
We utilize the **`gemini-3-pro-image-preview`** model to power the core visual engine of the application. Unlike traditional image generators that rely on static text fields, Nano Banana creates a fluid, conversational loop:

1.  **Voice Interaction**: The user speaks to the ElevenLabs agent.
2.  **Intent Extraction**: The agent understands the user's creative intent and formulates a precise prompt.
3.  **Gemini 3 Generation**: This prompt is sent to our backend, where `gemini-3-pro-image-preview` interprets the request and generates high-fidelity images with specific aspect ratio controls.
4.  **Real-time Feedback**: The image appears instantly on the infinite canvas, allowing the user to iterate ("Make it simpler", "Add more neon lights") without ever touching a keyboard.

The speed and prompt adherence of Gemini 3 are critical for this "real-time conversation" feel, reducing the friction between thought and visualization.

---

## ✨ Features

*   **🗣️ Conversational Interface**: Talk naturally to the AI to describe your ideas. No complex prompt engineering required.
*   **🎨 Gemini 3 Image Generation**: Powered by Google's state-of-the-art `gemini-3-pro-image-preview` model for stunning, creative results.
*   **🔌 ElevenLabs Integration**: Uses the Conversational AI SDK for low-latency, human-like voice interaction.
*   **⚡ Real-Time Preview**: Images generate and appear on a dynamic canvas.
*   **📐 Customizable Output**: Control aspect ratios (1:1, 16:9, etc.) and model parameters.
*   **🎲 Lucky Mode**: One-click random generation for instant inspiration.
*   **📱 Modern UI**: Fully responsive, dark-mode/glassmorphism design built with Tailwind CSS 4.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **AI Model**: [Google Gemini 3](https://ai.google.dev/) (`gemini-3-pro-image-preview`)
*   **Voice AI**: [ElevenLabs](https://elevenlabs.io/) (React SDK)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Framer Motion
*   **Icons**: Lucide React

## 📦 Getting Started

Follow these steps to run Nano Banana locally.

### Prerequisites

*   Node.js 18+ installed
*   A **Google Gemini API Key** (Get it [here](https://aistudio.google.com/))
*   An **ElevenLabs Agent ID** (Create one [here](https://elevenlabs.io/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/nano-banana-opensource.git
    cd nano-banana-opensource
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your keys:

    ```env
    # Google Gemini API Key for Image Generation
    GEMINI_API_KEY=your_gemini_api_key_here

    # ElevenLabs Agent ID for Voice Interaction
    NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open the App**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by [Sapiens Sinteticos](https://sapiensinteticos.com/).**
