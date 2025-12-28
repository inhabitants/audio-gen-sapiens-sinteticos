import { NextResponse } from "next/server";

// Simple in-memory rate limit (Reset on server restart/cold start)
const RATE_LIMIT = new Map();
const WINDOW_MS = 60 * 60 * 1000; // 1 Hour
const MAX_REQUESTS = 50; // Increased for testing

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
            return NextResponse.json({ error: "Rate limit exceeded (50/hour)" }, { status: 429 });
        }

        RATE_LIMIT.set(ip, { ...currentUsage, count: currentUsage.count + 1 });

        // ---

        // 1. Read Body ONCE
        const formData = await request.formData();
        const prompt = formData.get("prompt");
        const aspectRatio = formData.get("aspectRatio") || "1:1";

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Server Configuration Error: GEMINI_API_KEY missing" }, { status: 500 });
        }

        // 2. Direct REST Call to Gemini 3 Image Preview
        // Using this explicitly as SDK support for "image-preview" endpoints can vary
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
            const errText = await fetchRes.text();
            console.error("Gemini API Error Body:", errText);
            throw new Error(`Gemini API Error (${fetchRes.status}): ${errText}`);
        }

        const data = await fetchRes.json();

        // 3. Extract Image
        const candidates = data.candidates;
        if (!candidates || !candidates.length) throw new Error("No candidates returned from Gemini");

        // The image usually comes in 'inlineData' or similar field in the parts
        const imgPart = candidates[0].content.parts.find(p => p.inlineData);
        if (!imgPart) throw new Error("No image data found in response parts. Response was: " + JSON.stringify(candidates[0].content.parts));

        const base64 = `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;

        return NextResponse.json({ imageUrl: base64 });

    } catch (e) {
        console.error("Route Error:", e);
        return NextResponse.json({ error: e.message || "Generation Failed" }, { status: 500 });
    }
}
