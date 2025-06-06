'use client';

import { useRef, useEffect } from "react";
import embed, { vega, VisualizationSpec} from 'vega-embed';
import * as d3 from "d3"; // for creating theme from interpolation?



function extractDataPoints(jsonData: {"questions": {[key: string]: string}; "responses": {[key: string]: [{[key: string]: number}]}}){
    var data : {[key: string]: string | number}[] = []
    const responses = jsonData["responses"]
    for (let key in responses){
        var q = key
        var a = responses[key]
        a.forEach((response) => {
            data.push({"question": q, "likert": String(response.likert), "count": response.count, "percentage": response.percentage})
        })
    }
    console.log(data)

    return data
}

export default function Page() {  

    
    const tickOffset = 10
    const ticks = Array.from({ length: 21 }, (_, i) => -100 + (i * tickOffset) );
    const chartRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        fetch('/DIT333 Fake Course Likert.json')
            .then((res) => res.json())
            .then((data) => {
                const spec : VisualizationSpec = {
                    width: 1000,   // ← Must be set here

                    config: {
                        background: "var(--color-background)",
                        axis: {
                            titleColor: "var(--color-on-background)",
                            labelColor: "var(--color-on-background)",
                        },
                        legend: {
                            titleColor: "var(--color-on-background)",
                            labelColor: "var(--color-on-background)"
                        },
                        title:{
                            color: "var(--color-on-background)"
                        },
                        //range: {
                        //    ordinal: ADD VEGA SCHEME WHEN CREATED
                        //}
                    },
                    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
                    description: 'Course chart',               // add description as variable
                    data: {values: extractDataPoints(data)},
                    transform: [
                        {   // Transforms the string labels into numberic based on the index matching. 
                            // if(a,b,c) is a ternary operator in Vega-like.
                            calculate: "indexof(['1','2','3','4','5'], datum.likert) - 2",
                            as: "q_order"
                        },
                        {
                            calculate: "if (datum.likert === '1' || datum.likert === '2', datum.percentage, 0) + if (datum.likert === '3', datum.percentage/2, 0)",
                            as: "signed_percentage"
                        },
                        {
                            stack: "percentage", as: ["barStart", "barEnd"], groupby: ["question"]
                        },
                        { 
                            joinaggregate: [
                                {
                                    field: "signed_percentage",
                                    op: "sum",
                                    as: "offset"
                                }
                            ],
                            groupby: ["question"]
                        },
                        {calculate: "datum.barStart - datum.offset", as: "xStart"},
                        {calculate: "datum.barEnd   - datum.offset", as: "xEnd"}                        
                    ],
                    mark: 'bar',
                    encoding: {
                        x: {
                            field: "xStart",
                            type: "quantitative",
                            title: "Percentage",
                            scale : {
                                domain: [-100, 100]
                            },
                            axis: {
                                values: ticks,
                                format: ".0f",       // Show as 0, 10, 20...
                                labels: true,
                                labelOverlap: false,
                                labelBound: true
                              }                      
                        },
                        x2:{
                            field: "xEnd"
                        },
                        y: {
                            field: 'question', 
                            type: 'nominal', 
                            axis: {
                                title: 'Questions',
                                offset: 5,
                                ticks: false,
                                minExtent: 100, 
                                domain: false,
                            }
                        },
                        //x: {aggregate: 'sum',
                        //    field: 'count', 
                        //    type: 'quantitative', 
                        //    stack: 'normalize', //can decide to normalize each on 100% or keep counts - maybe in divergent bar chart don't want?
                        //    axis: {title: 'Score'}},
                        color: {
                            field: 'likert',
                            type: 'ordinal',
                            scale: {
                                domain: ["1", "2", "3", "4", "5"],
                                range: ["var(--color-diverging--2)", "var(--color-diverging--1)", "var(--color-diverging-0)", "var(--color-diverging-1)", "var(--color-diverging-2)"], // fix colors - try to create a vega scheme?
                                type: "ordinal"
                            },
                            legend: {title: "Likert scale"}
                        },
                        tooltip: [
                            {field: "question", type: "nominal"},
                            {field: "likert"  , type: "ordinal"},
                            {field: "count"   , type: "quantitative"},
                        ]
                    }
                };

                if(chartRef.current){
                    embed(chartRef.current, spec, {actions: false});
                }
            });
    }, []);

    return (
        <div>
            <h1 className="text-xl font-fold mb-4">Course Evaluation</h1>
            <div ref={chartRef} style={{ width: '100%' }}></div>
        </div>
    );
}