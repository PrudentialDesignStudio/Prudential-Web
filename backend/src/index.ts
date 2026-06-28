import app from "./app.js";
import db from "./lib/db.js";

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`PIS API server running on http://localhost:${PORT}`);
});

// Checkpoint the WAL file on shutdown so data persists through Railway restarts.
function shutdown() {
  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
  } catch {}
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
