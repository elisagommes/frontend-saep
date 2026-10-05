const formEvento = document.getElementById("container-label-cadastro")
const seletorPalestrante = document.getElementById("palestranteid")

if (formEvento) {
    formEvento.addEventListener('submit', async (e) => {
        e.preventDefault()

        const novoEvento = {
            nome: document.getElementById("nome")?.value.trim(),
            descricao: document.getElementById("descricao")?.value.trim(),
            local: document.getElementById("local")?.value.trim(),
            data: document.getElementById("data")?.value,
            palestrante_id: Number(seletorPalestrante?.value)
        }

        console.log("Novo evento:", novoEvento)
        if (!novoEvento.nome || !novoEvento.descricao || !novoEvento.local || !novoEvento.data ||
            !Number.isInteger(novoEvento.palestrante_id)) {
            alert("Preencha todos os campos do evento.")
            return
        }

        try {
            const response = await fetch("http://localhost:3000/api/eventos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoEvento)
            })

            const dados = await response.json().catch(() => ({}))

            if (!response.ok) {
                alert(dados.error || dados.message || "Ocorreu um erro ao cadastrar o evento!")
                return
            }

            alert("Evento cadastrado com sucesso!")
            e.target.reset()
            window.location.href = 'home.html'
        } catch (erro) {
            console.error(erro)
            alert("Não foi possível conectar à API. Verifique se o servidor está rodando.")
        }
    })
}

if (seletorPalestrante) {
    fetch("http://localhost:3000/api/palestrantes")
        .then(response => {
            if (!response.ok) {
                throw new Error("Ocorreu um erro ao carregar os palestrantes.")
            }
            return response.json()
        })
        .then(resposta => {
            const palestrantes = Array.isArray(resposta) ? resposta : resposta.value

            if (!Array.isArray(palestrantes)) {
                throw new Error("A resposta da API de palestrantes está em um formato inválido.")
            }

            if (palestrantes.length === 0) {
                seletorPalestrante.replaceChildren(new Option("Nenhum palestrante cadastrado", ""))
                return
            }

            seletorPalestrante.replaceChildren(new Option("Selecione um palestrante", ""))

            palestrantes.forEach(palestrante => {
                seletorPalestrante.add(new Option(palestrante.nome, palestrante.id))
            })
        })
        .catch(erro => {
            console.error(erro)
            seletorPalestrante.replaceChildren(new Option("Não foi possível carregar os palestrantes", ""))
            alert(erro.message)
        })
}