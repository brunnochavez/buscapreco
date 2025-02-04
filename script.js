@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
}

body {
    background-color: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 20px;
}

.container {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

input[type="file"],
input[type="text"] {
    padding: 14px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 16px;
    transition: 0.3s;
}

button {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
    margin-top: 10px;
}

button.primary {
    background: #007bff;
    color: white;
}

button.secondary {
    background: #28a745;
    color: white;
}

button.warning {
    background: #ffc107;
    color: #333;
}

#result {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 16px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}



