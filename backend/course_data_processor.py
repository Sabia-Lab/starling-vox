import pandas as pd
import json

# need to fix json file name
# handle null values (or 0)

excel_file = "./data/DIT333 Fake Course.xlsx"

print("Reading Excel file...")
variable_data = pd.read_excel(excel_file, sheet_name="VariableView")
response_data = pd.read_excel(excel_file, sheet_name="Data")

# Map variable names to questions
var_to_question = {
    row['Variable Name']: row['Label']
    for _, row in variable_data.iterrows()
    #if pd.notna(row['Label'])
}

open_ended_results = []
likert_results = []

for var_name, question_text in var_to_question.items():
    # Try to coerce numeric for Likert-type questions
    # coerce is used since It allows the script to cleanly skip open-ended responses during Likert processing, and detect them later as text fields
    response_data[f"{var_name}_numeric"] = pd.to_numeric(response_data[var_name], errors='coerce')
    valid_responses = response_data[response_data[f"{var_name}_numeric"].between(1, 5)]

    if len(valid_responses) > 0:
        print(f"Processing Likert question: {var_name} - {question_text}")

        grouped_data = valid_responses.groupby(f"{var_name}_numeric").size()
        #total_valid = len(valid_responses)

        for likert in range(1, 6):
            count = grouped_data.get(likert, 0)
            total_valid = len(valid_responses)
            percentage = round(float((count / total_valid) * 100), 2) if total_valid > 0 else 0

            likert_results.append({
                "type": "likert",
                "variable": var_name,
                "question": question_text,
                "likert": int(likert),
                "count": int(count),
                "percentage": float(percentage)
            })
    else:
        # Treat as open-ended question
        open_ended_answers = response_data[var_name].dropna().astype(str).tolist()
        print(f"Processing open-ended question: {var_name} - {question_text}")

        open_ended_results.append({
            "type": "open-ended",
            "variable": var_name,
            "question": question_text,
            "answers": open_ended_answers
        })


with open("likert_evaluation.json", "w") as f:
    json.dump(likert_results, f, indent=4)

with open("open_ended_evaluation.json", "w") as f:
    json.dump(open_ended_results, f, indent=4)

print(f"Processing complete. Data saved to {likert_results} and {open_ended_results}")

