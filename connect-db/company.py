from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# تنظیمات اتصال به دیتابیس
db_config = {
    'driver': 'ODBC Driver 17 for SQL Server',
    'server': 'DESKTOP-NL7MQT0',
    'database': 'radical',
    'uid': 'sa',
    'pwd': '@Hossein2021'
}

# تابع برای اتصال به دیتابیس
def get_db_connection():
    conn_str = (
        f"DRIVER={db_config['driver']};"
        f"SERVER={db_config['server']};"
        f"DATABASE={db_config['database']};"
        f"UID={db_config['uid']};"
        f"PWD={db_config['pwd']}"
    )
    conn = pyodbc.connect(conn_str)
    return conn

# API برای اضافه کردن اطلاعات به company_history
@app.route('/api/company_history', methods=['POST'])
def add_company_history():
    data = request.get_json()
    ID_loginCode = data.get('ID_loginCode')
    logo = data.get('logo')
    color = data.get('color')
    slogan = data.get('slogan')
    personal_element = data.get('personal_element')
    publicity = data.get('publicity')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO company_history (ID_loginCode, logo, color, slogan, personal_element, publicity)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (ID_loginCode, logo, color, slogan, personal_element, publicity))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'}), 201

# API برای اضافه کردن اطلاعات به product_coordinates
@app.route('/api/product_coordinates', methods=['POST'])
def add_product_coordinates():
    data = request.get_json()
    ID_loginCode = data.get('ID_loginCode')
    mostPart_product = data.get('mostPart_product')
    strongPart_product = data.get('strongPart_product')
    mostCompetitor_company = data.get('mostCompetitor_company')
    bestPerformance_product = data.get('bestPerformance_product')
    more_strategy = data.get('more_strategy')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO product_coordinates (ID_loginCode, mostPart_product, strongPart_product, mostCompetitor_company, bestPerformance_product, more_strategy)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (ID_loginCode, mostPart_product, strongPart_product, mostCompetitor_company, bestPerformance_product, more_strategy))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'}), 201

# API برای اضافه کردن اطلاعات به information_company
@app.route('/api/information_company', methods=['POST'])
def add_information_company():
    data = request.get_json()
    ID_loginCode = data.get('ID_loginCode')
    name = data.get('name')
    year = data.get('year')
    size = data.get('size')
    address = data.get('address')
    start_market = data.get('start_market')
    vision_market = data.get('vision_market')
    pdf_file = data.get('pdf_file')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO information_company (ID_loginCode, name, year, size, address, start_market, vision_market, pdf_file)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (ID_loginCode, name, year, size, address, start_market, vision_market, pdf_file))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'}), 201

if __name__ == '__main__':
    app.run(debug=True)
