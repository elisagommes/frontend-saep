const dialog = document.createElement("dialog")
dialog.id = "editar-palestrante"
dialog.innerHTML = `
    <button type="button" onclick="document.getElementById('editar-palestrante').close()" class="fechar-edicao">X</button>
    <h1>Editar as informações do palestrante</h1>

    <div class="linha-cadastro">
        <div>
            <label for="nome-palestrante-edit">Nome:</label><br>
            <input type="text" id="nome-palestrante-edit">
        </div>
        <div>
            <label for="email-palestrante-edit">Email:</label><br>
            <input type="email" id="email-palestrante-edit">
        </div>
    </div>

    <div class="linha-cadastro">
        <div>
            <label for="evento-palestrante-edit">ID do evento:</label><br>
            <input type="number" id="evento-palestrante-edit" min="1">
        </div>
        <div class="botoes-editar">
            <button type="button" class="btn-excluir-evento" onclick="excluirPalestrante()">Excluir palestrante</button>
            <button type="button" class="btn-confirm-edicao" onclick="salvarEdicaoPalestrante()">Confirmar mudanças</button>
        </div>
    </div>
`
document.body.appendChild(dialog)

let idPalestranteEditando = null

function editarPalestrante(nome, email, eventoId, palestranteId) {
    idPalestranteEditando = palestranteId

    document.getElementById("nome-palestrante-edit").value = nome
    document.getElementById("email-palestrante-edit").value = email
    document.getElementById("evento-palestrante-edit").value = eventoId || ""

    document.getElementById("editar-palestrante").showModal()
}

async function salvarEdicaoPalestrante() {
    const nome = document.getElementById("nome-palestrante-edit").value
    const email = document.getElementById("email-palestrante-edit").value
    const evento_id = Number(document.getElementById("evento-palestrante-edit").value)

    if (!nome || !email || !evento_id) {
        alert("Preencha todos os campos.")
        return
    }

    try {
        const response = await fetch(`http://localhost:3000/api/palestrantes/${idPalestranteEditando}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, evento_id })
        })

        const dados = await response.json()

        if (!response.ok) {
            alert("Erro: " + (dados.error || JSON.stringify(dados)))
            return
        }

        alert("Palestrante atualizado com sucesso!")
        window.location.reload()
    } catch (erro) {
        alert("Erro ao atualizar palestrante.")
    }
}

async function excluirPalestrante() {
    if (!confirm("Tem certeza que deseja excluir este palestrante?")) return

    try {
        const response = await fetch(`http://localhost:3000/api/palestrantes/${Number(idPalestranteEditando)}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            const dados = await response.json()
            alert(dados.error || "Erro ao excluir palestrante!")
            return
        }

        alert("Palestrante excluído com sucesso!")
        window.location.reload()
    } catch (erro) {
        alert("Erro ao excluir palestrante.")
    }
}

fetch("http://localhost:3000/api/palestrantes")
    .then(response => {
        if (!response.ok) {
            throw new Error("Ocorreu um erro ao carregar os palestrantes.")
        }
        return response.json()
    })
    .then(palestrantes => {
        const lista = document.getElementById("card-palestrantes")

        if (palestrantes.length === 0) {
            lista.textContent = "Nenhum palestrante cadastrado."
            return
        }

        palestrantes.forEach(palestrante => {
            const card = document.createElement("div")
            card.className = "palestrante"

            const nome = document.createElement("p")
            nome.textContent = `Nome: ${palestrante.nome}`

            const email = document.createElement("p")
            email.textContent = `Email: ${palestrante.email}`

            const evento = document.createElement("p")
            evento.textContent = `Evento: ${palestrante.evento_id || "Não informado"}`

            const botaoEditar = document.createElement("button")
            botaoEditar.className = "botao"
            botaoEditar.textContent = "Editar"
            botaoEditar.addEventListener("click", () => {
                editarPalestrante(
                    palestrante.nome,
                    palestrante.email,
                    palestrante.evento_id,
                    palestrante.id
                )
            })

            card.append(nome, email, evento, botaoEditar)
            lista.appendChild(card)
        })
    })
    .catch(erro => {
        alert(erro.message)
    })