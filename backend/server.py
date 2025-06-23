from flask import Flask, jsonify, request  # Core Flask framework components
from flask_cors import CORS  # To allow Cross-Origin requests (frontend-backend communication)
import secrets  # Used for generating cryptographic salt
import hashlib  # Used to hash passwords securely
import os  # Used to check if files exist and interact with file system
import json  # For loading and saving JSON data (scores, quizzes, etc.)
from sympy import symbols, integrate, simplify, sympify, solveset, S, latex  # Core symbolic math library
from sympy.core.sympify import SympifyError  # Error raised if expression can't be parsed
from sympy.parsing.sympy_parser import (  # Used for safe parsing of string input into math expressions
    parse_expr, standard_transformations, convert_xor, implicit_multiplication_application
)

# Combine standard transformations with XOR and implicit multiplication 
transformations = standard_transformations + (convert_xor, implicit_multiplication_application)

# Define default symbol 'x' used in expressions
x = symbols('x')

# Create the Flask app instance
app = Flask(__name__)

# Allow all CORS (Cross-Origin Resource Sharing) so frontend can send requests
cors = CORS(app, origins='*')

# Ensure the text file for storing user credentials exists
def TextFileExistCheck():
    file = "UserDetails.txt"  # File to store user credentials
    if os.path.isfile(file) == False:  # If file does not exist, create it
        newfile = open("UserDetails.txt", 'w')  
        newfile.close() 

# Check if the username already exists in UserDetails.txt
def UsernameExist(username):
    File = open("UserDetails.txt", "r")
    LoginInfo = File.readlines() 
    File.close() 
    for line in LoginInfo:  # For every line
        LoginDetail = line.split()  # Split line into parts 
        Existing_Username = LoginDetail[0]  # The first part is the username
        if Existing_Username == username:  # Check if it matches
            return True  
    return False  

# Delete a user’s record from UserDetails.txt
def DeleteAccount(username):
    file = open('UserDetails.txt', 'r')  
    lines = file.readlines()  
    file.close()  

    filtered_lines = []  # List to store non-deleted lines

    for line in lines:  # For every line
        if not line.startswith(username + ' '):  # Skip the line that matches the username
            filtered_lines.append(line)  # Add others to filtered list

    file = open('UserDetails.txt', 'w')  
    file.writelines(filtered_lines)  
    file.close()  

# Delete a user’s scores from scores.json permanently
def PermanentDelete(username):
    file = open("scores.json", "r") 
    scores = json.load(f)  
    file.close() 
    if username in scores:  # Check if username exists in scores
        del scores[username]  
    with open("scores.json", "w") as f:  
        json.dump(scores, f, indent=2)  # Save updated scores

# Validate the username and return a specific error message if invalid
def UsernameCheck(username):
    if UsernameExist(username):  
        return "Username already taken."
    if not username:  
        return "Username cannot be empty."
    elif ' ' in username:  
        return "Username cannot contain spaces."
    elif len(username) <= 3:  
        return "Username must be at least 4 characters."
    elif len(username) > 12:  
        return "Username cannot be greater than 12 characters."
    return "" 

# Validate the password and return specific error if invalid
def PasswordCheck(password):
    if not password:  
        return "Password cannot be empty"
    elif ' ' in password:  
        return "Password cannot contain spaces."
    elif len(password) <= 3:  
        return "Password must be at least 4 characters."
    elif len(password) > 12:  
        return "Password cannot be greater than 12 characters."
    return ''  

# Encrypt a password using SHA-256 + salt
def Encrypt_Password(Password):
    salt = secrets.token_bytes(16)  
    Encrypted_Password = hashlib.sha256(salt + Password.encode())  
    Encrypted_Password = Encrypted_Password.hexdigest()  
    salt = salt.hex()  
    return Encrypted_Password, salt  # Return both encrypted password and salt

# Save user details (username, encrypted password, subject, salt) to file
def AddDetails(username, password, subject, salt):
    File = open("UserDetails.txt", "a")  
    File.write(f"{username} {password} {subject} {salt}\n")  
    File.close()  

# Get stored password hash and salt for a given username
def GetDetails(username):
    File = open("UserDetails.txt", "r") 
    UserInfo = File.readlines()  
    File.close()  

    for i in UserInfo:  # For each line
        UserDetail = i.strip().split()  
        if username == UserDetail[0]: 
            password = UserDetail[1] 
            salt = UserDetail[3]  
    return password, salt  # Return both

# Authenticate a username and password
def Authenticate(username, password):
    File = open("UserDetails.txt", "r")  
    UserInfo = File.readlines()  
    File.close()  

    for i in UserInfo:  # For each line
        UserDetail = i.strip().split() 
        if username == UserDetail[0]:  
            Encrypted_Password = UserDetail[1]  
            salt = bytes.fromhex(UserDetail[3])  
            hashed_password = hashlib.sha256(salt + password.encode()).hexdigest() 
            if hashed_password == Encrypted_Password:  
                return "Log In Successful", True, UserDetail[2] 
    return "Log In Failed", False, None  


