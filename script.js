let products = [];
let wrongPrices = [];

// Carregar CSV
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            products = parseCSV(e.target.result);
        };
        reader.readAsText(file);
    }
});

function parseCSV(text) {
    const lines = text.split('\n');
    return lines.slice(1).map(line => {
        const [barras, descricao, preco] = line.split(';');
        return barras && descricao && preco ? { barras: barras.trim(), descricao: descricao.trim(), preco: preco.trim() } : null;
    }).filter(item => item);
}

function searchProduct() {
    const barcode = document.getElementById('barcodeInput').value;
    const product = products.find(p => p.barras === barcode);
    
    if (product) {
        document.getElementById('description').textContent = product.descricao.replace(/^00;/, '');
        document.getElementById('price').textContent = parseFloat(product.preco.replace(',', '.')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        document.getElementById('description').textContent = 'Produto não encontrado';
        document.getElementById('price').textContent = '';
    }
}

function clearSearch() {
    document.getElementById('barcodeInput').value = "";
    document.getElementById('description').textContent = "";
    document.getElementById('price').textContent = "";
}

function reportWrongPrice() {
    const barcode = document.getElementById('barcodeInput').value;
    const product = products.find(p => p.barras === barcode);
    
    if (product) {
        wrongPrices.push(product);
        updateCSV();
    }
}

function updateCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Barras;Descrição;Preço\n" +
        wrongPrices.map(p => `${p.barras};${p.descricao};${p.preco}`).join("\n");

    let encodedUri = encodeURI(csvContent);
    let link = document.getElementById('downloadLink');
    link.href = encodedUri;
    link.download = "precos_errados.csv";
    link.style.display = "block";
}

// 📸 Função para Escanear Código de Barras
function startScanner() {
    const scannerContainer = document.createElement('div');
    scannerContainer.id = "scanner-container";
    scannerContainer.style.position = "fixed";
    scannerContainer.style.top = "0";
    scannerContainer.style.left = "0";
    scannerContainer.style.width = "100vw";
    scannerContainer.style.height = "100vh";
    scannerContainer.style.background = "rgba(0, 0, 0, 0.8)";
    scannerContainer.style.display = "flex";
    scannerContainer.style.justifyContent = "center";
    scannerContainer.style.alignItems = "center";
    scannerContainer.style.zIndex = "1000";

    const closeButton = document.createElement('button');
    closeButton.innerText = "Fechar";
    closeButton.style.position = "absolute";
    closeButton.style.top = "20px";
    closeButton.style.right = "20px";
    closeButton.style.padding = "10px";
    closeButton.style.background = "#ff4d4d";
    closeButton.style.color = "white";
    closeButton.onclick = () => {
        Quagga.stop();
        document.body.removeChild(scannerContainer);
    };

    scannerContainer.appendChild(closeButton);
    document.body.appendChild(scannerContainer);

    Quagga.init({ inputStream: { name: "Live", type: "LiveStream", target: scannerContainer, constraints: { facingMode: "environment" } }, decoder: { readers: ["ean_reader", "code_128_reader"] } }, err => err ? console.error(err) : Quagga.start());

    Quagga.onDetected(result => {
        document.getElementById("barcodeInput").value = result.codeResult.code;
        Quagga.stop();
        document.body.removeChild(scannerContainer);
        searchProduct();
    });
}


