import app from "./app";
import { PORT } from "./utils/secrets";

// Start the server
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
