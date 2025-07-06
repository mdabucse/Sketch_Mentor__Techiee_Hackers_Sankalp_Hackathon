from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/message', methods=['POST'])
def receive_message():
    data = request.get_json()  # get JSON payload from the request
    message = data.get('message', 'No message received')  # get 'message' key, default fallback
    return jsonify({'response': f'You sent: {message}'})  # send response as JSON

if __name__ == '__main__':
    app.run(debug=True)
