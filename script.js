let products = [];
let wrongPrices = [];

// 📂 Carregar arquivo Excel
document.getElementById('excelFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            products = data.slice(1).map(row => ({
                barras: row[0]?.toString().trim(),
                descricao: row[1]?.toString().trim(),
                preco: row[2]?.toString().trim()
            })).filter(item => item.barras);
        };
        reader.readAsBinaryString(file);
    }
});

function searchProduct() {
    const barcode = document.getElementById('barcodeInput').value;
    const product = products.find(p => p.barras === barcode);
    
    if (product) {
        document.getElementById('description').textContent = product.descricao;
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

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerContainer,
            constraints: {
                facingMode: "environment",
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        },
        decoder: {
            readers: ["ean_reader", "code_128_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(result => {
        document.getElementById("barcodeInput").value = result.codeResult.code;
        Quagga.stop();
        document.body.removeChild(scannerContainer);
        searchProduct();
    });

    document.body.appendChild(scannerContainer);
}



