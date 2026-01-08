---
description: Accessing Ingredo on Phone & Public Web
---

# Option 1: Local Network (Same WiFi)
Since the dev server is running with `--host`:
1.  Ensure your phone is on the **same WiFi network** as this computer.
2.  Open your phone's browser (Chrome/Safari).
3.  Navigate to the **Network URL** shown in your terminal (usually starts with `192.168...` or `10.0...`).
    *   *Example:* `http://192.168.1.5:5173`

# Option 2: Public URL (Deploy to Vercel)
To make the app accessible from anywhere (4G/5G/Different WiFi):

1.  **Install Vercel CLI** (optional, or use web UI):
    ```bash
    npm i -g vercel
    ```

2.  **Deploy**:
    ```bash
    vercel
    ```
    *   Follow the prompts (accept defaults).

3.  **Result**: You will get a `https://ingredo-xyz.vercel.app` link that works everywhere.

# Option 3: Quick Public Tunnel (Localtunnel)
If you don't want to deploy yet but need a public link instantly:

1.  **Install Localtunnel**:
    ```bash
    npm install -g localtunnel
    ```

2.  **Start Tunnel** (assuming app runs on 5173):
    ```bash
    lt --port 5173
    ```

3.  **Result**: It will give you a temporary public URL (e.g., `https://funny-cat-50.loca.lt`).
