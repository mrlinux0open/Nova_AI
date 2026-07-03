<div align="center">

# ✦ NovaAI — چت‌بات هوشمند نسل 2026

**ساخته شده توسط [Abbas bachari](https://github.com/mrlinux0open/Nova_AI)** ✨

یک چت‌بات کامل، زیبا و فارسی با مدل‌های رایگان Cloudflare Workers AI
— گفتگوی متنی + تولید تصویر —

</div>

---

## 📋 معرفی پروژه

**NovaAI** یک چت‌بات تحت وب است که توسط **Abbas bachari** طراحی و برنامه‌نویسی شده است. این پروژه فقط از **یک فایل HTML** و **یک Cloudflare Worker** تشکیل شده و بدون نیاز به سرور، دیتابیس یا هزینه، به مدل‌های هوش مصنوعی رایگان کلادفلر متصل می‌شود.

## ✨ امکانات

| امکان | توضیح |
|---|---|
| 🎨 **رابط کاربری نسل 2026** | طراحی شیشه‌ای (Glassmorphism)، پس‌زمینه گرادیانی متحرک، انیمیشن‌های نرم، کاملاً ریسپانسیو و RTL |
| 📎 **تشخیص هوشمند کد هنگام Paste** | کدی که Paste می‌کنید به‌صورت خودکار شناسایی و به‌عنوان ضمیمه بالای باکس تایپ قرار می‌گیرد (بدون اختلال در تایپ) |
| 📋 **بلوک کد جدا و قابل کپی** | کدهای پاسخ ربات با نام زبان و دکمه کپی نمایش داده می‌شوند |
| ⚡ **استریم زنده** | پاسخ‌ها کلمه‌به‌کلمه نمایش داده می‌شوند + دکمه توقف تولید |
| 🎭 **انتخاب مدل کنار باکس تایپ** | منوی شناور با ۹ مدل متنی و ۴ مدل تصویرساز رایگان |
| 🖼 **تولید تصویر** | با FLUX 2 Klein، FLUX.1 Schnell، SDXL و DreamShaper + **ترجمه خودکار پرامپت فارسی به انگلیسی** |
| 🌓 **تم تاریک/روشن** | با یک کلیک و ذخیره خودکار |
| 💾 **حافظه گفتگو** | تاریخچه در localStorage ذخیره می‌شود + دانلود گفتگو به‌صورت فایل متنی |

## 📁 ساختار پروژه

```
chatbot/
├── index.html   → کل رابط چت‌بات (تک‌فایل، بدون وابستگی)
└── worker.js    → پروکسی Cloudflare Worker برای اتصال به مدل‌های AI
```

> ⚠️ **چرا Worker لازم است؟** API کلادفلر به دلیل محدودیت CORS و امنیت توکن، مستقیم از مرورگر قابل فراخوانی نیست. Worker نقش پل امن بین صفحه چت و مدل‌ها را دارد.

---

## 🚀 آموزش راه‌اندازی قدم‌به‌قدم

این آموزش توسط **Abbas bachari** آماده شده تا در کمتر از ۵ دقیقه چت‌بات را بالا بیاورید. 👇

### قدم ۱ — ساخت اکانت کلادفلر

1. به [cloudflare.com](https://dash.cloudflare.com) بروید و یک اکانت رایگان بسازید (یا وارد شوید).
2. پلن رایگان روزانه هزاران درخواست AI را بدون هزینه پوشش می‌دهد. 💰

### قدم ۲ — دیپلوی Worker

1. از منوی کناری داشبورد، به **Workers & Pages** بروید و روی **Create Worker** کلیک کنید.
2. یک نام دلخواه بدهید (مثلاً `nova-ai`) و **Deploy** بزنید.
3. روی **Edit Code** کلیک کنید، کد پیش‌فرض را کامل پاک کنید و کل محتوای فایل [`chatbot/worker.js`](chatbot/worker.js) را Paste کنید.
4. دوباره **Deploy** بزنید.

### قدم ۳ — اتصال Workers AI (مهم‌ترین قدم!)

1. در صفحه Worker خود به تب **Settings** ← بخش **Bindings** بروید.
2. روی **Add** کلیک کنید و گزینه **Workers AI** را انتخاب کنید.
3. نام binding را دقیقاً `AI` بگذارید و ذخیره کنید.

> 💡 نکته از Abbas bachari: اگر این قدم را رد کنید، خطای `AI is not defined` می‌گیرید!

### قدم ۴ — تنظیم فایل HTML

فایل [`chatbot/index.html`](chatbot/index.html) را باز کنید و در بخش تنظیمات ابتدای اسکریپت، مقادیر زیر را ویرایش کنید:

```javascript
// آدرس Worker خودتان را اینجا قرار دهید
const WORKER_URL = "https://nova-ai.YOUR-USERNAME.workers.dev";

// آدرس مخزن GitHub (لینک لوگوی بالای صفحه)
const GITHUB_URL = "https://github.com/Abbas-bachari";

// شخصیت ربات هم در ثابت SYSTEM_PROMPT قابل ویرایش است
```

### قدم ۵ — اجرا! 🎉

فایل `index.html` را در مرورگر باز کنید (یا روی GitHub Pages / Cloudflare Pages / هر هاستی آپلود کنید) و چت کنید!

---

## 🤖 مدل‌های پشتیبانی‌شده

### مدل‌های گفتگو 🧠
| مدل | شناسه |
|---|---|
| GLM 5.2 | `@cf/zai-org/glm-5.2` |
| Kimi K2.6 | `@cf/moonshotai/kimi-k2.6` |
| Llama 3.3 70B | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` |
| Llama 3.1 8B | `@cf/meta/llama-3.1-8b-instruct` |
| DeepSeek R1 32B | `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` |
| Qwen Coder 32B | `@cf/qwen/qwen2.5-coder-32b-instruct` |
| Qwen 1.5 14B | `@cf/qwen/qwen1.5-14b-chat-awq` |
| Gemma 3 12B | `@cf/google/gemma-3-12b-it` |
| Mistral 7B | `@cf/mistral/mistral-7b-instruct-v0.1` |

### مدل‌های تولید تصویر 🎨
| مدل | شناسه |
|---|---|
| FLUX 2 Klein 9B | `@cf/black-forest-labs/flux-2-klein-9b` |
| FLUX.1 Schnell | `@cf/black-forest-labs/flux-1-schnell` |
| SDXL | `@cf/stabilityai/stable-diffusion-xl-base-1.0` |
| DreamShaper 8 | `@cf/lykon/dreamshaper-8-lcm` |

> لیست کامل مدل‌ها: [developers.cloudflare.com/workers-ai/models](https://developers.cloudflare.com/workers-ai/models/)
>
> برای افزودن مدل جدید کافیست یک خط به آرایه `MODELS` در `index.html` اضافه کنید.

---

## 🔧 رفع اشکالات رایج

| خطا | علت و راه حل |
|---|---|
| `Use POST /chat` یا 404 روی تصویر | نسخه قدیمی worker.js دیپلوی شده؛ کد جدید را دوباره Deploy کنید |
| `AI is not defined` | Binding با نام `AI` در Settings ← Bindings اضافه نشده |
| تصویر بی‌ربط تولید می‌شود | از نسخه جدید worker.js استفاده کنید (ترجمه خودکار فارسی ← انگلیسی دارد) |
| خطای CORS | مقدار `Access-Control-Allow-Origin` در worker.js را بررسی کنید |
| پاسخی دریافت نمی‌شود | مدل دیگری امتحان کنید؛ بعضی مدل‌ها ممکن است موقتاً در دسترس نباشند |

---

<div align="center">

## 👨‍💻 سازنده

این پروژه با ❤️ توسط **Abbas bachari** ساخته شده است.

📬 ارتباط در تلگرام: [**@Mrfullhd**](https://t.me/Mrfullhd)

⭐ اگر این پروژه براتون مفید بود، ستاره فراموش نشه!

</div>
