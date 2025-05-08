<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>קבצי CSS ו-JavaScript לתמיכה ב-Shadcn UI באתר המלצלי</title>
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.js"></script>
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Icons -->
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js"></script>

  <style>
    /* RTL Support for Tailwind */
    html[dir="rtl"] .ltr {
      direction: ltr !important;
    }
    
    html[dir="rtl"] .rtl {
      direction: rtl !important;
    }
    
    /* Base Styles and Variables for Shadcn UI */
    :root {
      --font-sans: 'Rubik', sans-serif;
      
      /* Light Mode Colors */
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 221.2 83.2% 53.3%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 221.2 83.2% 53.3%;
      --radius: 0.5rem;
    }
    
    .dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
      --card: 222.2 84% 4.9%;
      --card-foreground: 210 40% 98%;
      --popover: 222.2 84% 4.9%;
      --popover-foreground: 210 40% 98%;
      --primary: 217.2 91.2% 59.8%;
      --primary-foreground: 210 40% 98%;
      --secondary: 217.2 32.6% 17.5%;
      --secondary-foreground: 210 40% 98%;
      --muted: 217.2 32.6% 17.5%;
      --muted-foreground: 215 20.2% 65.1%;
      --accent: 217.2 32.6% 17.5%;
      --accent-foreground: 210 40% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 210 40% 98%;
      --border: 217.2 32.6% 17.5%;
      --input: 217.2 32.6% 17.5%;
      --ring: 224.3 76.3% 48%;
    }

    /* המלצלי Custom Theme */
    .theme-hamlatzli {
      --primary: 196 100% 47%;
      --primary-foreground: 0 0% 100%;
      --secondary: 43 96% 58%;
      --secondary-foreground: 0 0% 100%;
      --accent: 262 83% 58%;
      --accent-foreground: 0 0% 100%;
    }
    
    /* Global Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--font-sans);
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
      min-height: 100vh;
      direction: rtl;
      text-align: right;
    }
    
    /* Shadcn UI Component Styles */
    
    /* Button */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius);
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      padding: 0.5rem 1rem;
    }
    
    .btn-primary {
      background-color: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border: none;
    }
    
    .btn-primary:hover {
      opacity: 0.9;
    }
    
    .btn-secondary {
      background-color: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
      border: none;
    }
    
    .btn-secondary:hover {
      opacity: 0.9;
    }
    
    .btn-outline {
      background-color: transparent;
      border: 1px solid hsl(var(--border));
      color: hsl(var(--foreground));
    }
    
    .btn-outline:hover {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
    
    /* Card */
    .card {
      background-color: hsl(var(--card));
      color: hsl(var(--card-foreground));
      border-radius: calc(var(--radius) * 1.5);
      border: 1px solid hsl(var(--border));
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid hsl(var(--border));
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
    
    .card-description {
      color: hsl(var(--muted-foreground));
      margin-top: 0.25rem;
      font-size: 0.875rem;
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .card-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid hsl(var(--border));
    }
    
    /* Form Elements */
    .input {
      display: block;
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      border-radius: var(--radius);
      border: 1px solid hsl(var(--input));
      background-color: transparent;
      color: hsl(var(--foreground));
    }
    
    .input:focus {
      outline: none;
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 2px rgba(var(--ring), 0.3);
    }
    
    .input-group {
      margin-bottom: 1rem;
    }
    
    .input-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .input-description {
      color: hsl(var(--muted-foreground));
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    
    /* Select */
    .select {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
    }
    
    .select select {
      appearance: none;
      width: 100%;
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      font-size: 0.875rem;
      border-radius: var(--radius);
      border: 1px solid hsl(var(--input));
      background-color: transparent;
      color: hsl(var(--foreground));
      cursor: pointer;
    }
    
    .select select:focus {
      outline: none;
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 2px rgba(var(--ring), 0.3);
    }
    
    .select::after {
      content: '';
      position: absolute;
      left: 0.75rem;
      top: 50%;
      width: 0.6em;
      height: 0.4em;
      background-color: currentColor;
      clip-path: polygon(100% 0%, 0% 0%, 50% 100%);
      transform: translateY(-50%);
      pointer-events: none;
    }
    
    /* Checkbox */
    .checkbox-container {
      display: flex;
      align-items: center;
    }
    
    .checkbox {
      appearance: none;
      width: 1rem;
      height: 1rem;
      border-radius: calc(var(--radius) / 2);
      border: 1px solid hsl(var(--border));
      background-color: transparent;
      margin-left: 0.5rem;
      position: relative;
    }
    
    .checkbox:focus {
      outline: none;
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 2px rgba(var(--ring), 0.3);
    }
    
    .checkbox:checked {
      background-color: hsl(var(--primary));
      border-color: hsl(var(--primary));
    }
    
    .checkbox:checked::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 45%;
      width: 0.25rem;
      height: 0.5rem;
      border: solid hsl(var(--primary-foreground));
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    
    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px;
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }
    
    .badge-primary {
      background-color: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
    }
    
    .badge-secondary {
      background-color: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
    }
    
    .badge-outline {
      background-color: transparent;
      border: 1px solid hsl(var(--border));
      color: hsl(var(--foreground));
    }
    
    /* Alert */
    .alert {
      position: relative;
      padding: 1rem;
      border-radius: var(--radius);
      border-left: 4px solid transparent;
    }
    
    .alert-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .alert-description {
      font-size: 0.875rem;
    }
    
    .alert-info {
      background-color: rgba(var(--primary), 0.1);
      border-color: hsl(var(--primary));
    }
    
    .alert-warning {
      background-color: rgba(var(--warning), 0.1);
      border-color: hsl(var(--warning));
    }
    
    .alert-error {
      background-color: rgba(var(--destructive), 0.1);
      border-color: hsl(var(--destructive));
    }
    
    .alert-success {
      background-color: rgba(var(--success), 0.1);
      border-color: hsl(var(--success));
    }
    
    /* Avatar */
    .avatar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      background-color: hsl(var(--muted));
      color: hsl(var(--muted-foreground));
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Tabs */
    .tabs {
      display: flex;
      border-bottom: 1px solid hsl(var(--border));
    }
    
    .tab {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }
    
    .tab-active {
      color: hsl(var(--primary));
      border-bottom-color: hsl(var(--primary));
    }
    
    /* Dialog / Modal */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }
    
    .dialog {
      background-color: hsl(var(--background));
      border-radius: var(--radius);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 28rem;
      padding: 1.5rem;
      position: relative;
    }
    
    .dialog-header {
      margin-bottom: 1.5rem;
    }
    
    .dialog-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }
    
    .dialog-description {
      color: hsl(var(--muted-foreground));
      margin-top: 0.25rem;
      font-size: 0.875rem;
    }
    
    .dialog-content {
      margin-bottom: 1.5rem;
    }
    
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    
    /* Toast Notifications */
    .toast-container {
      position: fixed;
      bottom: 0;
      left: 0;
      padding: 1rem;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .toast {
      background-color: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      width: 350px;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    /* RTL Specific Adjustments */
    html[dir="rtl"] .select::after {
      right: auto;
      left: 0.75rem;
    }
    
    html[dir="rtl"] .checkbox {
      margin-right: 0;
      margin-left: 0.5rem;
    }
    
    html[dir="rtl"] .alert {
      border-right: 4px solid transparent;
      border-left: none;
    }
    
    html[dir="rtl"] .toast-container {
      left: auto;
      right: 0;
    }
    
    html[dir="rtl"] @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Printing/PDF Optimization */
    @media print {
      body {
        width: 100%;
        margin: 0;
        padding: 0;
      }
      
      .no-print {
        display: none !important;
      }
      
      .page-break-inside-avoid {
        page-break-inside: avoid;
      }
    }

    /* Documentation Styles */
    .section {
      margin-bottom: 3rem;
      padding: 1.5rem;
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
    }
    
    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: hsl(var(--primary));
    }
    
    .code-block {
      background-color: hsl(var(--muted));
      padding: 1rem;
      border-radius: var(--radius);
      font-family: monospace;
      overflow-x: auto;
      white-space: pre;
      margin: 1rem 0;
    }
    
    .component-demo {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px dashed hsl(var(--border));
      border-radius: var(--radius);
    }
  </style>
</head>
<body class="theme-hamlatzli">
  <header class="py-6 px-8 border-b border-solid border-gray-200">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-primary">קבצי CSS ו-JavaScript לתמיכה ב-Shadcn UI באתר המלצלי</h1>
      <p class="mt-2 text-muted-foreground">מדריך למפתחים להטמעת רכיבי Shadcn UI עם תמיכה בעברית וכיוון RTL</p>
    </div>
  </header>

  <main class="max-w-6xl mx-auto py-12 px-8">
    <section class="section">
      <h2 class="section-title">הקדמה</h2>
      <p>
        המסמך הזה מכיל את כל הקבצים והמשאבים הנדרשים כדי להטמיע את ספריית Shadcn UI באתר המלצלי,
        עם תמיכה מלאה בעברית וכיוון RTL. הקוד שנמצא כאן מאפשר לך להשתמש ברכיבים המודרניים של Shadcn UI
        תוך שמירה על חוויית משתמש אופטימלית בעברית.
      </p>
    </section>

    <section class="section">
      <h2 class="section-title">התקנת Shadcn UI</h2>
      <p>ישנן שתי דרכים להתקין את Shadcn UI באתר המלצלי:</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">אפשרות 1: שימוש ב-CDN (קל לשילוב)</h3>
      <p>הוסף את הקישורים הבאים לתגית ה-&lt;head&gt; של כל דפי האתר:</p>
      
      <div class="code-block">
&lt;script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.js"&gt;&lt;/script&gt;
&lt;link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"&gt;
&lt;link rel="stylesheet" href="/css/shadcn-ui.css"&gt;
&lt;script src="/js/shadcn-ui.js" defer&gt;&lt;/script&gt;
      </div>
      
      <p>הערה: עליך ליצור את הקבצים shadcn-ui.css ו-shadcn-ui.js על בסיס הקוד במסמך זה.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">אפשרות 2: התקנה מלאה באמצעות npm (מומלץ לפיתוח)</h3>
      <div class="code-block">
# התקנת Shadcn UI עם תמיכה ב-React
npm install @radix-ui/react-icons
npx shadcn-ui@latest init

# לאחר מכן להוסיף רכיבים ספציפיים
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
# וכן הלאה...
      </div>
    </section>
    
    <section class="section">
      <h2 class="section-title">רכיבים בסיסיים</h2>
      <p>להלן מספר רכיבים בסיסיים שתוכל להשתמש בהם באתר:</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">כפתורים</h3>
      <div class="component-demo flex gap-4 flex-wrap">
        <button class="btn btn-primary">כפתור ראשי</button>
        <button class="btn btn-secondary">כפתור משני</button>
        <button class="btn btn-outline">כפתור מתאר</button>
      </div>
      <div class="code-block">
&lt;button class="btn btn-primary"&gt;כפתור ראשי&lt;/button&gt;
&lt;button class="btn btn-secondary"&gt;כפתור משני&lt;/button&gt;
&lt;button class="btn btn-outline"&gt;כפתור מתאר&lt;/button&gt;
      </div>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">כרטיסיות</h3>
      <div class="component-demo">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">כותרת הכרטיסייה</h3>
          </div>
          <div class="card-content">
            <p>תוכן הכרטיסייה נמצא כאן. אפשר להוסיף טקסט, תמונות, או כל תוכן אחר.</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary">פעולה</button>
          </div>
        </div>
      </div>
      <div class="code-block">
&lt;div class="card"&gt;
  &lt;div class="card-header"&gt;
    &lt;h3 class="card-title"&gt;כותרת הכרטיסייה&lt;/h3&gt;
  &lt;/div&gt;
  &lt;div class="card-content"&gt;
    &lt;p&gt;תוכן הכרטיסייה נמצא כאן.&lt;/p&gt;
  &lt;/div&gt;
  &lt;div class="card-footer"&gt;
    &lt;button class="btn btn-primary"&gt;פעולה&lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;
      </div>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">שדות קלט</h3>
      <div class="component-demo">
        <div class="input-group">
          <label class="input-label">שם מלא</label>
          <input type="text" class="input" placeholder="הכנס את שמך המלא">
          <p class="input-description">השם שיוצג בפרופיל שלך</p>
        </div>
      </div>
      <div class="code-block">
&lt;div class="input-group"&gt;
  &lt;label class="input-label"&gt;שם מלא&lt;/label&gt;
  &lt;input type="text" class="input" placeholder="הכנס את שמך המלא"&gt;
  &lt;p class="input-description"&gt;השם שיוצג בפרופיל שלך&lt;/p&gt;
&lt;/div&gt;
      </div>
    </section>
    
    <section class="section">
      <h2 class="section-title">התאמות RTL</h2>
      <p>
        כל הרכיבים ב-Shadcn UI הותאמו לתמיכה מלאה בעברית וכיוון RTL. 
        כדי להפעיל את התמיכה ב-RTL, וודא שהתגית &lt;html&gt; מכילה את התכונה dir="rtl" ואת התכונה lang="he".
      </p>
      
      <div class="code-block">
&lt;html lang="he" dir="rtl"&gt;
  ...
&lt;/html&gt;
      </div>
      
      <p class="mt-4">
        אם אתה צריך לשנות את הכיוון של אלמנט מסוים בחזרה ל-LTR (למשל עבור אנגלית), השתמש במחלקה "ltr":
      </p>
      
      <div class="code-block">
&lt;p class="ltr"&gt;This text will be displayed left-to-right&lt;/p&gt;
      </div>
    </section>
    
    <section class="section">
      <h2 class="section-title">ערכת נושא מותאמת</h2>
      <p>
        ניתן להתאים את ערכת הצבעים של Shadcn UI לפי העיצוב של אתר המלצלי.
        הקוד שלהלן מגדיר ערכת נושא מותאמת בשם "theme-hamlatzli":
      </p>
      
      <div class="code-block">
.theme-hamlatzli {
  --primary: 196 100% 47%;
  --primary-foreground: 0 0% 100%;
  --secondary: 43 96% 58%;
  --secondary-foreground: 0 0% 100%;
  --accent: 262 83% 58%;
  --accent-foreground: 0 0% 100%;
}
      </div>
      
      <p class="mt-4">
        כדי להפעיל את ערכת הנושא, הוסף את המחלקה "theme-hamlatzli" לתגית &lt;body&gt;:
      </p>
      
      <div class="code-block">
&lt;body class="theme-hamlatzli"&gt;
  ...
&lt;/body&gt;
      </div>
    </section>
    
    <section class="section">
      <h2 class="section-title">תמיכה במצב כהה (Dark Mode)</h2>
      <p>
        הקוד כולל גם תמיכה במצב כהה. כדי להפעיל את המצב הכהה, הוסף את המחלקה "dark" לתגית &lt;html&gt;:
      </p>
      
      <div class="code-block">
&lt;html lang="he" dir="rtl" class="dark"&gt;
  ...
&lt;/html&gt;
      </div>
      
      <p class="mt-4">
        אתה יכול גם להפעיל את המצב הכהה באופן דינמי באמצעות JavaScript:
      </p>
      
      <div class="code-block">
// החלפת מצב כהה/בהיר
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}

