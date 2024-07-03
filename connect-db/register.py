from flask import Flask, jsonify, request
import pyodbc
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # اجازه دادن به همه منابع برای همه مسیرها

# تنظیمات اتصال به SQL Server
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-NL7MQT0;'
    'DATABASE=radical;'
    'UID=sa;'
    'PWD=@Hossein2021'
)

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    fullname = data.get('fullname')
    phonenumber = data.get('phonenumber')
    email = data.get('email')
    nationalcode = data.get('nationalcode')

    # جداسازی fullname به name و lastName
    name_parts = fullname.split()
    name = name_parts[0]
    lastName = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

    cursor = conn.cursor()
    cursor.execute('INSERT INTO user_profile (name, last_name, phone_number, email, national_code) VALUES (?, ?, ?, ?, ?)', 
                   (name, lastName, phonenumber, email, nationalcode))
    conn.commit()
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
