import express, {Request, Response} from "express";
import path from "path";

const app = express();

const PORT = 3000

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../static/index.html"));
});

app.listen(PORT)

console.log("listening on port " + 3000)