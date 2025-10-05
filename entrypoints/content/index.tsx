import "./app.css";
import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "solread-content",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        // Don't mount react app directly on <body>
        const solreadContentWrapper = document.createElement("div");
        container.append(solreadContentWrapper);

        const root = ReactDOM.createRoot(solreadContentWrapper);
        root.render(<App />);
        return { root, solreadContentWrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.solreadContentWrapper.remove();
      },
    });

    ui.mount();
  },
});
