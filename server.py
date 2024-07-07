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
 #-------------------------------------------------------------------------   

def get_services():
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-NL7MQT0;'
        'DATABASE=radical;'
        'UID=sa;'
        'PWD=@Hossein2021'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT ID, name, price FROM services")
    services = cursor.fetchall()
    conn.close()
    return services

@app.route('/api/services', methods=['GET'])
def services():
    try:
        services = get_services()
        services_list = [{'id': service[0], 'title': service[1], 'price': service[2]} for service in services]
        return jsonify(services_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def check_discount_code(code):
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-NL7MQT0;'
        'DATABASE=radical;'
        'UID=sa;'
        'PWD=@Hossein2021'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT offer_price FROM offer_code WHERE ID=?", code)
    discount = cursor.fetchone()
    conn.close()
    return discount

@app.route('/api/check_discount', methods=['POST'])
def check_discount():
    data = request.get_json()
    discount_code = data.get('discount_code')
    try:
        discount = check_discount_code(discount_code)
        if discount:
            return jsonify({'discount_price': discount[0]})
        else:
            return jsonify({'error': 'Invalid discount code'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#-------------------------------------------------------------------------------
    
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

    # جداسازی fullname به name و lastName
    name_parts = fullname.split()
    name = name_parts[0]
    lastName = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_profile (name, last_name, phone_number, email) 
        OUTPUT INSERTED.id 
        VALUES (?, ?, ?, ?)
    ''', (name, lastName, phonenumber, email))
    
    inserted_id = cursor.fetchone()[0]
    conn.commit()
    
    return jsonify({'success': True, 'id': inserted_id})
#-------------------------------------------------------------------------------

@app.route('/api/orders', methods=['POST'])
def save_order():
    data = request.get_json()
    user_id = data.get('userId')
    entry_code = data.get('enterCode')
    checked_services = data.get('checkServices')
    offer_code = data.get('offerCode')

    cursor = conn.cursor()
    try:
        # Insert the order into the database
        cursor.execute('''
            INSERT INTO orders (ID_user, ID_services, ID_loginCode, ID_offerCode)
            VALUES (?, ?, ?, ?)
        ''', (user_id, ','.join(map(str, checked_services)), entry_code, offer_code))
        conn.commit()
        return jsonify({'success': True})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'error': str(e)})
#-------------------------------------------------------------------

conn_str = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-NL7MQT0;'
    'DATABASE=radical;'
    'UID=sa;'
    'PWD=@Hossein2021'
)


@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        query = '''
        SELECT o.ID_offerCode, o.ID_loginCode, s.name as service_name, s.price as service_price, o.reg_date, oc.offer_price
        FROM orders o
        JOIN services s ON o.ID_service = s.ID
        JOIN offer_code oc ON o.ID_offerCode = oc.ID 
        '''
        cursor.execute(query)
        orders = []
        for row in cursor.fetchall():
            order = {
                'ID_offerCode': row.ID_offerCode,
                'ID_loginCode': row.ID_loginCode,
                'service_name': row.service_name,
                'service_price': row.service_price,
                'reg_date': row.reg_date,
                'disCount_value':row.offer_price,
            }
            orders.append(order)
        
        cursor.close()
        conn.close()
        return jsonify(orders), 200
    
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching orders'}), 500
    
#-----------------------------------------------------
conn_str = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-NL7MQT0;'
    'DATABASE=radical;'
    'UID=sa;'
    'PWD=@Hossein2021'
)

@app.route('/api/admin_loginCode', methods=['GET'])
def get_loginCode():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        query = '''
        SELECT ID, number, number_limit, end_date
        FROM login_code
        '''
        cursor.execute(query)
        show_loginCode = []
        for row in cursor.fetchall():
            login_code = {
                'loginCode_ID': row.ID,
                'number_loginCode': row.number,
                'numberLimit_loginCode': row.number_limit,
                'endDate_loginCode': row.end_date,
            }
            show_loginCode.append(login_code)
        
        cursor.close()
        conn.close()
        return jsonify(show_loginCode), 200
    
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching login codes'}), 500
#-------------------------------------------------------------------------------
conn_str = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-NL7MQT0;'
    'DATABASE=radical;'
    'UID=sa;'
    'PWD=@Hossein2021'
)

@app.route('/api/admin_offerCode', methods=['GET'])
def get_offerCode():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        query = '''
        SELECT ID, number, number_limit, end_date
        FROM offer_code
        '''
        cursor.execute(query)
        show_offerCode = []
        for row in cursor.fetchall():
            offer_code = {
                'offerCode_ID': row.ID,
                'number_offerCode': row.number,
                'numberLimit_offerCode': row.number_limit,
                'endDate_offerCode': row.end_date,
            }
            show_offerCode.append(offer_code)
        
        cursor.close()
        conn.close()
        return jsonify(show_offerCode), 200
    
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching login codes'}), 500
#------------------------------------------------------------------------------

import datetime
@app.route('/api/save_loginCode', methods=['POST'])
def save_login_code():
    data = request.get_json()
    login_code_id = data.get('ID')
    number = data.get('number')
    end_date = data.get('end_date')
    num_limit = 0

    # تبدیل تاریخ به فرمت صحیح برای دیتابیس
    formatted_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()

    try:
        # اتصال به دیتابیس و ذخیره اطلاعات
        conn_str = (
            'DRIVER={ODBC Driver 17 for SQL Server};'
            'SERVER=DESKTOP-NL7MQT0;'
            'DATABASE=radical;'
            'UID=sa;'
            'PWD=@Hossein2021'
        )

        with pyodbc.connect(conn_str) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO login_code (ID, number, end_date, number_limit)
                    VALUES (?, ?, ?, ?)
                ''', (login_code_id, number, end_date, num_limit))
                conn.commit()
        return jsonify({'success': True})
    except pyodbc.Error as e:
        print(f"Error: {str(e)}")  # چاپ خطا
        return jsonify({'success': False, 'error': str(e)})
#----------------------------------------------------------------
@app.route('/api/save_offerCode', methods=['POST'])
def save_offer_code():
    data = request.get_json()
    offer_code_id = data.get('ID')
    number = data.get('number')
    end_date = data.get('end_date')
    offer_price = data.get('off_price')
    num_limit = 0

    # تبدیل تاریخ به فرمت صحیح برای دیتابیس
    formatted_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()

    try:
        # اتصال به دیتابیس و ذخیره اطلاعات
        conn_str = (
            'DRIVER={ODBC Driver 17 for SQL Server};'
            'SERVER=DESKTOP-NL7MQT0;'
            'DATABASE=radical;'
            'UID=sa;'
            'PWD=@Hossein2021'
        )

        with pyodbc.connect(conn_str) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO offer_code (ID, number, end_date, number_limit, offer_price)
                    VALUES (?, ?, ?, ?, ?)
                ''', (offer_code_id, number, formatted_date, num_limit, offer_price))
                conn.commit()
        return jsonify({'success': True})
    except pyodbc.Error as e:
        print(f"Error: {str(e)}")  # چاپ خطا
        return jsonify({'success': False, 'error': str(e)})
#------------------------------------------------------------------
conn_str = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-NL7MQT0;'
    'DATABASE=radical;'
    'UID=sa;'
    'PWD=@Hossein2021'
)

@app.route('/api/show_services', methods=['GET'])
def get_services1():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        query = '''
        SELECT name, price
        FROM services
        '''
        cursor.execute(query)
        show_services = []
        for row in cursor.fetchall():
            services = {
                'service_name': row.name,
                'service_price': row.price,
            }
            show_services.append(services)
        
        cursor.close()
        conn.close()
        return jsonify(show_services), 200
    
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching login codes'}), 500


    
if __name__ == '__main__':
    app.run(debug=True)
