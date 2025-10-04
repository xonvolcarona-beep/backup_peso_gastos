import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Hardcodeando API Key solo para pruebas locales
const resend = new Resend("re_RYTwcJGu_2HRuTJ2cnenB5whK9MsY32i5");

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🚀 API de Backup funcionando");
});

// Endpoint para enviar backup JSON como adjunto
app.post("/backup-json", async (req, res) => {
  const { filename, jsonContent } = req.body;

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",           // remitente de prueba sencillo
      to: "megawhitegengar@gmail.com",        // correo verificado en sandbox
      subject: `Backup: ${filename}`,
      text: "Adjunto respaldo de la base de datos.",
      attachments: [
        {
          filename,
          content: Buffer.from(jsonContent).toString("base64"),
        },
      ],
    });

    console.log("✅ Correo enviado:", result);
    res.json({ success: true, message: "Correo enviado con éxito" });
  } catch (err) {
    console.error("❌ Error enviando correo:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