// בדיקה האם המשתמש מעדיף מצב כהה
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}
      </div>
    </section>
    
    <section class="section">
      <h2 class="section-title">קוד JavaScript בסיסי</h2>
      <p>
        להלן קוד JavaScript בסיסי שתוכל להוסיף לאתר כדי להפעיל חלק מהפונקציונליות של Shadcn UI:
      </p>
      
      <div class="code-block">
// shadcn-ui.js - קוד בסיסי לתמיכה ברכיבים

// טוען אייקונים מספריית Lucide
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// מאפשר לשלוט בתפריטים נפתחים
document.addEventListener('DOMContentLoaded', function() {
  // תפריט נפתח בסיסי
  const dropdownToggle = document.querySelectorAll('[data-dropdown-toggle]');
  
  dropdownToggle.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(toggle.getAttribute('data-dropdown-toggle'));
      
      if (target) {
        target.classList.toggle('hidden');
      }
    });
  });
  
  // סגירת תפריט נפתח בלחיצה מחוץ לו
  document.addEventListener('click', function(e) {
    dropdownToggle.forEach(toggle => {
      const target = document.querySelector(toggle.getAttribute('data-dropdown-toggle'));
      
      if (target && !target.contains(e.target) && !toggle.contains(e.target)) {
        target.classList.add('hidden');
      }
    });
  });
  
  // טיפול בלשוניות (tabs)
  const tabButtons = document.querySelectorAll('[data-tab]');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = button.getAttribute('data-tab');
      const tabContent = document.querySelector(`[data-tab-content="${tabId}"]`);
      
      // הסתרת כל התוכן של הלשוניות
      document.querySelectorAll('[data-tab-content]').forEach(content => {
        content.classList.add('hidden');
      });
      
      // הסרת הסימון הפעיל מכל הלשוניות
      document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('tab-active');
      });
      
      // הצגת התוכן הנוכחי והדגשת הלשונית
      if (tabContent) {
        tabContent.classList.remove('hidden');
      }
      
      button.classList.add('tab-active');
    });
  });
});

