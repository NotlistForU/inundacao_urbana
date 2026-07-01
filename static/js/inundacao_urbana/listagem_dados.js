// contem TODOS os registros vindo do back-end
const todosDados = JSON.parse(document.getElementById("dados-json").textContent);

// contem apenas os registros que vão se visiveis.
let dadosExibidos = [...todosDados]; // após aplicar um filtro por exemplo.

// Reordenar a tabela de acordo com os "dadosExibidos".
function reordenarTabela() {
    document.querySelectorAll(".linha-dados, .linha-edicao").forEach(linha => {
        linha.style.display = "none";
    });

    const tbody = document.getElementById("tbody-dados");

    dadosExibidos.forEach(item => {
        const linhaDados = document.querySelector(`.linha-dados[data-id="${item.id}"]`);
        const linhaEdicao = document.querySelector(`.linha-edicao[data-id="${item.id}"]`);

        linhaDados.style.display = "";
        linhaEdicao.style.display = "";

        tbody.appendChild(linhaDados);
        tbody.appendChild(linhaEdicao);
    });
}


function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}


// ========== Filtragem de registros ===============================================
const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
btnLimparFiltros.addEventListener('click', () => {
    dadosExibidos = [...todosDados];
    reordenarTabela();
});

const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
btnAplicarFiltros.addEventListener('click', () => {
    aplicarFiltros();

    const modal = bootstrap.Modal.getInstance(
        document.getElementById('modal-filtro')
    );

    modal.hide();
});

function obterFiltros() {
    return {
        municipio: document.getElementById("filtro-municipio").value.trim(),
        cd_estacao: document.getElementById("filtro-cd_estacao").value.trim(),

        inicioData_voo: document.getElementById("filtro-inicio-data_voo").value,
        finalData_voo: document.getElementById("filtro-final-data_voo").value,

        inicioCota_alerta: document.getElementById("filtro-inicio-cota_alerta").value,
        finalCota_alerta: document.getElementById("filtro-final-cota_alerta").value,

        inicioCota_atencao: document.getElementById("filtro-inicio-cota_atencao").value,
        finalCota_atencao: document.getElementById("filtro-final-cota_atencao").value,

        inicioCota_inundacao: document.getElementById("filtro-inicio-cota_inundacao").value,
        finalCota_inundacao: document.getElementById("filtro-final-cota_inundacao").value,

        inicioCota_maxima: document.getElementById("filtro-inicio-cota_maxima").value,
        finalCota_maxima: document.getElementById("filtro-final-cota_maxima").value,
    }
}

function aplicarFiltros() {
    console.log("dentro do aplicarFiltros")
    const filtros = obterFiltros();
    console.log(filtros);

    dadosExibidos = todosDados.filter(item => {
        if (!filtroData(filtros.inicioData_voo, filtros.finalData_voo, item.data_voo)) { return false; }

        if (!filtroTexto(filtros.municipio, item.municipio)) { return false; }
        if (!filtroTexto(filtros.cd_estacao, item.cd_estacao)) { return false; }

        if (!filtroNumerico(filtros.inicioCota_alerta, filtros.finalCota_alerta, item.cota_alerta)) { return false; }
        if (!filtroNumerico(filtros.inicioCota_atencao, filtros.finalCota_atencao, item.cota_atencao)) { return false; }
        if (!filtroNumerico(filtros.inicioCota_maxima, filtros.finalCota_maxima, item.cota_maxima)) { return false; }
        if (!filtroNumerico(filtros.inicioCota_inundacao, filtros.finalCota_inundacao, item.cota_inundacao)) { return false; }

        return true;
    });
    console.log(dadosExibidos.length);
    console.log(dadosExibidos);

    reordenarTabela();
}

function filtroTexto(valorFiltro, valorItem) {
    if (!valorFiltro) return true; // filtros.valor -> não preenchido.
    if (valorItem == null) return false; // item.valor -> null.
    // o texto do item.valor bate com do filtro valor mesmo que em parte port -> esta incluso em porto velho.
    const temValorItemComValorFiltro = String(valorItem).toLowerCase().includes(valorFiltro.toLowerCase());
    return temValorItemComValorFiltro;
}

function filtroNumerico(minFiltro, maxFiltro, valorItem) {
    // temValorItemDentroDoMinOuMax = false;
    if (!minFiltro && !maxFiltro) { return true; }
    if (!valorItem) { return false; }
    const valorItemNumerico = parseFloat(valorItem);
    if (minFiltro && (valorItemNumerico < minFiltro)) { return false; }
    if (maxFiltro && (valorItemNumerico > maxFiltro)) { return false; }
    // temValorItemDentroDoMinOuMax = true; -> passou!
    return true;
}

