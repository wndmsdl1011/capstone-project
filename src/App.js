import { ToastContainer } from "react-toastify";
import "./App.css";
import AppRouter from "./routes/AppRouter";

// npm install axios

function App() {
  return (
    <div>
      <AppRouter />
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ❌
          </button>
        )}
        onClose={() => {
          try {
            // optional: console.log("Toast closed")
          } catch (e) {
            console.error("Error during toast close:", e);
          }
        }}
      />
    </div>
  );
}

export default App;
