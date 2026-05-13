"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import generateSpec from "./generateSpec";

// force vega rendering on the client
const VegaEmbed = dynamic(() => import("react-vega").then((m) => m.VegaEmbed), {
  ssr: false,
});

// extracts responses and reformats each data point
// in accordance to vega expectations
function extractDataPoints(jsonData: Question | null): DataPoint[] | undefined {
  if (jsonData == null) {
    return undefined;
  }

  var data: DataPoint[] = [];

  Object.entries(jsonData).forEach((entry) => {
    const questionKey = entry[0];
    const questionValue = entry[1];

    if (questionValue.distribution.length > 1) {
      questionValue.distribution.forEach((response) => {
        data.push({
          question: questionKey,
          likert: String(response.likert),
          count: response.count,
          percentage: response.percentage,
          prompt: questionKey + ": " + questionValue.description,
          mean: questionValue.mean,
          median: questionValue.median,
        });
      });
    }
  });

  console.log(data);

  return data;
}

export default function Page() {
  const [data, setData] = useState<DataPoint[] | undefined>();

  useEffect(() => {
    fetch("/evaluation_results/DIT333 Fake Course Likert Updated.json") // add variable to handle course name
      .then((res) => res.json())
      .then((data) => {
        setData(extractDataPoints(data));
      });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-fold mb-4">Course Evaluation</h1>
      {!!data && (
        <VegaEmbed
          spec={generateSpec(data, "Course Chart")}
          options={{
            actions: false, // read docs, we could export plots to svg/png
          }}
        />
      )}
    </div>
  );
}
