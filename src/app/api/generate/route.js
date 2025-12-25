import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Simple in-memory rate limit (Reset on server restart/cold start)
// In production, use Redis or Vercel KV
const RATE_LIMIT = new Map();
const WINDOW_MS = 60 * 60 * 1000; // 1 Hour
const MAX_REQUESTS = 10; // 10 per hour per IP

export async function POST(request) {
    try {
        const forwardedFor = request.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(',')[0] : "127.0.0.1";

        // Rate Limit Check
        const currentUsage = RATE_LIMIT.get(ip) || { count: 0, startTime: Date.now() };
        if (Date.now() - currentUsage.startTime > WINDOW_MS) {
            currentUsage.count = 0;
            currentUsage.startTime = Date.now();
        }

        if (currentUsage.count >= MAX_REQUESTS) {
            return NextResponse.json({ error: "Rate limit exceeded (10/hour)" }, { status: 429 });
        }

        RATE_LIMIT.set(ip, { ...currentUsage, count: currentUsage.count + 1 });

        // ---

        const formData = await request.formData();
        const prompt = formData.get("prompt");
        const aspectRatio = formData.get("aspectRatio") || "1:1";

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Server Configuration Error: GEMINI_API_KEY missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the model version specified by user
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                imageConfig: {
                    aspectRatio: aspectRatio
                }
            }
        });

        const response = await result.response;
        // Gemini image response structure may vary depending on SDK version, 
        // but typically contains generated images in candidates or parts.
        // Needs careful handling if SDK structure changes.
        // Assuming current beta SDK behavior which returns parts with inlineData.

        // Wait, standard `generateContent` for text returns text. 
        // `imagen` (Gemini 3) might have specific structure. 
        // Based on the original `route.js`, it used REST API manually. 
        // I should stick to the manual fetch or check if SDK supports it.
        // The SDK usage in original `route.js` was mixed (importing Class but using `fetch` for the actual call).
        // Let's stick to the `fetch` implementation from the original to be safe with this specific model endpoint.

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message || "Generation Failed" }, { status: 500 });
    }

    // Fallback to fetch implementation if SDK doesn't support Image 3 preview comfortably involving keys/endpoints
    try {
        const prompt = (await request.formData()).get("prompt");
        const aspectRatio = (await request.formData()).get("aspectRatio") || "1:1";

        const apiKey = process.env.GEMINI_API_KEY;
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`;

        const fetchRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    imageConfig: { aspectRatio }
                }
            })
        });

        if (!fetchRes.ok) {
            const err = await fetchRes.text();
            throw new Error(`Gemini API Error: ${err}`);
        }

        const data = await fetchRes.json();
        // Extract base64
        const candidates = data.candidates;
        if (!candidates || !candidates.length) throw new Error("No candidates returned");

        const imgPart = candidates[0].content.parts.find(p => p.inlineData);
        if (!imgPart) throw new Error("No image data found in response");

        const base64 = `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;

        return NextResponse.json({ imageUrl: base64 });

    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
