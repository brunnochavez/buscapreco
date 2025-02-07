let products = [];
let scannerActive = false;

// 📂 Carregar arquivo Excel e converter para JSON
document.getElementById('excelFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: ["barras", "descricao", "preco"] });

            products = data.map(row => ({
                barras: row.barras?.toString().trim(),
                descricao: row.descricao?.toString().trim(),
                preco: row.preco?.toString().trim()
            })).filter(item => item.barras);
            
            alert("Arquivo carregado com sucesso!");
        };
        reader.readAsBinaryString(file);
    }
});

// 🔎 Buscar produto pelo código de barras
function searchProduct() {
    const barcode = document.getElementById('barcodeInput').value.trim();
    const product = products.find(p => p.barras === barcode);
    
    if (product) {
        document.getElementById('description').textContent = product.descricao;
        document.getElementById('price').textContent = parseFloat(product.preco.replace(',', '.')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        document.getElementById('description').textContent = 'Produto não encontrado';
        document.getElementById('price').textContent = '';
    }
}

// 🧹 Limpar busca
function clearSearch() {
    document.getElementById('barcodeInput').value = "";
    document.getElementById('description').textContent = "";
    document.getElementById('price').textContent = "";
}

// 💾 Salvar produtos no LocalStorage
function saveProductsToLocal() {
    if (products.length > 0) {
        localStorage.setItem("products", JSON.stringify(products));
        alert("Lista de produtos salva!");
    } else {
        alert("Nenhum produto carregado para salvar.");
    }
}

// 📥 Exportar JSON
function exportJSON() {
    const jsonString = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "produtos.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 📸 Scanner de código de barras
function startScanner() {
    clearSearch();

    if (scannerActive) return;
    scannerActive = true;

    const scannerContainer = document.createElement('div');
    scannerContainer.id = "scanner-container";
    scannerContainer.innerHTML = `
        <div id="interactive" class="scanner-view"></div>
        <button class="secondary" onclick="stopScanner()">Fechar Câmera</button>
    `;
    document.body.appendChild(scannerContainer);

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#interactive"),
            constraints: { facingMode: "environment" }
        },
        decoder: { readers: ["ean_reader"] },
    }, function(err) {
        if (err) {
            alert("Erro ao inicializar câmera.");
            stopScanner();
        } else {
            Quagga.start();
        }
    });

    Quagga.onDetected(result => {
        document.getElementById("barcodeInput").value = result.codeResult.code;
        searchProduct();
        stopScanner();
    });
}

// ❌ Parar Scanner
function stopScanner() {
    Quagga.stop();
    document.getElementById("scanner-container")?.remove();
    scannerActive = false;
}





