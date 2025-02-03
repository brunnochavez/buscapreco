let products = [];
let wrongPrices = [];

// Carregar arquivo CSV
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            products = parseCSV(text);
            console.log(products);
        };
        reader.readAsText(file);
    }
});

function parseCSV(text) {
    const lines = text.split(/\r?\n/); // Garante compatibilidade com Windows e Linux
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const columns = lines[i].split(';').map(col => col.trim()); // Remove espaços extras
        if (columns.length >= 3) {
            result.push({
                barras: columns[0].replace(/^0+/, ''), // Remove zeros à esquerda
                descricao: columns[1],
                preco: columns[2].replace(',', '.')
            });
        }
    }
    return result;
}

function searchProduct() {
    const barcode = document.getElementById('barcodeInput').value;
    const product = products.find(p => p.barras === barcode);
    if (product) {
        const descricaoFormatada = product.descricao.replace(/^00;/, '');
        const precoFormatado = parseFloat(product.preco.replace(',', '.')).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        document.getElementById('description').textContent = descricaoFormatada;
        document.getElementById('price').textContent = precoFormatado;
    } else {
        document.getElementById('description').textContent = 'Produto não encontrado';
        document.getElementById('price').textContent = '';
    }
}

// Iniciar scanner
function startScanner() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Seu navegador não suporta acesso à câmera.");
        return;
    }

    Quagga.init({
        inputStream: {
            type: "LiveStream",
            constraints: {
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            area: {
                top: "20%",
                right: "20%",
                left: "20%",
                bottom: "20%"
            },
            target: document.getElementById("scanner-container")
        },
        locator: {
            patchSize: "medium",
            halfSample: true
        },
        decoder: {
            readers: ["ean_reader"]
        },
        locate: true
    }, function(err) {
        if (err) {
            console.error("Erro ao iniciar o scanner:", err);
            return;
        }
        console.log("Scanner iniciado com sucesso");
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        const barcode = result.codeResult.code;
        document.getElementById("barcodeInput").value = barcode;
        Quagga.stop();
        searchProduct();
    });
}

// Limpar pesquisa para próxima entrada
function clearSearch() {
    document.getElementById("barcodeInput").value = "";
    document.getElementById("description").textContent = "";
    document.getElementById("price").textContent = "";
}

// Reportar preço errado e salvar no CSV
function reportWrongPrice() {
    const barcode = document.getElementById("barcodeInput").value;
    const product = products.find(p => p.barras === barcode);

    if (product) {
        wrongPrices.push({
            barras: product.barras,
            descricao: product.descricao,
            preco: product.preco
        });

        saveWrongPricesCSV();
        alert("Produto adicionado à lista de preços errados.");
        clearSearch();
    } else {
        alert("Nenhum produto encontrado para registrar o erro.");
    }
}

// Criar e baixar o CSV de preços errados
function saveWrongPricesCSV() {
    if (wrongPrices.length === 0) {
        alert("Nenhum preço errado registrado.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Barras;Descrição;Preço\n";
    wrongPrices.forEach(item => {
        csvContent += `${item.barras};${item.descricao};${item.preco}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute("download", "precos_errados.csv");
    downloadLink.style.display = "block";
    downloadLink.textContent = "Baixar Lista de Preços Errados";
}