// יצירת התראות (toasts)
function createToast(message, type = 'default', duration = 3000) {
  // בדיקה אם מיכל ההתראות קיים
  let toastContainer = document.querySelector('.toast-container');
  
  // יצירת מיכל אם הוא לא קיים
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // יצירת התראה חדשה
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // הוספת ההתראה למיכל
  toastContainer.appendChild(toast);
  
  // הסרת ההתראה אחרי משך זמן מסוים
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// מעבר בין מצבים בהיר/כהה
function toggleTheme() {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

// בדיקה של ההעדפה השמורה
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }
});
      </div>
    </section>
    
    <section class="section">
      <h2 class="section-title">המלצות לשימוש באתר המלצלי</h2>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">כרטיסיות המלצה</h3>
      <div class="component-demo">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">מסעדת אבו חסן</h3>
            <div class="badge badge-primary">מסעדות</div>
          </div>
          <div class="card-content">
            <div class="flex justify-between items-center mb-4">
              <div class="text-yellow-500">★★★★★</div>
              <div class="text-green-600">₪₪</div>
            </div>
            <p>החומוס הטוב ביותר ביפו! חובה לכל מי שמחפש אוכל אותנטי ואווירה נעימה. מומלץ להגיע מוקדם כי תמיד יש תור.</p>
          </div>
          <div class="card-footer flex justify-between">
            <div class="flex items-center">
              <span class="avatar">
                <img src="https://ui.shadcn.com/examples/mail-dark.png" alt="משתמש">
              </span>
              <span class="mr-2">יוסי כהן</span>
            </div>
            <div>
              <button class="btn btn-outline btn-sm">עוד פרטים</button>
            </div>
          </div>
        </div>
      </div>
      <div class="code-block">
