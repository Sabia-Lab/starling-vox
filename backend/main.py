from course_data_processor import( read_file, map_variables_to_questions, extract_likert_questions,
extract_open_ended_questions,
write_to_json
)

def main():
    variable_data, response_data = read_file()
    var_to_question = map_variables_to_questions(variable_data)
    
    likert_results = []
    open_ended_results = []
    
    extract_likert_questions(response_data, var_to_question, likert_results)
    extract_open_ended_questions(response_data, var_to_question, open_ended_results)
    
    write_to_json(likert_results,open_ended_results)

if __name__ == "__main__":
    main()

    