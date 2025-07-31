from flask import Flask, render_template, redirect, request
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)

connect = sqlite3.connect('expenses.db',check_same_thread=False)
c = connect.cursor()
c.execute(
    '''CREATE TABLE IF NOT EXISTS expenses
    (id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT, category TEXT, description Text, amount REAL)'''
)
connect.commit()

@app.route('/')
def index():
    c.execute("SELECT * FROM expenses")
    data = c.fetchall()
    return render_template('index.html',expenses = data)

@app.route('/add',methods=['POST'])
def add_expenses():
    date = request.form['date']
    category = request.form['category']
    description = request.form['description']
    amount = request.form['amount']
    c.execute(
        '''
            INSERT INTO expenses (date,category,description, amount)
            VALUES (?,?,?,?)
        ''',(date,category,description,amount)
    )
    connect.commit()
    return redirect('/')

@app.route('/chart')
def chart():
    df = pd.read_sql_query('SELECT category, amount FROM expenses',connect)

    if df.empty:
        return 'No Expenses To Visualise'
    
    category_sum = df.groupby('category')['amount'].sum()
    plt.figure(figsize=(6,6))
    category_sum.plot.pie(autopct='%1.1f%%',startangle=140)
    plt.title('Category-wise Spending')

    img_path = "static/chart.png"
    plt.savefig(img_path)
    plt.close()

    return render_template('chart.html',chart_img=img_path)
    


if __name__ == '__main__':
    app.run(debug=True)

    

