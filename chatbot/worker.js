/**
 * NovaAI Chat — Cloudflare Worker (AI proxy)
 *
 * راه‌اندازی (۲ دقیقه):
 * 1. داشبورد cloudflare.com → Workers & Pages → Create Worker
 * 2. کل این فایل را جایگزین کد پیش‌فرض کنید و Deploy بزنید
 * 3. Settings → Bindings → Add → Workers AI → نام binding: AI
 * 4. آدرس Worker را در ثابت WORKER_URL داخل index.html قرار دهید
 *
 * مسیرها:
 *   POST /chat  → گفتگوی متنی (استریم SSE)
 *   POST /image → تولید تصویر (PNG یا JSON base64)
 */

const DEFAULT_TEXT_MODEL = "@cf/zai-org/glm-5.2";
const DEFAULT_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // در پروداکشن دامنه سایت خود را بگذارید
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== "POST") {
      return json({ error: "Use POST /chat or POST /image" }, 405);
    }

    const url = new URL(request.url);
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    if (url.pathname.endsWith("/image")) return handleImage(body, env);
    if (url.pathname.endsWith("/chat")) return handleChat(body, env);
    return json({ error: "Not found. Use /chat or /image" }, 404);
  },
};

/* ===== گفتگوی متنی ===== */
async function handleChat(body, env) {
  const { model = DEFAULT_TEXT_MODEL, messages, stream = true, max_tokens = 2048 } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: "messages array is required" }, 400);
  }

  const safeMessages = messages.slice(-20).map((m) => ({
    role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
    content: String(m.content).slice(0, 8000),
  }));

  try {
    const aiResponse = await env.AI.run(model, { messages: safeMessages, stream, max_tokens });

    if (stream) {
      return new Response(aiResponse, {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }
    return json(aiResponse, 200);
  } catch (err) {
    return json({ error: `AI error: ${err.message}` }, 500);
  }
}

/* ===== تولید تصویر ===== */
async function handleImage(body, env) {
  const { model = DEFAULT_IMAGE_MODEL, prompt } = body;

  if (!prompt || typeof prompt !== "string") {
    return json({ error: "prompt is required" }, 400);
  }

  try {
    let finalPrompt = prompt.slice(0, 2000);

    // مدل‌های تصویرساز فقط انگلیسی می‌فهمند؛
    // اگر پرامپت حروف فارسی/عربی داشت، اول به یک پرامپت انگلیسی دقیق تبدیل می‌شود
    if (/[\u0600-\u06FF]/.test(finalPrompt)) {
      try {
        const tr = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            {
              role: "system",
              content:
                "You are a prompt engineer for an AI image generator. " +
                "Convert the user's Persian image description into ONE detailed, vivid English image-generation prompt. " +
                "Keep every detail the user mentioned (objects, colors, style, background). " +
                "Output ONLY the English prompt itself — no explanations, no quotes, no Persian.",
            },
            { role: "user", content: finalPrompt },
          ],
          max_tokens: 300,
        });
        const translated = (tr && tr.response ? tr.response : "").trim();
        if (translated) finalPrompt = translated.slice(0, 2000);
      } catch {
        // اگر ترجمه شکست خورد، با متن اصلی ادامه می‌دهیم
      }
    }

    const params = { prompt: finalPrompt };
    if (model.includes("flux-1")) params.num_steps = 8; // فقط برای FLUX 1 Schnell (FLUX 2 این پارامتر را لازم ندارد)

    const result = await env.AI.run(model, params);

    // FLUX خروجی JSON با فیلد image (base64) برمی‌گرداند
    if (result && typeof result === "object" && !(result instanceof ReadableStream) && result.image) {
      return json({ image: result.image }, 200);
    }

    // SDXL و DreamShaper خروجی باینری PNG (stream) برمی‌گردانند
    return new Response(result, {
      headers: { ...CORS_HEADERS, "Content-Type": "image/png" },
    });
  } catch (err) {
    return json({ error: `Image error: ${err.message}` }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" },
  });
}
