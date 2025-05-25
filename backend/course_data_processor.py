import pandas as pd
import json
import os

def parse_and_convert_course_evaluation(file_path):
    variable_data, response_data = read_excel_file(file_path)

    var_to_question = map_variables_to_questions(variable_data)
    
    likert_results = extract_likert_questions(response_data, var_to_question)
    open_ended_results = extract_open_ended_questions(response_data, var_to_question)

    json_results_dir = "json_results"

    # Create json_results directory if it does not already exist
    os.makedirs(json_results_dir, exist_ok=True)

    # Format new file names with json_results folder
    json_file_name = os.path.basename(file_path)[:-5]
    open_ended_file_name = os.path.join(json_results_dir, json_file_name + " Open Ended.json")
    likert_file_name = os.path.join(json_results_dir, json_file_name + " Likert.json")

    write_to_json(likert_file_name, likert_results)
    write_to_json(open_ended_file_name, open_ended_results)

def read_excel_file(excel_file):
    print("Reading Excel file...")
    variable_data = pd.read_excel(excel_file, sheet_name="VariableView")
    response_data = pd.read_excel(excel_file, sheet_name="Data")

    return variable_data, response_data

def map_variables_to_questions(variable_data):
    var_to_question={}
    for index , row in variable_data.iterrows():
        var_to_question[row['Variable Name']] = row['Label']
        
    return var_to_question

def convert_var_to_q_format(var_name):
    # Convert VAR00 to Q1
    if var_name.startswith("VAR"):
        # extract the number part and conver to int, then add 1
        var_number = int(var_name[3:]) + 1
        return f"Q{var_number}"
    return var_name

# Extracts Likert-scale responses (1–6) and calculates counts and percentages
def extract_likert_questions(response_data, var_to_question):
    results = {
        "questions": {},
        "responses": {}
    }

    for var_name, question_text in var_to_question.items():
        #skips the columns that are not numeric
        if not pd.api.types.is_numeric_dtype(response_data[var_name]): 
            continue

        column_data = response_data[var_name]
        valid_responses = column_data[(column_data>=0) & (column_data<=6)]
        counts = valid_responses.groupby(valid_responses).count()
        total_valid = counts.loc[1:6].sum()

        print(f"Processing Likert question: {var_name} - {question_text}")
        # Convert variable name to Q format
        q_name = convert_var_to_q_format(var_name)
        # add questinon text
        results["questions"][q_name] = question_text
        # prepare response list
        response_list = []
        for likert_value, count in counts.items():
            not_zero = int(likert_value) != 0
            percentage = round(float((count / total_valid) * 100), 2) if total_valid > 0 and not_zero else 0
            response_list.append({
                "likert": int(likert_value),
                "count": int(count),
                "percentage": float(percentage)
            })
        results["responses"][q_name] = response_list
    
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

        # Convert variable name to Q format
        q_name = convert_var_to_q_format(var_name)

        results.append({
            "type": "open-ended",
            "variable": q_name,
            "question": question_text,
            "answers": open_ended_answers
        })

    return results

def write_to_json(filename, data):
    with open(filename, 'w', encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

    print(f"Processing complete. Data saved to {filename}")