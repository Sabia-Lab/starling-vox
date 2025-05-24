import pandas as pd
import json


# TODO: need to fix json file name
# TODO: handle null values (or 0)

def read_file():
    excel_file = "backend/data/DIT333 Fake Course.xlsx"

    print("Reading Excel file...")
    variable_data = pd.read_excel(excel_file, sheet_name="VariableView")
    response_data = pd.read_excel(excel_file, sheet_name="Data")
 
    return variable_data,response_data

def map_variables_to_questions(variable_data):
    var_to_question={}
    for index , row in variable_data.iterrows():
        var_to_question[row['Variable Name']] = row['Label']
                 
    return var_to_question


# Extracts Likert-scale responses (1–5) and calculates counts and percentages

def extract_likert_questions(response_data, var_to_question, results):
    for var_name, question_text in var_to_question.items():
        #skips the columns that are not numeric
        if not pd.api.types.is_numeric_dtype(response_data[var_name]): 
            continue
             
        column_data = response_data[var_name]
        valid_responses = column_data[(column_data>=1) & (column_data<=5)]
                
        counts = valid_responses.groupby(valid_responses).count()
        total_valid = counts.sum()

        print(f"Processing Likert question: {var_name} - {question_text}")
        for likert_value, count in counts.items():
                percentage = round(float((count / total_valid) * 100), 2)    if total_valid > 0 else 0
                results.append({
                        "type": "likert",
                        "variable": var_name,
                        "question": question_text,
                        "likert": int(likert_value),
                        "count": int(count),
                        "percentage": float(percentage)
                })
 
def extract_open_ended_questions(response_data,var_to_question, results):
    for var_name, question_text in var_to_question.items():
        #skips the columns that are not text(strings are stored as object dtype in pandas)
        if not pd.api.types.is_object_dtype(response_data[var_name]): 
            continue 

        # Treat as open-ended question
        open_ended_answers = response_data[var_name].dropna().astype(str).tolist()
        print(f"Processing open-ended question: {var_name} - {question_text}")

        results.append({
                "type": "open-ended",
                "variable": var_name,
                "question": question_text,
                "answers": open_ended_answers
        })

def write_to_json(likert_results, open_ended_results):
    files = { 
        "likert_results.json": likert_results,
        "open_ended_results.json": open_ended_results
    }

    for filename, data in files.items():
        with open(filename, 'w') as file:
            json.dump(data, file, indent=4)

    print("Processing complete. Data saved to 'likert_results.json' and 'open_ended_results.json'")