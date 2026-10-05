const dialog = document.createElement("dialog")
dialog.id = "editar"
dialog.innerHTML = `
    <button type="button" onclick="document.getElementById('editar').close()" class="fechar-edicao">X</button>
    <h1>Editar as informações do evento</h1>

    <div class="linha-cadastro">
        <div>
            <label for="nome-edit">Nome:</label><br>
            <input type="text" id="nome-edit">
        </div>
        <div>
            <label for="descricao-edit">Descrição:</label><br>
            <input type="text" id="descricao-edit">
        </div>
    </div>

    <div class="linha-cadastro">
        <div>
            <label for="local-edit">Local:</label><br>
            <input type="text" id="local-edit">
        </div>
        <div>
            <label for="data-edit">Data:</label><br>
            <input type="date" id="data-edit">
        </div>
    </div>

    <div class="linha-cadastro">
        <div>
            <label for="palestrante-edit">ID do palestrante:</label><br>
            <input type="number" id="palestrante-edit" min="1">
        </div>
        <div class="botoes-editar">
            <button type="button" class="btn-excluir-evento" onclick="excluirEvento()">Excluir evento</button>
            <button type="button" class="btn-confirm-edicao" onclick="salvarEdicao()">Confirmar mudanças</button>
        </div>
    </div>
`
document.body.appendChild(dialog)

let idEventoEditando = null

function editarEvento(nome, descricao, local, data, palestranteId, idEvento) {
    idEventoEditando = idEvento

    document.getElementById("nome-edit").value = nome
    document.getElementById("descricao-edit").value = descricao || ""
    document.getElementById("local-edit").value = local
    document.getElementById("data-edit").value = data
    document.getElementById("palestrante-edit").value = palestranteId

    document.getElementById("editar").showModal()
}

async function salvarEdicao() {
    const nome = document.getElementById("nome-edit").value
    const descricao = document.getElementById("descricao-edit").value
    const local = document.getElementById("local-edit").value
    const data = document.getElementById("data-edit").value
    const palestrante_id = Number(document.getElementById("palestrante-edit").value)

    if (!nome || !descricao || !local || !data || !palestrante_id) {
        alert("Preencha todos os campos.")
        return
    }

    try {
        const response = await fetch(`http://localhost:3000/api/eventos/${idEventoEditando}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, descricao, local, data, palestrante_id })
        })

        const dados = await response.json()

        if (!response.ok) {
            alert("Erro: " + (dados.error || JSON.stringify(dados)))
            return
        }

        alert("Evento atualizado com sucesso!")
        window.location.reload()
    } catch (erro) {
        alert("Erro ao atualizar evento.")
    }
}

async function excluirEvento() {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return

    try {
        const response = await fetch(`http://localhost:3000/api/eventos/${Number(idEventoEditando)}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            const dados = await response.json()
            alert(dados.error || "Erro ao excluir evento!")
            return
        }

        alert("Evento excluído com sucesso!")
        window.location.reload()
    } catch (erro) {
        alert("Erro ao excluir evento.")
    }
}

fetch("http://localhost:3000/api/eventos")
    .then(response => {
        if (!response.ok) {
            throw new Error("Ocorreu um erro ao carregar os eventos.")
        }
        return response.json()
    })
    .then(eventos => {
        const tabela = document.getElementById("card-eventos")

        eventos.forEach(evento => {
            const card = document.createElement("div")
            card.className = "evento"

            const nome = document.createElement("p")
            nome.textContent = `Nome: ${evento.nome}`

            const descricao = document.createElement("p")
            descricao.textContent = `Descrição: ${evento.descricao}`

            const local = document.createElement("p")
            local.textContent = `Local: ${evento.local}`

            const data = document.createElement("p")
            data.textContent = `Data: ${evento.data}`

            const palestrante = document.createElement("p")
            palestrante.textContent = `Palestrante: ${evento.palestrante_id}`

            const botaoEditar = document.createElement("button")
            botaoEditar.className = "botao"
            botaoEditar.textContent = "Editar"
            botaoEditar.addEventListener("click", () => {
                editarEvento(
                    evento.nome,
                    evento.descricao,
                    evento.local,
                    evento.data,
                    evento.palestrante_id,
                    evento.id
                )
            })

            card.append(nome, descricao, local, data, palestrante, botaoEditar)
            tabela.appendChild(card)
        })
    })
    .catch(erro => {
        alert(erro.message)
    })