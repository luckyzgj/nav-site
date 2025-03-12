import mysql.connector
import re

# 连接数据库
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="menggeer",
    database="ai_nav_db"
)

cursor = db.cursor()

# 读取 SQL 文件
with open('ai_nav_db.sql', 'r', encoding='utf-8') as file:
    content = file.read()

# 提取所有 INSERT 语句
inserts = re.findall(r'INSERT INTO `(\w+)` [^;]+;', content)

# 按表分组执行
tables = ['Category', 'Banner', 'Service', 'Setting']
for table in tables:
    # 找到对应表的所有 INSERT 语句
    pattern = f"INSERT INTO `{table}` [^;]+;"
    matches = re.findall(pattern, content)
    
    # 执行每个 INSERT 语句
    for insert in matches:
        try:
            cursor.execute(insert)
            print(f"Successfully inserted data into {table}")
        except mysql.connector.Error as err:
            print(f"Error inserting into {table}: {err}")
            continue

# 提交更改
db.commit()

# 关闭连接
cursor.close()
db.close() 