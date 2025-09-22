// routes/rsrtc.ts
import express from "express";
import { getAvailableServices } from "../services/rsrtc";

const router = express.Router();

router.get("/services", async (req, res) => {
  const { date, depot } = req.query;
  try {
    const services = await getAvailableServices(
      (date as string) || "21/09/2025",
      (depot as string) || "JPR"
    );
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

export default router;