# Endpoint to handle user signup
@app.route('/signup', methods=['POST'])
def signup():
    TextFileExistCheck()  # Make sure the user details file exists
    data = request.get_json()  # Get User input
    username = data.get('username')  
    password = data.get('password')  
    subject = data.get('subject') 

    usernameError = UsernameCheck(username)  # Validate username 
    passwordError = PasswordCheck(password)  # Validate password
    success = False  

    if usernameError == '' and passwordError == '':  # If both inputs are valid
        password, salt = Encrypt_Password(password)  
        AddDetails(username, password, subject, salt)  # Save user info to file
        success = True 

    return jsonify({
        "usernameError": usernameError,
        "passwordError": passwordError,
        "success": success
    })

# Endpoint to handle user login
@app.route('/login', methods=['POST'])
def login():
    TextFileExistCheck()  # Ensure file exists
    data = request.json  # Get User Input
    username = data.get('username')  
    password = data.get('password') 

    message, success, subject = Authenticate(username, password)  # Try to authenticate

    return jsonify({
        "message": message,
        "success": success,
        "subject": subject
    })

# Endpoint to update a user's username
@app.route('/updateusername', methods=['POST'])
def updateUsername():
    success = False  
    data = request.get_json()  # Get User Input
    username = data.get('username') 
    newusername = data.get('newusername')  
    subject = data.get('subject') 

    usernameError = UsernameCheck(newusername)  # Validate new username
    if usernameError == '':  
        password, salt = GetDetails(username)  # Retrieve existing password and salt
        DeleteAccount(username)  # Remove old account
        AddDetails(newusername, password, subject, salt)  # Add new account info
        success = True  
        username = newusername

    return jsonify({
        "usernameError": usernameError,
        "success": success,
        "username": username  
    })

# Endpoint to update a user's password
@app.route('/updatepassword', methods=['POST'])
def updatePassword():
    success = False
    data = request.get_json()  # Get User Input
    username = data.get('username')  
    newpassword = data.get('newpassword')  
    subject = data.get('subject')  #

    passwordError = PasswordCheck(newpassword)  # Validate new password
    if passwordError == '':  # If valid
        password, salt = Encrypt_Password(newpassword)  # Encrypt it
        DeleteAccount(username)  # Delete old credentials
        AddDetails(username, password, subject, salt)  # Re-add with new password
        success = True

    return jsonify({
        "passwordError": passwordError,
        "success": success
    })


# Endpoint to permanently delete user and score data
@app.route('/delete', methods=['POST'])
def delete():
    data = request.get_json()  # Get User Input
    username = data.get('username')  

    DeleteAccount(username)  # Remove from text file
    PermanentDelete(username)  # Remove from scores.json

    success = True  
    return jsonify({"delete": success}) 

# Endpoint to get the list of lessons for a selected subject
@app.route('/lessonslist', methods=['POST'])
def get_lessons_list():
    data = request.get_json()  # Get User Input
    selectedsubject = data.get('selectedsubject')  

    file = open(f'LessonLists/{selectedsubject}_LessonLists.json')
    lessons = json.load(file)  
    file.close()  

    # Determine the full subject name to display
    if selectedsubject == "std2":
        title = "Standard 2"
    if selectedsubject == "adv":
        title = "Advance"
    if selectedsubject == "ext1":
        title = "Extension 1"
    if selectedsubject == "ext2":
        title = "Extension 2"

    return jsonify({
        "list": lessons[selectedsubject], 
        "title": title  
    })

# Endpoint to fetch a specific lesson's content
@app.route('/get_lesson', methods=['POST'])
def get_lesson():
    data = request.get_json()  # Get User Input
    selectedsubject = data["selectedsubject"] 
    lessonID = data["lessonID"]  

    file = open(f'Lessons/{selectedsubject}_lessons.json', encoding='utf-8') 
    lessons = json.load(file)  
    file.close()

    return jsonify(lessons[lessonID]) 

# Endpoint to get the quiz data for a specific lesson
@app.route("/get_quiz", methods=["POST"])
def get_quiz():
    data = request.get_json()  # Get User Input
    selectedsubject = data.get("selectedsubject") 
    lessonID = data.get("lessonId")  

    file = open(f'Quizzes/{selectedsubject}_quizzes.json', encoding='utf-8')  
    quiz = json.load(file) 
    file.close()

    return jsonify(quiz.get(lessonID))  

# Endpoint to save or update a user's quiz score
@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.get_json()  # Get User Input

    username = data["username"]  
    lesson_id = str(data["lessonId"]) 
    subject_id = str(data["subjectId"])  
    score = data["score"] 

    try:
        with open("scores.json", "r") as f:
            try:
                scores = json.load(f)  # Try loading existing scores
            except json.JSONDecodeError:
                scores = {}  # If file is empty/broken, start with empty dict
    except FileNotFoundError:
        scores = {}  # If file doesn't exist, start fresh

    if username not in scores:
        scores[username] = []  # Create an entry for new user

    user_scores = scores[username]  # All this user's scores
    existing_entry = next((entry for entry in user_scores if entry["lessonId"] == lesson_id), None)

    if existing_entry:
        if score > existing_entry["score"]:  # Only overwrite if score is higher
            existing_entry["score"] = score
            existing_entry["subjectId"] = subject_id  # Update subject ID
    else:
        user_scores.append({
            "lessonId": lesson_id,
            "subjectId": subject_id,
            "score": score
        })

    with open("scores.json", "w") as f:
        json.dump(scores, f, indent=2) 

    return jsonify({"message": "Score saved successfully."})

