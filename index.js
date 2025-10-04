import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Hardcodeando API Key solo para pruebas locales
const resend = new Resend("re_2XmTYuAq_NpG6rWW8jyiXg7FeNoCUCHzb");

app.get("/", (req, res) => {
  res.send("🚀 API de Backup funcionando");
});

app.post("/backup-json", async (req, res) => {
  const { filename, jsonContent } = req.body;

  try {
    await resend.emails.send({
      from: "Backup App <noreply@sandbox.resend.com>", // remitente de prueba
      to: "megawhitegengar@gmail.com",               // tu correo verificado en sandbox
      subject: `Backup: ${filename}`,
      text: "Adjunto respaldo de la base de datos.",
      attachments: [
        {
          filename,
          content: Buffer.from(jsonContent).toString("base64"),
        },
      ],
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error enviando correo:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
