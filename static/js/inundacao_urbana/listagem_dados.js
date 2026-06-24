// ==== FILTRAR ====================================
// document.addEventListener("DOMContentLoaded", () => {

//     // Dados
//     const dados = JSON.parse(document.getElementById("dados-json").textContent);
//     console.log(dados);

//     // Elementos
//     const inputFiltro = document.getElementById("input-filtro");
//     const sugestoes = document.getElementById("sugestoes");
//     const filtrosAtivos = document.getElementById("filtros-ativos");
//     const linhasPrincipais = document.querySelectorAll(".linha-principal");


//     // Campos possíveis
//     const campos = [
//         { atributo: "id", nome: "ID" },
//         { atributo: "municipio", nome: "Município" },
//         { atributo: "estacao", nome: "Estação" },
//         { atributo: "atencao", nome: "Atenção" },
//         { atributo: "alerta", nome: "Alerta" },
//         { atributo: "inundacao", nome: "Inundação" },
//         { atributo: "maxima", nome: "Máxima" },
//         { atributo: "data_voo", nome: "Data Voo" },
//         { atributo: "status", nome: "Status" },
//         { atributo: "longitude", nome: "Longitude" },
//         { atributo: "latitude", nome: "Latitude" },
//         { atributo: "cidade_id", nome: "Cidade ID" },
//         { atributo: "cota_rn_ana", nome: "Cota RN ANA" },
//         { atributo: "cota_rn_orto", nome: "Cota RN ORTO" },
//         { atributo: "integrado", nome: "Integrado" },
//         { atributo: "cd_estacao", nome: "CD Estação" }
//     ];

//     let campoSelecionado = null;
//     const filtros = [];
//     let sugestoesEncontradas = [];

//     // Clicou numa sugestão
//     sugestoes.addEventListener("click", (e) => {

//         if (!e.target.classList.contains("dropdown-item"))
//             return;

//         campoSelecionado = {
//             atributo: e.target.dataset.atributo,
//             nome: e.target.dataset.nome
//         };

//         inputFiltro.value = campoSelecionado.nome + ": ";

//         sugestoes.classList.remove("show");

//         inputFiltro.focus();

//         sugestoes.innerHTML = "";
//         sugestoesEncontradas = [];

//     });

//     // Digitou no input
//     inputFiltro.addEventListener("input", () => {

//         // Se já escolheu um campo, não mostra sugestões
//         if (campoSelecionado) {
//             sugestoes.classList.remove("show");
//             sugestoes.innerHTML = "";
//             sugestoesEncontradas = [];
//             return;
//         }

//         const texto = inputFiltro.value;

//         sugestoes.innerHTML = "";

//         if (texto.length === 0) {
//             sugestoes.classList.remove("show");
//             return;
//         }

//         sugestoesEncontradas = campos.filter(campo =>
//             normalizar(campo.nome).includes(normalizar(texto))
//         );

//         sugestoesEncontradas.forEach(campo => {

//             sugestoes.innerHTML += `
//                 <button
//                     class="dropdown-item"
//                     type="button"
//                     data-atributo="${campo.atributo}"
//                     data-nome="${campo.nome}">
//                     ${campo.nome}
//                 </button>
//             `;

//         });

//         if (sugestoesEncontradas.length > 0)
//             sugestoes.classList.add("show");
//         else
//             sugestoes.classList.remove("show");

//     });

//     // Apertou Enter
//     inputFiltro.addEventListener("keydown", (e) => {

//         if (e.key !== "Enter")
//             return;

//         e.preventDefault();

//         // Escolher campo automaticamente
//         if (!campoSelecionado) {

//             if (sugestoesEncontradas.length === 0)
//                 return;

//             campoSelecionado = {
//                 atributo: sugestoesEncontradas[0].atributo,
//                 nome: sugestoesEncontradas[0].nome
//             };

//             inputFiltro.value = campoSelecionado.nome + ": ";

//             sugestoes.classList.remove("show");

//             inputFiltro.focus();

//             sugestoes.innerHTML = "";
//             sugestoesEncontradas = [];

//             return;
//         }

//         // Criar filtro
//         const valor = inputFiltro.value
//             .replace(campoSelecionado.nome + ": ", "")
//             .trim();

//         if (!valor)
//             return;

//         filtros.push({
//             atributo: campoSelecionado.atributo,
//             nome: campoSelecionado.nome,
//             valor: valor
//         });

//         renderizarFiltros();
//         aplicarFiltros();

//         inputFiltro.value = "";

//         campoSelecionado = null;
//         sugestoes.innerHTML = "";
//         sugestoesEncontradas = [];

//     });

//     // Desenha as tags
//     function renderizarFiltros() {

//         filtrosAtivos.innerHTML = "";

//         filtros.forEach((filtro, indice) => {

//             filtrosAtivos.innerHTML += `
//             <span class="badge bg-primary fs-7">
//                 ${filtro.nome}: ${filtro.valor}

//                 <i
//                     class="bi bi-x ms-2 remover-filtro"
//                     data-indice="${indice}"
//                     style="cursor:pointer">
//                 </i>
//             </span>
//         `;

//         });

//     }
//     // Remover filtro
//     filtrosAtivos.addEventListener("click", (e) => {

//         if (!e.target.classList.contains("remover-filtro"))
//             return;

//         const indice = parseInt(e.target.dataset.indice);

//         filtros.splice(indice, 1);

//         renderizarFiltros();
//         aplicarFiltros();

//     });



//     // Aplica os filtros
//     function aplicarFiltros() {

//         linhasPrincipais.forEach(principal => {

//             const detalhes = principal.nextElementSibling;

//             const mostrar = filtros.every(filtro => {

//                 const valorLinha = normalizar(
//                     String(principal.dataset[filtro.atributo] || "")
//                 );

//                 const valorFiltro = normalizar(filtro.valor);

//                 return valorLinha.includes(valorFiltro);

//             });

//             principal.style.display = mostrar ? "" : "none";

//             if (detalhes) {
//                 detalhes.style.display = mostrar ? "" : "none";
//             }

//         });

//     }

// });


function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// ========= Ordernar registros ============


const todosDados = JSON.parse(document.getElementById("dados-json").textContent);
let dadosExibidos = [...todosDados];

const columnsCampos = document.querySelectorAll('[id$="-column-campo"]');
columnsCampos.forEach(columnCampo => {
    columnCampo.addEventListener('click', () => {
        const campo = columnCampo.id.replace('-column-campo', '');
        reordenarDadosExibidos(campo);
    });
});



function reordenarDadosExibidos(campo) {
    dadosExibidos.sort((a, b) => {
        if (a[campo] == null) return 1;
        if (b[campo] == null) return -1;
        if (campo == 'municipio') return a[campo].localeCompare(b[campo]);
        return Number(a[campo]) - Number(b[campo]);
    });
    reordenarTabela();
}



function reordenarTabela() {
    const tbody = document.getElementById("tbody-dados");
    dadosExibidos.forEach(item => {
        const linhaDados = document.querySelector(`.linha-dados[data-id="${item.id}"]`);
        const linhaEdicao = document.querySelector(`.linha-edicao[data-id="${item.id}"]`);

        tbody.appendChild(linhaDados);
        tbody.appendChild(linhaEdicao);
    });
}


// ========= ALTERNAR LINHA -> LINHA EDIÇÃO ===============
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