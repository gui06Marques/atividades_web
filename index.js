// Factory function para criar objetos de gasto
function criarGasto(descricao, valor, categoria) {
    return {
        descricao,
        valor,
        categoria
    };
}

// Array para armazenar os gastos
let gastos = [];

// Função para adicionar um novo gasto
function adicionarGasto() {
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const categoria = document.getElementById('categoria').value;

    if (descricao && !isNaN(valor) && categoria) {
        const novoGasto = criarGasto(descricao, valor, categoria);

        gastos.push(novoGasto);
        exibirMensagem('Gasto cadastrado com sucesso!', 'success');
        limparCampos();
        atualizarListaGastos();
    } else {
        exibirMensagem('Por favor, preencha todos os campos.', 'error');
    }
}

// Função para limpar os campos do formulário de cadastro de gastos
function limparCampos() {
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('categoria').value = '';
}

// Função para exibir uma mensagem na tela
function exibirMensagem(mensagem, tipo) {
    const mensagemCadastro = document.getElementById('mensagem-cadastro');
    mensagemCadastro.textContent = mensagem;
    mensagemCadastro.className = tipo;
}

// Função para atualizar a lista de gastos
function atualizarListaGastos() {
    const listaGastosAgrupados = document.getElementById('lista-gastos-agrupados');
    listaGastosAgrupados.innerHTML = '';

    // Agrupa os gastos por categoria
    const gastosAgrupados = gastos.reduce((acc, gasto) => {
        if (!acc[gasto.categoria]) {
            acc[gasto.categoria] = [];
        }
        acc[gasto.categoria].push(gasto);
        return acc;
    }, {});

    // Itera sobre as categorias e exibe os gastos
    for (const categoria in gastosAgrupados) {
        const categoriaHeader = document.createElement('h3');
        categoriaHeader.textContent = categoria;
        listaGastosAgrupados.appendChild(categoriaHeader);

        const listaGastos = document.createElement('ul');
        gastosAgrupados[categoria].forEach(gasto => {
            const gastoItem = document.createElement('li');
            gastoItem.textContent = `${gasto.descricao}: R$ ${gasto.valor.toFixed(2)}`;

            // Botão de editar
            const editarButton = document.createElement('button');
            editarButton.textContent = 'Editar';
            editarButton.addEventListener('click', () => editarGasto(gasto));

            gastoItem.appendChild(editarButton);
            listaGastos.appendChild(gastoItem);
        });
        listaGastosAgrupados.appendChild(listaGastos);
    }
}

// Função para preencher o formulário de cadastro com os dados do gasto selecionado para edição
function editarGasto(gasto) {
    document.getElementById('descricao').value = gasto.descricao;
    document.getElementById('valor').value = gasto.valor;
    document.getElementById('categoria').value = gasto.categoria;

    // Atualiza a mensagem para orientar sobre a edição
    exibirMensagem('Editando gasto. Pressione "Cadastrar" para salvar as alterações.', 'info');

    // Remove o gasto da lista enquanto estiver sendo editado
    const index = gastos.indexOf(gasto);
    if (index !== -1) {
        gastos.splice(index, 1);
        atualizarListaGastos(); // Atualiza a lista de gastos sem o gasto que está sendo editado
    }
}

// Adiciona um event listener para o botão de cadastrar gasto
document.getElementById('btn-novo-gasto').addEventListener('click', adicionarGasto);

// Função para buscar gastos com base na descrição e/ou valor
function buscarGasto() {
    const buscaDescricao = document.getElementById('busca-descricao').value.toLowerCase();
    const buscaValor = parseFloat(document.getElementById('busca-valor').value);

    const resultados = gastos.filter(gasto => {
        const descricao = gasto.descricao.toLowerCase();
        const valor = gasto.valor;

        return (descricao.includes(buscaDescricao) || !buscaDescricao) && (valor === buscaValor || isNaN(buscaValor));
    });

    exibirResultadosBusca(resultados);
}

// Função para exibir os resultados da busca
function exibirResultadosBusca(resultados) {
    const listaGastosAgrupados = document.getElementById('lista-gastos-agrupados');
    listaGastosAgrupados.innerHTML = '';

    if (resultados.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Nenhum resultado encontrado.';
        listaGastosAgrupados.appendChild(mensagem);
    } else {
        // Agrupa os resultados por categoria
        const resultadosAgrupados = resultados.reduce((acc, gasto) => {
            if (!acc[gasto.categoria]) {
                acc[gasto.categoria] = [];
            }
            acc[gasto.categoria].push(gasto);
            return acc;
        }, {});

        // Itera sobre as categorias e exibe os gastos
        for (const categoria in resultadosAgrupados) {
            const categoriaHeader = document.createElement('h3');
            categoriaHeader.textContent = categoria;
            listaGastosAgrupados.appendChild(categoriaHeader);

            const listaGastos = document.createElement('ul');
            resultadosAgrupados[categoria].forEach(gasto => {
                const gastoItem = document.createElement('li');
                gastoItem.textContent = `${gasto.descricao}: R$ ${gasto.valor.toFixed(2)}`;
                listaGastos.appendChild(gastoItem);
            });
            listaGastosAgrupados.appendChild(listaGastos);
        }
    }
}

// Adiciona um event listener para o botão de buscar gasto
document.getElementById('btn-buscar-gasto').addEventListener('click', buscarGasto);
