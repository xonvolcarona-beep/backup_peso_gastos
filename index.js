import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.send("🚀 API de Backup funcionando");
});

app.post("/backup-json", async (req, res) => {
  const { filename, jsonContent } = req.body;

  try {
    await resend.emails.send({
      from: "Backup App <noreply@tudominio.com>", // remitente verificado en Resend
      to: "megawhitegengar@gmail.com",
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
