let products = [];

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

// 📸 Função para Escanear Código de Barras
function startScanner() {
    const scannerContainer = document.createElement('div







