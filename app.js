import express from "express";
import qr from "qr-image";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("QR Code Generator API is running!");
});

app.post("/generate-qr", (req, res) => {
    try {
        const qr_svg = qr.image(req.body.url, { type: "png" });
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
