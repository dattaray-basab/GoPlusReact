import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 8081;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
app.use(bodyParser.json());

interface SaveRequest {
  jsonData: any;
  directory: string;
  fileName: string;
}

app.post("/api/save", (req: Request<{}, {}, SaveRequest>, res: Response) => {
  const { jsonData, directory, fileName } = req.body;

  try {
    // Create directory if it doesn't exist
    fs.mkdirSync(directory, { recursive: true });

    // Create file path
    const filePath = path.join(directory, fileName);

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    res.json({ message: `Data saved to ${filePath}` });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ error: "Failed to save file" });
  }
});

app.get("/api/fetch", (req: Request, res: Response) => {
  const { directory, fileName } = req.query;

  if (typeof directory !== "string" || typeof fileName !== "string") {
    return res.status(400).json({ error: "Invalid directory or fileName" });
  }

  try {
    const filePath = path.join(directory, fileName);

    // Read file
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Parse JSON
    const parsedData = JSON.parse(jsonData);

    res.json(parsedData);
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Failed to read file" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
