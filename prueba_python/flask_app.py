from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

FILE_PATH = 'uploads/dataset/inflacion_bolivia.xls'

@app.route('/api/inflacion', methods=['GET'])
def get_inflation():
    start_year = int(request.args.get('anio', 1980))
    end_year = start_year + 9

    df = pd.read_excel(FILE_PATH, sheet_name=0, header=3)
    df = df.dropna(how='all', axis=0)

    bolivia_data = df[df['Country Code'] == 'BOL'].copy()
    years = [col for col in bolivia_data.columns if col.isdigit()]
    inflation_data = bolivia_data[years].iloc[0].dropna().astype(float)

    inflation_df = pd.DataFrame({
        'Year': inflation_data.index,
        'Inflation': inflation_data.values
    })

    inflation_df['Year'] = inflation_df['Year'].astype(int)
    filtered = inflation_df[
        (inflation_df['Year'] >= start_year) & 
        (inflation_df['Year'] <= end_year)
    ]

    return jsonify(filtered.to_dict(orient='records'))

@app.route('/api/anios', methods=['GET'])
def get_years():
    df = pd.read_excel(FILE_PATH, sheet_name=0, header=3)
    df = df.dropna(how='all', axis=0)
    bolivia_data = df[df['Country Code'] == 'BOL'].copy()
    years = [int(col) for col in bolivia_data.columns if col.isdigit()]
    return jsonify(years)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
