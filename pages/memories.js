import { useState, useEffect } from "react";
import ZooHead from "../components/zoo-head";
import Prediction from "../components/prediction";

export default function History() {
  const [history, setHistory] = useState([]);
  const [anonId, setAnonId] = useState(null);

  function getPredictionOutput(prediction) {
    return `https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public/${prediction.id}.png`;
  }

  const clearHistory = () => {
    localStorage.removeItem("predictions");
    setHistory([]);
  };

  const handleClearHistory = (e) => {
    if (window.confirm("Do you really want to clear your Zoo history?")) {
      clearHistory();
    }
  };

  const getAndSetHistory = async (anonId) => {
    const response = await fetch("/api/users/" + anonId);
    const history = await response.json();
    setHistory(history);
  };

  useEffect(() => {
    const anonId = localStorage.getItem("anonId");
    setAnonId(anonId);
    getAndSetHistory(anonId);
  }, []);

  return (
    <div className="mx-auto container p-5">
      <ZooHead />
      <>
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Memories at the Zoo
            </h2>
          </div>
        </div>

        {history.length == 0 ? (
          <EmptyStateHistory />
        ) : (
          <>
            {" "}
            <ul
              role="list"
              className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
            >
              {history.map((prediction) => (
                <li key={prediction.id} className="relative">
                  <Prediction prediction={prediction} />
                  <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                    {prediction.model}
                  </p>
                  <p className="pointer-events-none block text-sm font-medium text-gray-500">
                    {prediction.input.prompt}
                  </p>
                </li>
              ))}
            </ul>
            {/* <div className="mt-12">
              <button
                onClick={() => handleClearHistory()}
                type="button"
                data-confirm="Are you sure you want to delete your Zoo history?"
                className="mr-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Clear Memories
              </button>
            </div> */}
          </>
        )}
      </>
    </div>
  );
}

export function EmptyStateHistory() {
  return (
    <div className="text-center mt-16">
      <img
        alt="confused robot"
        className="mx-auto rounded-lg"
        src="./confused_bot.png"
      />
      <h3 className="mt-12 text-sm font-semibold text-gray-900">
        No memories yet!
      </h3>
      <p className="mt-1 text-sm text-gray-500">Create some images first.</p>
    </div>
  );
}
