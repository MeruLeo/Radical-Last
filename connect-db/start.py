from flask import Flask, jsonify, request
import pyodbc
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # اضافه کردن CORS با اجازه دسترسی به همه مبداها

# تنظیمات اتصال به SQL Server
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-NL7MQT0;'
    'DATABASE=radical;'
    'UID=sa;'
    'PWD=@Hossein2021'
)

@app.route('/api/check_code', methods=['POST'])
def check_code():
    data = request.get_json()
    code = data.get('code')
    
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM login_code WHERE ID = ?', (code,))
    row = cursor.fetchone()
    
    if row:
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})

if __name__ == '__main__':
    app.run(debug=True)
