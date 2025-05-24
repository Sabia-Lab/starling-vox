import pandas as pd
import json


# TODO: need to fix json file name
# TODO: handle null values (or 0)

def parse_and_convert_course_evaluation(file_path):
    variable_data, response_data = read_file(file_path)

    var_to_question = map_variables_to_questions(variable_data)
    
    likert_results = extract_likert_questions(response_data, var_to_question)
    open_ended_results = extract_open_ended_questions(response_data, var_to_question)

    # Format new file names
    json_file_name = file_path[:-5]
    open_ended_file_name = json_file_name + " Open Ended.json"
    likert_file_name = json_file_name + " Likert.json"

    write_to_json(likert_file_name, likert_results)
    write_to_json(open_ended_file_name, open_ended_results)

def read_file(excel_file):
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

def extract_likert_questions(response_data, var_to_question):
    results = []

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
            percentage = round(float((count / total_valid) * 100), 2) if total_valid > 0 else 0
            results.append({
                "type": "likert",
                "variable": var_name,
                "question": question_text,
                "likert": int(likert_value),
                "count": int(count),
                "percentage": float(percentage)
            })
    
    return results
 
def extract_open_ended_questions(response_data, var_to_question):
    results = []

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

    return results

def write_to_json(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

    print(f"Processing complete. Data saved to {filename}")