// precisa que as datas estejam no formato ANO-MÊS-DIA
function filtroData(dataInicioFiltro, dataFimFiltro, valorItem) {
    // temValorItemDentroDeDataInicioEDataFimDoFiltro = false;
    if (!dataInicioFiltro && !dataFimFiltro) { return true; }
    if (!valorItem) { return false; }
    if (dataInicioFiltro && (valorItem < dataInicioFiltro)) { return false; }
    if (dataFimFiltro && (valorItem > dataFimFiltro)) { return false; }
    // temValorItemDentroDeDataInicioEDataFimDoFiltro = true;
    return true;
}



// ========= Ordernar registros ==================================================== OK
const columnsCampos = document.querySelectorAll('[id$="-column-campo"]');
columnsCampos.forEach(columnCampo => {
    columnCampo.addEventListener('click', function () {
        const campo = columnCampo.id.replace('-column-campo', '');

        // reseta os icones sort das outras colunas 
        columnsCampos.forEach(outraColumn => {
            if (outraColumn !== this) {
                outraColumn.dataset.direcao = ""; // Deixa o data vazio
                outraColumn.classList.remove('bi-sort-up', 'bi-sort-down');
                outraColumn.classList.add('bi-sort-down'); // Volta pro padrão down
            }
        })

        let direcao = this.dataset.direcao;
        direcao = trocarDirecao(direcao);

        reordenarDadosExibidos(campo, direcao);
        this.dataset.direcao = direcao;
        let sortClassName = trocarClassSort(direcao);

        // 1. Remove as duas classe  "bi-sort-"
        this.classList.remove('bi-sort-up', 'bi-sort-down');
        this.classList.add(`bi-sort-${sortClassName}`);

    });
});



function reordenarDadosExibidos(campo, direcao) {
    dadosExibidos.sort((a, b) => {
        // deixa os Nones no final sempre
        if (a[campo] == null || a[campo] === '') return 1;
        if (b[campo] == null || b[campo] === '') return -1;

        const primeiro = direcao == 'crescente' ? a : b;
        const segundo = direcao == 'crescente' ? b : a;
        if (campo == 'municipio') { return primeiro[campo].localeCompare(segundo[campo]); }

        // detecta campo de data pelo formato ISO (YYYY-MM-DD)
        const isData = /^\d{4}-\d{2}-\d{2}$/.test(primeiro[campo]);
        if (isData) { return new Date(primeiro[campo]) - new Date(segundo[campo]); }

        return Number(primeiro[campo]) - Number(segundo[campo]);
    });
    reordenarTabela();
}

function trocarDirecao(direcao) {
    if (direcao === "decrescente") return 'crescente';
    return 'decrescente';
}

function trocarClassSort(direcao) {
    if (direcao === "decrescente") return 'up';
    return 'down';
}


// ========= ALTERNAR LINHA -> LINHA EDIÇÃO =============================
document.addEventListener("DOMContentLoaded", () => {
    const botoesEditar = document.querySelectorAll('.botoes-ir-para-edicao');
    botoesEditar.forEach(botao => {
        botao.addEventListener('click', function () {
            const idSelecionado = this.dataset.id;
            startEdit(idSelecionado);
        });
    });

    const botoesCancelar = document.querySelectorAll('.botoes-cancelar-edicao');
    botoesCancelar.forEach(botao => {
        botao.addEventListener('click', function () {
            const idSelecionado = this.dataset.id;
            cancelEdit(idSelecionado);
        });
    });

});


// =========== MODAL EXCLUIR REGISTRO =====================
const modalExcluirRegistro = document.getElementById('modal-excluir');
modalExcluirRegistro.addEventListener('show.bs.modal', function (event) {
    // botao q disparou o addEventListener
    const botao = event.relatedTarget;

    const idRegistro = botao.dataset.id;
    const cd_geocodiRegistro = botao.dataset.cd_geocodi;
    const strongId = modalExcluirRegistro.querySelector('#id-registro');
    const spanId = modalExcluirRegistro.querySelector('#cd_geocodi-registro');
    strongId.textContent = `ID: #${idRegistro}`;
    spanId.textContent = ` | cd_geocodi: ${cd_geocodiRegistro}`;
});


function startEdit(id) {
    document.querySelector(`.linha-dados[data-id="${id}"]`).classList.add('d-none');
    document.querySelector(`.linha-edicao[data-id="${id}"]`).classList.remove('d-none');
}

function cancelEdit(id) {
    document.querySelector(`.linha-edicao[data-id="${id}"]`).classList.add('d-none');
    document.querySelector(`.linha-dados[data-id="${id}"]`).classList.remove('d-none');
}