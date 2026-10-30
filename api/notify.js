
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, service, quantity } = req.body || {};

    if (
      typeof username !== "string" ||
      !/^[a-zA-Z0-9._]{1,30}$/.test(username) ||
      !["Followers", "Likes", "Views"].includes(service) ||
      ![1000, 5000, 10000, 50000, 100000].includes(Number(quantity))
    ) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ error: "Server configuration missing" });
    }

    const time = new Date().toLocaleString("en-PK", {
      timeZone: "Asia/Karachi"
    });

    const message =
`🔔 NEW WEBSITE REQUEST

👤 Username: @${username}
📦 Service: ${service}
🔢 Quantity: ${Number(quantity).toLocaleString()}

🕒 Time: ${time}

⚡ C9 UZAIR GROWTH CENTER`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      return res.status(502).json({ error: "Telegram delivery failed" });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
