import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Arrow from "./assets/arrow.svg";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const summarize = async () => {
      const response = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        body: JSON.stringify({ input }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setOutput(json["summary"]);
      } else {
        if (response.status == 422) {
          setError("Input is required.");
          setIsLoading(false);
          setOutput("");
        }
      }
    };

    setOutput("");
    summarize();
    setIsLoading(true);
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        <Navbar />
        <main>
          <div className="wrapper">
            <h2>Text Summarizer</h2>
            <p>
              Simply enter any article, document, or lengthy text and our
              AI-powered summarizer will extract the key points and present them
              in a concise, easy-to-read format. Save time and stay informed
              with our smart text summarization tool.
            </p>
            <form action="" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <label htmlFor="input">
                  Input {error && <span className="error">* Required</span>}
                </label>
                <textarea
                  name="sentence"
                  id="input"
                  cols="30"
                  rows="5"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Enter or paste text and press "Summarize"'
                  onClick={() => setError("")}
                ></textarea>
                {output ? (
                  <div className="reset-wrapper">
                    <button type="submit" disabled={isLoading}>
                      {isLoading ? "Summarizing..." : "Re-Summarize"}
                    </button>
                    <button className="reset" onClick={handleReset}>
                      Reset
                    </button>
                  </div>
                ) : (
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Summarizing..." : "Summarize"}
                  </button>
                )}
              </div>
              <div className="icon-container">
                <div className="icon-wrapper">
                  <img src={Arrow} alt="" />
                </div>
              </div>
              <div className="input-wrapper">
                <label htmlFor="input">Output</label>
                <div className="output">{output && output}</div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
