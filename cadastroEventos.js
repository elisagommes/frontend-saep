const formEvento = document.getElementById("container-label-cadastro")

if (formEvento) {
    formEvento.addEventListener('submit', async (e) => {
        e.preventDefault()

        const novoEvento = {
            nome: document.getElementById("nome")?.value.trim(),
            descricao: document.getElementById("descricao")?.value.trim(),
            local: document.getElementById("local")?.value.trim(),
            data: document.getElementById("data")?.value,
            palestrante_id: Number(document.getElementById("palestranteid")?.value)
        }

        if (!novoEvento.nome || !novoEvento.descricao || !novoEvento.local || !novoEvento.data || !novoEvento.palestrante_id) {
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