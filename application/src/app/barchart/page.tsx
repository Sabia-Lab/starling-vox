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
                    description: 'Course chart',
                    data: {values: data},
                    mark: 'bar',
                    encoding: {
                        y: {field: 'a', type: 'nominal', axis: {title: 'Questions'}},
                        x: {field: 'b', type: 'quantitative', axis: {title: 'Score'}}
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