&lt;div class="card"&gt;
  &lt;div class="card-header"&gt;
    &lt;h3 class="card-title"&gt;מסעדת אבו חסן&lt;/h3&gt;
    &lt;div class="badge badge-primary"&gt;מסעדות&lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="card-content"&gt;
    &lt;div class="flex justify-between items-center mb-4"&gt;
      &lt;div class="text-yellow-500"&gt;★★★★★&lt;/div&gt;
      &lt;div class="text-green-600"&gt;₪₪&lt;/div&gt;
    &lt;/div&gt;
    &lt;p&gt;החומוס הטוב ביותר ביפו! חובה לכל מי שמחפש אוכל אותנטי ואווירה נעימה.&lt;/p&gt;
  &lt;/div&gt;
  &lt;div class="card-footer flex justify-between"&gt;
    &lt;div class="flex items-center"&gt;
      &lt;span class="avatar"&gt;
        &lt;img src="avatar.jpg" alt="משתמש"&gt;
      &lt;/span&gt;
      &lt;span class="mr-2"&gt;יוסי כהן&lt;/span&gt;
    &lt;/div&gt;
    &lt;div&gt;
      &lt;button class="btn btn-outline btn-sm"&gt;עוד פרטים&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
      </div>
    </section>
  </main>
  
  <footer class="py-8 px-8 mt-12 border-t border-solid border-gray-200 text-center">
    <div class="max-w-6xl mx-auto">
      <p>כל הזכויות שמורות © 2024 המלצלי</p>
      <p class="text-muted-foreground mt-2">נבנה עם Shadcn UI</p>
    </div>
  </footer>
  
  <script>
    // דוגמה בסיסית להפעלת רכיבים
    document.addEventListener('DOMContentLoaded', function() {
      // הפעלת הדגמה של התראה (toast)
      const createToastExample = function(message, type) {
        // בדיקה אם מיכל ההתראות קיים
        let toastContainer = document.querySelector('.toast-container');
        
        // יצירת מיכל אם הוא לא קיים
        if (!toastContainer) {
          toastContainer = document.createElement('div');
          toastContainer.className = 'toast-container';
          document.body.appendChild(toastContainer);
        }
        
        // יצירת התראה חדשה
        const toast = document.createElement('div');
        toast.className = `toast ${type ? 'toast-' + type : ''}`;
        toast.textContent = message;
        
        // הוספת ההתראה למיכל
        toastContainer.appendChild(toast);
        
        // הסרת ההתראה אחרי משך זמן מסוים
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
            toast.remove();
          }, 300);
        }, 3000);
      };
      
      // הוספת אירועי לחיצה לכפתורים בדף
      document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
          createToastExample('הפעולה בוצעה בהצלחה', 'success');
        });
      });
    });
  </script>
</body>
</html>
