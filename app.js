import express from "express";
import qr from "qr-image";
import fs from "fs";

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// API to generate QR Code
app.post("/generate-qr", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const qr_svg = qr.image(url, { type: "png" });
        const filePath = `qr_img_${Date.now()}.png`;

        const stream = fs.createWriteStream(filePath);
        qr_svg.pipe(stream);

        stream.on("finish", () => {
            res.json({ message: "QR Code generated", filePath });
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate QR Code" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