# Endpoint to get all scores for a user (as {lessonId: score})
@app.route('/get_scores', methods=['POST'])
def get_scores():
    username = request.json['username']  # Get username from user

    with open('scores.json') as f:
        all_scores = json.load(f)

    user_scores = all_scores.get(username, [])  # Get this user's scores, or empty list

    # Create dictionary {lessonId: score}
    lesson_score_map = {entry['lessonId']: entry['score'] for entry in user_scores}

    return lesson_score_map  

# Endpoint to get overall course progress by subject
@app.route('/get_course_progress', methods=['POST'])
def get_course_progress():
    username = request.json['username']  # Get username from user
    with open("scores.json") as f:
        score_data = json.load(f) 

    user_scores = score_data.get(username, [])  # Get this user's entries

    progress = {}  # Dictionary to store per-subject progress
    for entry in user_scores:
        subject = entry["subjectId"]
        if subject not in progress:
            progress[subject] = set()  # Use a set to avoid duplicates
        progress[subject].add(entry["lessonId"])  # Mark lesson as done

    # Total number of lessons per subject
    totals = {
        "std2": 10,
        "adv": 10,
        "ext1": 10,
        "ext2": 14
    }

    # Count how many lessons completed in each subject
    progress_counts = {
        subject: {
            "done": len(progress[subject]),
            "total": totals.get(subject, 0)
        }
        for subject in progress
    }

    # Add zero progress for subjects not started
    for subject in totals:
        if subject not in progress_counts:
            progress_counts[subject] = {"done": 0, "total": totals[subject]}

    return progress_counts  

# Endpoint to evaluate, simplify, or solve a math expression
@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json() # Get User Input
    expression = data.get('expression', '').strip()  
    mode = data.get('mode', 'evaluate')

    try:
        # If solving equation 
        if mode == 'solve' and '=' in expression:
            left_str, right_str = expression.split('=', 1)  # Split into LHS and RHS
            left = parse_expr(left_str, transformations=transformations, evaluate=False)
            right = parse_expr(right_str, transformations=transformations, evaluate=False)
            expr = left - right  # Convert equation to 0 = ...
        else:
            expr = parse_expr(expression, transformations=transformations, evaluate=False)  # Parse single expression
    except (SympifyError, SyntaxError) as e:
        return jsonify({"latex": "\\text{Invalid expression}"}), 400  # Return error if expression is invalid

    try:
        if mode == 'evaluate':
            evaluated = expr.evalf()  # Evaluate numerically
            latex_result = latex(evaluated)  # Convert result to LaTeX

        elif mode == 'simplify':
            simplified = simplify(expr)  # Simplify symbolically
            latex_result = latex(simplified)

        elif mode == 'solve':
            sols = solveset(expr, x, domain=S.Complexes)  # Solve for x in complex domain
            if sols is S.EmptySet:
                latex_result = "\\text{No solutions}"  # No solution found
            elif sols.is_FiniteSet:
                sols_latex = ",\\quad ".join(latex(sol) for sol in sols)  # List each solution
                latex_result = f"x = {sols_latex}"
            else:
                latex_result = latex(sols)  # Handle infinite/general solutions

        else:
            latex_result = "\\text{Unsupported mode}"  # Invalid mode

        return jsonify({"latex": latex_result})  # Return result
    except Exception as e:
        return jsonify({"latex": f"\\text{{Error: {str(e)}}}"}), 500  # General error handling

# Endpoint to perform definite or indefinite integration
@app.route('/integrate', methods=['POST'])
def integrate_expression():
    data = request.json # Get User Input
    expr_str = data.get('expression', '')  
    var_str = data.get('variable', 'x')  
    lower_str = data.get('lower_limit', None)  
    upper_str = data.get('upper_limit', None)  

    try:
        x = symbols(var_str)  # Convert variable to sympy symbol
        expr = parse_expr(expr_str, transformations=transformations, evaluate=False)  # Parse input expression

        # If both limits are provided, do definite integral
        if lower_str is not None and upper_str is not None and lower_str != "" and upper_str != "":
            lower = sympify(lower_str)
            upper = sympify(upper_str)
            result = integrate(expr, (x, lower, upper))  # Definite integral
        else:
            result = integrate(expr, x)  # Indefinite integral

        latex_result = latex(result)  # Convert to LaTeX
        return jsonify({'result': latex_result})  # Return result
    except (SympifyError, Exception) as e:
        return jsonify({'error': f"Invalid input: {str(e)}"}), 400  # Handle invalid input

# Main app entry point (runs Flask server)
if __name__ == "__main__":
    app.run(debug=True, port=5000)
