import React from "react";
import Main from "./components/main/Main";
import Quiz from "./components/quiz/Quiz";

export default function App() {
  const [ready, setReady] = React.useState(false);
  return (
    <main>
      {!ready ? (
        <>
          <Main />
          <button className="start" onClick={() => setReady((prev) => !prev)}>
            Start Quiz
          </button>
        </>
      ) : (
        <Quiz />
      )}
    </main>
  );
}
