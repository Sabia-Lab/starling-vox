'use client';

import { useRef, useEffect } from "react";
import embed, { VisualizationSpec} from 'vega-embed';

export default function Page() {  

    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/data.json')
            .then((res) => res.json())
            .then((data) => {
                const spec : VisualizationSpec = {
                    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
                    description: 'Course chart',               // add description as variable
                    data: {values: data},
                    transform: [
                        {
                            calculate: "if (datum.likert === '1', -2,0) + if(datum.likert === '2', -1,0) + if(datum.likert === '3', 0,0) + if(datum.likert === '4', 1,0) + if(datum.likert === '5', 2,0)",
                            as: "q_order"
                        },
                        {
                            calculate: "if (datum.likert === '1' || datum.likert === '2', datum.percentage,0) + if (datum.likert === '3', datum.percentage/2, 0)",
                            as: "signed_percentage"
                        },
                        {
                            stack: "percentage", as: ["v1", "v2"], groupby: ["question"]
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
                        {
                            calculate: "datum.v1 - datum.offset", as: "negX"
                        },
                        {
                            calculate: "datum.v2 - datum.offset", as: "posX"
                        }                        
                    ],
                    mark: 'bar',
                    encoding: {
                        x: {
                            field: "negX",
                            type: "quantitative",
                            title: "Percentage"
                        },
                        x2:{
                            field: "posX"
                        },
                        y: {
                            field: 'question', 
                            type: 'nominal', 
                            axis: {
                                title: 'Questions',
                                offset: 5,
                                ticks: false,
                                minExtent: 60, 
                                domain: false
                            }
                        },
                        //x: {aggregate: 'sum',
                        //    field: 'count', 
                        //    type: 'quantitative', 
                        //    stack: 'normalize',           //can decide to normalize each on 100% or keep counts - maybe in divergent bar chart don't want?
                        //    axis: {title: 'Score'}},
                        color: {
                            field: 'likert',
                            type: 'ordinal',
                            scale: {
                                domain: ["1", "2", "3", "4", "5"],
                                range: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8B", "#1a9850"], // add custom colors as style variables?
                                type: "ordinal"
                            },
                            legend: {title: "Likert scale"}
                        },
                        tooltip: [
                            {field: "question", type: "nominal"},
                            {field: "likert", type: "ordinal"},
                            {field: "count", type: "quantitative"},
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
        <div ref={chartRef}></div>
    </div>
    );
}