import { VisualizationSpec } from "vega-embed";

const TICK_OFFSET = 10;
const TICKS = Array.from({ length: 21 }, (_, i) => -100 + i * TICK_OFFSET);

export default function generateSpec(
  data: DataPoint[],
  description: string,
): VisualizationSpec {
  return {
    width: 1000, // ← Must be set here

    config: {
      background: "var(--color-background)",
      axis: {
        titleColor: "var(--color-on-background)",
        labelColor: "var(--color-on-background)",
      },
      legend: {
        titleColor: "var(--color-on-background)",
        labelColor: "var(--color-on-background)",
      },
      title: {
        color: "var(--color-on-background)",
      },
    },

    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description,

    data: {
      values: data,
    },

    transform: [
      {
        // Transforms the string labels into numberic based on the index matching.
        // if(a,b,c) is a ternary operator in Vega-like.
        calculate: "indexof(['1','2','3','4','5'], datum.likert) - 2",
        as: "q_order",
      },
      {
        calculate:
          "if (datum.likert === '1' || datum.likert === '2', datum.percentage, 0) + if (datum.likert === '3', datum.percentage/2, 0)",
        as: "signed_percentage",
      },
      {
        stack: "percentage",
        as: ["barStart", "barEnd"],
        groupby: ["question"],
      },
      {
        joinaggregate: [
          {
            field: "signed_percentage",
            op: "sum",
            as: "offset",
          },
        ],
        groupby: ["question"],
      },
      { calculate: "datum.barStart - datum.offset", as: "xStart" },
      { calculate: "datum.barEnd   - datum.offset", as: "xEnd" },
      {
        calculate:
          "((datum.barStart - datum.offset) + (datum.barEnd   - datum.offset))/2",
        as: "xMid",
      },
    ],

    layer: [
      {
        mark: "bar",
        encoding: {
          x: {
            field: "xStart",
            type: "quantitative",
            title: "Percentage",
            scale: {
              domain: [-100, 100],
            },
            axis: {
              values: TICKS,
              format: ".0f", // Show as 0, 10, 20...
              labels: true,
              labelOverlap: false,
              labelBound: true,
            },
          },
          x2: {
            field: "xEnd",
          },
          y: {
            field: "question",
            type: "nominal",
            axis: {
              title: "Questions",
              offset: 5,
              ticks: false,
              minExtent: 100,
              domain: false,
            },
          },
          color: {
            field: "likert",
            type: "ordinal",
            scale: {
              domain: ["1", "2", "3", "4", "5"],
              range: [
                "var(--color-diverging--2)",
                "var(--color-diverging--1)",
                "var(--color-diverging-0)",
                "var(--color-diverging-1)",
                "var(--color-diverging-2)",
              ], // fix colors - try to create a vega scheme?
              type: "ordinal",
            },
            legend: { title: "Likert scale" },
          },
          tooltip: [
            { field: "prompt", type: "nominal" },
            { field: "likert", type: "ordinal" },
            { field: "count", type: "quantitative" },
            { field: "mean", type: "quantitative" },
            { field: "median", type: "quantitative" },
          ],
        },
      },
      {
        mark: "text",
        encoding: {
          x: { field: "xMid", type: "quantitative" },
          text: { field: "percentage", type: "quantitative", format: ".0f" },
          y: { field: "question", type: "nominal" },
        },
      },
    ],

    autosize: {
      type: "fit-y",
      resize: true,
    },
  } satisfies VisualizationSpec;
}
