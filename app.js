import express from "express";
import qr from "qr-image";
import fs from "fs";
import path from "path"; // Use `import` for path

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the public directory
app.use("/public", express.static(path.resolve("public"))); // Use `path.resolve`

// Default route
app.get("/", (req, res) => {
    res.send("QR Code Generator API is running!");
});

app.post("/generate-qr", (req, res) => {
    try {
        const qr_svg = qr.image(req.body.url, { type: "png" });
        const fileName = `qr_img_${Date.now()}.png`;
        const filePath = path.resolve("public", fileName);

        const stream = fs.createWriteStream(filePath);
        qr_svg.pipe(stream);

        stream.on("finish", () => {
            res.json({
                message: "QR Code generated",
                filePath: `/public/${fileName}` // Public URL for the file
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate QR Code" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
