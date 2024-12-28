import express from "express";
import qr from "qr-image";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.resolve("public");

// Create the public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

app.use(express.json());

// Serve static files from the public directory
app.use("/public", express.static(publicDir));

// Default route
app.get("/", (req, res) => {
    res.send("QR Code Generator API is running!");
});

// QR Code generation route
app.post("/generate-qr", (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const qr_svg = qr.image(url, { type: "png" });
        const fileName = `qr_img_${Date.now()}.png`;
        const filePath = path.join(publicDir, fileName);

        const stream = fs.createWriteStream(filePath);
        qr_svg.pipe(stream);

        stream.on("finish", () => {
            res.json({
                message: "QR Code generated",
                filePath: `/public/${fileName}`
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate QR Code" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
