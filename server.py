from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import pymysql.cursors

app = Flask(__name__)

# اجازه دادن به هر مبدأ برای دسترسی به این سرور
CORS(app, resources={r"/*": {"origins": "*"}})

# اتصال به MariaDB
conn = pymysql.connect(
    host='localhost',
    database='radical',
    user='root',
    password='@Hossein2023',
    cursorclass=pymysql.cursors.DictCursor
)

@app.route('/api/check_code', methods=['POST'])
def check_code():
    data = request.get_json()
    code = data.get('code')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM login_code WHERE ID = %s AND number > number_limit', (code,))
    row = cursor.fetchone()
    
    if row:
        # به‌روزرسانی فیلد number_limit
        cursor.execute('UPDATE login_code SET number_limit = number_limit + 1 WHERE ID = %s', (code,))
        conn.commit()
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})

 #-------------------------------------------------------------------------   

def get_services():
    conn = pymysql.connect(
        host='localhost',
        database='radical',
        user='root',
        password='@Hossein2023'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT ID, name, price FROM services")
    services = cursor.fetchall()
    conn.close()
    return services

# روت API برای دریافت خدمات
@app.route('/api/services', methods=['GET'])
def services():
    try:
        services = get_services()
        services_list = [{'id': service[0], 'title': service[1], 'price': service[2]} for service in services]
        return jsonify(services_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# تابع برای بررسی کد تخفیف
def check_discount_code(code):
    conn = pymysql.connect(
        host='localhost',
        database='radical',
        user='root',
        password='@Hossein2023'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT offer_price, number_limit FROM offer_code WHERE ID=%s", (code,))
    discount = cursor.fetchone()
    if discount:
        new_limit = discount[1] + 1
        cursor.execute("UPDATE offer_code SET number_limit = %s WHERE ID = %s", (new_limit, code))
        conn.commit()
    conn.close()
    return discount

# روت API برای بررسی کد تخفیف
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
#---------------------------------------------------------------

def add_order(user_id, service_id, login_code, offer_code):
    conn = pymysql.connect(
        host='localhost',
        database='radical',
        user='root',
        password='@Hossein2023'
    )
    
    try:
        cursor = conn.cursor()
        if offer_code != "null":
            cursor.execute(
                "INSERT INTO orders (ID_user, ID_service, ID_loginCode, ID_offerCode) VALUES (%s, %s, %s, %s)",
                (user_id, service_id, login_code, offer_code)
            )
        else:
            cursor.execute(
                "INSERT INTO orders (ID_user, ID_service, ID_loginCode) VALUES (%s, %s, %s)",
                (user_id, service_id, login_code)
            )
        
        conn.commit()
    except Exception as e:
        conn.rollback()  # اگر خطایی رخ دهد، تراکنش لغو می‌شود.
        raise e
    finally:
        cursor.close()  # بستن cursor
        conn.close()  # بستن اتصال به دیتابیس


@app.route('/api/submit_order', methods=['POST'])
def submit_order():
    data = request.get_json()
    user_id = int(data.get('userId'))
    services = data.get('checkedServices')
    login_code = data.get('entercode')
    offer_code = data.get('offerCode')
    
    try:
        for service_id in services:
            add_order(user_id, service_id, login_code, offer_code)
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
#-------------------------------------------------------------------------------
    
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
        VALUES (%s, %s, %s, %s)
    ''', (name, lastName, phonenumber, email))
    
    # دریافت ID درج شده
    inserted_id = cursor.lastrowid
    conn.commit()
    
    return jsonify({'success': True, 'id': inserted_id})

#-------------------------------------------------------------------------------

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        database='radical',
        user='root',
        password='@Hossein2023',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = '''
        SELECT o.ID_offerCode, o.ID_loginCode, s.name AS service_name, s.price AS service_price, o.reg_date, oc.offer_price
        FROM orders o
        JOIN services s ON o.ID_service = s.ID
        LEFT JOIN offer_code oc ON o.ID_offerCode = oc.ID 
        '''
        cursor.execute(query)
        orders = []
        for row in cursor.fetchall():
            order = {
                'ID_offerCode': row['ID_offerCode'],
                'ID_loginCode': row['ID_loginCode'],
                'service_name': row['service_name'],
                'service_price': row['service_price'],
                'reg_date': row['reg_date'],
                'disCount_value': row['offer_price'],
            }
            orders.append(order)
        cursor.close()
        conn.close()
        return jsonify(orders), 200

    except pymysql.MySQLError as e:
        print(f'Error: {e}')  # چاپ خطا برای عیب‌یابی
        return jsonify({'error': 'An error occurred while fetching orders'}), 500
    
#-----------------------------------------------------

@app.route('/api/admin_loginCode', methods=['GET'])
def get_loginCode():
    try:
        # اتصال به دیتابیس MariaDB
        conn = pymysql.connect(
            host='localhost',
            database='radical',  # نام دیتابیس خود را بررسی کنید
            user='root',  # نام کاربری صحیح را قرار دهید
            password='@Hossein2023',  # رمزعبور صحیح را قرار دهید
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = conn.cursor()
        
        # کوئری برای دریافت اطلاعات از جدول login_code
        query = '''
        SELECT ID, number, number_limit, end_date
        FROM login_code
        '''
        cursor.execute(query)
        
        # تبدیل نتایج به لیست دیکشنری‌ها
        show_loginCode = []
        for row in cursor.fetchall():
            login_code = {
                'loginCode_ID': row['ID'],
                'number_loginCode': row['number'],
                'numberLimit_loginCode': row['number_limit'],
                'endDate_loginCode': row['end_date'],
            }
            show_loginCode.append(login_code)
        
        cursor.close()
        conn.close()
        
        # برگرداندن نتیجه به فرمت JSON
        return jsonify(show_loginCode), 200
    
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching login codes'}), 500
#-------------------------------------------------------------------------------

@app.route('/api/admin_offerCode', methods=['GET'])
def get_offerCode():
    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )

        with conn.cursor() as cursor:
            # اجرای کوئری برای دریافت کدهای تخفیف
            query = '''
            SELECT ID, number, number_limit, end_date
            FROM offer_code
            '''
            cursor.execute(query)
            show_offerCode = []
            
            # پیمایش نتایج و ساخت دیکشنری برای هر رکورد
            for row in cursor.fetchall():
                offer_code = {
                    'offerCode_ID': row['ID'],
                    'number_offerCode': row['number'],
                    'numberLimit_offerCode': row['number_limit'],
                    'endDate_offerCode': row['end_date'],
                }
                show_offerCode.append(offer_code)

        conn.close()  # بستن اتصال دیتابیس
        return jsonify(show_offerCode), 200
    
    except pymysql.MySQLError as e:
        # مدیریت خطاهای دیتابیس
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching offer codes', 'details': str(e)}), 500

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
        conn = pymysql.connect(
            host='localhost',
            database='radical',  # نام دیتابیس را بررسی کنید
            user='root',  # نام کاربری صحیح را قرار دهید
            password='@Hossein2023',  # رمزعبور صحیح را قرار دهید
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with conn.cursor() as cursor:
            cursor.execute('''
                INSERT INTO login_code (ID, number, end_date, number_limit)
                VALUES (%s, %s, %s, %s)
            ''', (login_code_id, number, formatted_date, num_limit))
            conn.commit()  # تغییرات را به دیتابیس اعمال می‌کند

        conn.close()
        return jsonify({'success': True})
    
    except pymysql.MySQLError as e:
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
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )

        with conn.cursor() as cursor:
            cursor.execute('''
                INSERT INTO offer_code (ID, number, end_date, number_limit, offer_price)
                VALUES (%s, %s, %s, %s, %s)
            ''', (offer_code_id, number, formatted_date, num_limit, offer_price))
            conn.commit()
        
        conn.close()  # بستن اتصال دیتابیس
        return jsonify({'success': True})
    
    except pymysql.MySQLError as e:
        print(f"Error: {str(e)}")  # چاپ خطا
        return jsonify({'success': False, 'error': str(e)})

#------------------------------------------------------------------

@app.route('/api/show_services', methods=['GET'])
def get_services1():
    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )

        cursor = conn.cursor()
        
        # اجرای کوئری
        query = '''
        SELECT name, price
        FROM services
        '''
        cursor.execute(query)
        
        # پردازش نتایج
        show_services = []
        for row in cursor.fetchall():
            services = {
                'service_name': row['name'],
                'service_price': row['price'],
            }
            show_services.append(services)
        
        return jsonify(show_services), 200
    
    except pymysql.MySQLError as e:
        # مدیریت خطا
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching services'}), 500
    
    finally:
        cursor.close()
        conn.close()
#---------------------------------------------------------------------------------
@app.route('/api/save_service', methods=['POST'])
def save_service():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')

    try:
        # اتصال به دیتابیس و ذخیره اطلاعات
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )

        with conn.cursor() as cursor:
            cursor.execute('''
                INSERT INTO services (name, price)
                VALUES (%s, %s)
            ''', (name, price))
            conn.commit()
        
        return jsonify({'success': True})

    except pymysql.MySQLError as e:
        print(f"Error: {str(e)}")  # چاپ خطا
        return jsonify({'success': False, 'error': str(e)})

    finally:
        conn.close()
#---------------------------------------------------------------
    
@app.route('/api/orders_users', methods=['GET'])
def get_orders_user():
    try:
        user_ID = request.args.get('user_ID')
        if not user_ID:
            return jsonify({'error': 'user_ID parameter is required'}), 400
        
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = conn.cursor(pymysql.cursors.DictCursor)  # DictCursor allows fetching results as dictionaries
        
        query = '''
            SELECT o.ID_offerCode, o.ID_loginCode, s.name as service_name, s.price as service_price, 
                o.reg_date, IFNULL(oc.offer_price, 0) as offer_price
            FROM orders o
            JOIN services s ON o.ID_service = s.ID
            LEFT JOIN offer_code oc ON o.ID_offerCode = oc.ID
            WHERE o.ID_user = %s
        '''

        cursor.execute(query, (user_ID,))
        orders = cursor.fetchall()  # Fetch all results at once
        
        cursor.close()
        conn.close()
        return jsonify(orders), 200
    
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while fetching orders'}), 500
    
#--------------------------------------------------------------------------------

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        database='radical',
        user='root',
        password='@Hossein2023',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/delete_service', methods=['DELETE'])
def delete_service():
    try:
        data = request.get_json()
        service_name = data.get('service_name')

        if not service_name:
            return jsonify({'error': 'Service name is required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        query = "DELETE FROM services WHERE name = %s"
        cursor.execute(query, (service_name,))  # توجه به استفاده از tuple

        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({'message': 'Service deleted successfully!'}), 200

    except pymysql.MySQLError as e:
        print(f'Error: {e}')
        return jsonify({'error': 'An error occurred while deleting the service'}), 500
#-----------------------------------------------------------------

@app.route('/api/edit_service', methods=['POST'])
def edit_service():
    data = request.get_json()
    old_name = data.get('old_name')
    new_name = data.get('new_name')
    
    conn = pymysql.connect(
        host='localhost',
        database='radical',
        user='root',
        password='@Hossein2023',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM services WHERE name = %s', (old_name,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute('UPDATE services SET name = %s WHERE name = %s', (new_name, old_name))
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Service updated successfully'})
        else:
            return jsonify({'status': 'error', 'message': 'Service not found'})
    
    except pymysql.MySQLError as e:
        print(f"Error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)})
    
    finally:
        conn.close()

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        database='radical',
        user='root',
        password='@Hossein2023',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/edit_service_price', methods=['POST'])
def edit_service_price():
    data = request.get_json()
    name = data.get('name')
    new_price = data.get('new_price')
    
    conn = get_db_connection()
    
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM services WHERE name = %s', (name,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute('UPDATE services SET price = %s WHERE name = %s', (new_price, name))
            conn.commit()
            return jsonify({'status': 'success', 'message': 'Service price updated successfully'})
        else:
            return jsonify({'status': 'error', 'message': 'Service not found'})
    
    except pymysql.MySQLError as e:
        print(f"Error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)})
    
    finally:
        conn.close()
    
#----------------------------------------------------------------------------

@app.route('/api/edit_offerCode', methods=['POST'])
def edit_offer_code():
    data = request.get_json()
    old_id = data.get('old_id')  # تغییر نام پارامتر به old_id
    new_id = data.get('new_id')  # تغییر نام پارامتر به new_id
    
    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )

        cursor = conn.cursor()
        cursor.execute('SELECT * FROM offer_code WHERE ID = %s', (old_id,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute('UPDATE offer_code SET ID = %s WHERE ID = %s', (new_id, old_id))
            conn.commit()
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Offer code not found'})
    
    except pymysql.MySQLError as e:
        return jsonify({'success': False, 'error': str(e)})
    
    finally:
        cursor.close()
        conn.close()  # بستن اتصال دیتابیس


@app.route('/api/increase_users', methods=['POST'])
def increase_users():
    data = request.get_json()
    ID = data.get('code')  # مطمئن شوید که این نام با نام ارسالی از سمت فرانت‌اند همخوانی دارد
    new_number = data.get('new_number')
    
    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )

        cursor = conn.cursor()
        cursor.execute('SELECT * FROM offer_code WHERE ID = %s', (ID,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute('UPDATE offer_code SET number = %s WHERE ID = %s', (new_number, ID))
            conn.commit()
            return jsonify({'success': True, 'message': 'Number of users updated successfully'})
        else:
            return jsonify({'success': False, 'message': 'Offer code not found'})
    
    except pymysql.MySQLError as e:
        return jsonify({'success': False, 'error': str(e)})
    
    finally:
        cursor.close()
        conn.close()  # بستن اتصال دیتابیس


@app.route('/api/increase_validity', methods=['POST'])
def increase_validity():
    data = request.get_json()
    ID = data.get('code')  # مطمئن شوید که این نام با نام ارسالی از سمت فرانت‌اند همخوانی دارد
    new_date = data.get('new_date')
    
    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM offer_code WHERE ID = %s', (ID,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute('UPDATE offer_code SET end_date = %s WHERE ID = %s', (new_date, ID))
            conn.commit()
            return jsonify({'success': True, 'message': 'End date updated successfully'})
        else:
            return jsonify({'success': False, 'message': 'Offer code not found'})
    
    except pymysql.MySQLError as e:
        return jsonify({'success': False, 'error': str(e)})
    
    finally:
        cursor.close()
        conn.close()  # بستن اتصال دیتابیس

@app.route('/api/delete_offerCode', methods=['DELETE'])
def delete_offer_code():
    data = request.get_json()
    ID = data.get('data')  # تغییر نام پارامتر به data
    
    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',
            user='root',
            password='@Hossein2023',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM offer_code WHERE ID = %s', (ID,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute('DELETE FROM offer_code WHERE ID = %s', (ID,))
            conn.commit()
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Offer code not found'})
    
    except pymysql.MySQLError as e:
        return jsonify({'success': False, 'error': str(e)})
    
    finally:
        cursor.close()
        conn.close()  # بستن اتصال دیتابیس

    
#-----------------------------------------------------------------------
@app.route('/api/edit_loginCode', methods=['POST'])
def edit_login_code_route():
    data = request.get_json()
    old_code = data.get('old_code')
    new_code = data.get('new_code')

    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',  # نام دیتابیس را بررسی کنید
            user='root',  # نام کاربری صحیح را قرار دهید
            password='@Hossein2023',  # رمز عبور صحیح را قرار دهید
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with conn.cursor() as cursor:
            # اجرای دستور SQL برای به‌روزرسانی کد
            cursor.execute("UPDATE login_code SET ID = %s WHERE ID = %s", (new_code, old_code))
            conn.commit()  # تغییرات را به دیتابیس اعمال می‌کند
        
        conn.close()
        return jsonify({'success': True})
    
    except pymysql.MySQLError as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/increase_users_log', methods=['POST'])
def increase_users_route():
    data = request.get_json()
    code = data.get('code')
    new_number = data.get('new_number')

    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',  # نام دیتابیس خود را جایگزین کنید
            user='root',  # نام کاربری دیتابیس خود را جایگزین کنید
            password='@Hossein2023',  # رمز عبور صحیح را وارد کنید
            cursorclass=pymysql.cursors.DictCursor
        )

        with conn.cursor() as cursor:
            # بررسی وجود کد ورود در جدول login_code
            cursor.execute("SELECT * FROM login_code WHERE ID = %s", (code,))
            row = cursor.fetchone()
            if row:
                # به‌روزرسانی تعداد کاربران برای کد ورود
                cursor.execute("UPDATE login_code SET number = %s WHERE ID = %s", (new_number, code))
                conn.commit()  # اعمال تغییرات در دیتابیس
                return jsonify({'success': True})
            else:
                return jsonify({'success': False, 'error': 'Login code not found'})
        
        conn.close()  # بستن اتصال دیتابیس
    
    except pymysql.MySQLError as e:
        # مدیریت خطاهای دیتابیس
        return jsonify({'success': False, 'error': str(e)})


@app.route('/api/increase_validity_log', methods=['POST'])
def increase_validity_route():
    data = request.get_json()
    code = data.get('code')
    new_date = data.get('new_date')

    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',  # نام دیتابیس خود را جایگزین کنید
            user='root',  # نام کاربری دیتابیس خود را جایگزین کنید
            password='@Hossein2023',  # رمز عبور صحیح را وارد کنید
            cursorclass=pymysql.cursors.DictCursor
        )

        with conn.cursor() as cursor:
            # بررسی وجود کد ورود در جدول login_code
            cursor.execute("SELECT * FROM login_code WHERE ID = %s", (code,))
            row = cursor.fetchone()
            if row:
                # به‌روزرسانی تاریخ انقضا برای کد ورود
                cursor.execute("UPDATE login_code SET end_date = %s WHERE ID = %s", (new_date, code))
                conn.commit()  # اعمال تغییرات در دیتابیس
                return jsonify({'success': True})
            else:
                return jsonify({'success': False, 'error': 'Login code not found'})
        
        conn.close()  # بستن اتصال دیتابیس
    
    except pymysql.MySQLError as e:
        # مدیریت خطاهای دیتابیس
        return jsonify({'success': False, 'error': str(e)})


@app.route('/api/delete_loginCode', methods=['DELETE'])
def delete_login_code_route():
    data = request.get_json()
    code = data.get('code')

    try:
        # اتصال به دیتابیس
        conn = pymysql.connect(
            host='localhost',
            database='radical',  # نام دیتابیس خود را جایگزین کنید
            user='root',  # نام کاربری دیتابیس خود را جایگزین کنید
            password='@Hossein2023',  # رمز عبور صحیح را وارد کنید
            cursorclass=pymysql.cursors.DictCursor
        )

        with conn.cursor() as cursor:
            # حذف کد ورود از جدول login_code
            cursor.execute("DELETE FROM login_code WHERE ID = %s", (code,))
            conn.commit()  # اعمال تغییرات در دیتابیس

        conn.close()  # بستن اتصال دیتابیس
        return jsonify({'success': True})
    
    except pymysql.MySQLError as e:
        # مدیریت خطاهای دیتابیس
        return jsonify({'success': False, 'error': str(e)})

#---------------------------------------------------------


MERCHANT = 'YOUR_MERCHANT_ID'
ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json'
ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/v4/payment/verify.json'
CALLBACK_URL = 'http://localhost:3000/verify'  # آدرس بازگشت بعد از پرداخت

@app.route('/api/payment', methods=['POST'])
def create_payment():
    data = request.get_json()
    amount = data.get('amount')  # مقدار پرداخت
    description = 'پرداخت برای خدمات'
    email = data.get('email')  # ایمیل کاربر
    mobile = data.get('mobile')  # شماره موبایل کاربر

    request_data = {
        "merchant_id": MERCHANT,
        "amount": amount,
        "description": description,
        "callback_url": CALLBACK_URL,
        "metadata": {"email": email, "mobile": mobile}
    }

    response = requests.post(ZARINPAL_REQUEST_URL, json=request_data)
    if response.status_code == 200 and response.json().get('data') and response.json()['data'].get('code') == 100:
        return jsonify({'url': response.json()['data']['link']})
    else:
        return jsonify({'error': 'Error in payment request'}), 500

@app.route('/api/verify', methods=['GET'])
def verify_payment():
    authority = request.args.get('Authority')
    amount = request.args.get('amount')

    verify_data = {
        "merchant_id": MERCHANT,
        "authority": authority,
        "amount": amount
    }

    response = requests.post(ZARINPAL_VERIFY_URL, json=verify_data)
    if response.status_code == 200 and response.json().get('data') and response.json()['data'].get('code') == 100:
        return jsonify({'status': 'OK', 'ref_id': response.json()['data']['ref_id']})
    else:
        return jsonify({'status': 'NOK'}), 500
#----------------------------------------------------------------------
@app.route('/api/company', methods=['POST'])
def add_company_info():
    data = request.get_json()
    ID_user = data.get('ID_user')
    name = data.get('name')
    year = data.get('year')
    size = data.get('size')
    address = data.get('address')
    start_market = data.get('start_market')
    vision_market = data.get('vision_market')
    web_site = data.get('web_site')

    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO information_company (ID_user, name, year, size, address, start_market, vision_market, web_site)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (ID_user, name, year, size, address, start_market, vision_market, web_site))
        
        conn.commit()
        return jsonify({'success': True, 'message': 'Company information added successfully!'})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'message': str(e)})
    finally:
        cursor.close()



if __name__ == '__main__':
    app.run(debug=True)
