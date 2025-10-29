import { useState } from "react";

import "reactflow/dist/style.css";
import JSONEditor from "./JSONEditor";

const sampleJSON = `{
  "fruits": [
    {
      "name": "Apple",
      "color": "#FF0000",
      "details": {
        "type": "Pome",
        "season": "Fall"
      },
      "nutrients": {
        "calories": 32,
        "fiber": "2.4g",
        "vitaminC": "4.0mg"
      }
    },
    {
      "name": "Banana",
      "color": "#FFFF00",
      "details": {
        "type": "Berry",
        "season": "Year-round"
      },
      "nutrients": {
        "calories": 89,
        "fiber": "2.6g",
        "potassium": "358mg"
      }
    },
    {
      "name": "Orange",
      "color": "#FFA500",
      "details": {
        "type": "Citrus",
        "season": "Winter"
      },
      "nutrients": {
        "calories": 47,
        "fiber": "2.4g",
        "vitaminC": "33.2mg"
      }
    }
  ]
}`;

const JSONTreeVisualizer = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const handleVisualize = () => {};

  const loadSampleJSON = () => {
    setJsonInput(sampleJSON);
    setTimeout(() => handleVisualize(sampleJSON), 100);
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError("Cannot format invalid JSON");
    }
  };

  const clearAll = () => {
    setJsonInput("");
    setError("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-56px)] overflow-hidden p-4 bg-gray-50">
      <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden">
          <JSONEditor
            value={jsonInput}
            onChange={setJsonInput}
            onVisualize={handleVisualize}
            error={error}
            onLoadSample={loadSampleJSON}
            onFormat={formatJSON}
            onClear={clearAll}
          />
        </div>
      </div>
    </div>
  );
};

export default JSONTreeVisualizer;
