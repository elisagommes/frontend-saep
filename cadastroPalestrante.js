const formPalestrante = document.getElementById("container-label-cadastro")

if (formPalestrante) {
    formPalestrante.addEventListener('submit', async (e) => {
        e.preventDefault()

        const novoPalestrante = {
            nome: document.getElementById("nome")?.value.trim(),
            email: document.getElementById("email")?.value.trim()
        }

        if (!novoPalestrante.nome || !novoPalestrante.email) {
            alert("Preencha nome e e-mail.")
            return
        }

        try {
            const response = await fetch("http://localhost:3000/api/palestrantes", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoPalestrante)
            })

            const dados = await response.json().catch(() => ({}))

            if (!response.ok) {
                alert(dados.error || dados.message || "Ocorreu um erro ao cadastrar o palestrante!")
                return
            }

            alert("Palestrante cadastrado com sucesso!")
            e.target.reset()
            window.location.href = 'cadastroEventos.html'
        } catch (erro) {
            console.error(erro)
            alert("Não foi possível conectar à API. Verifique se o servidor está rodando.")
        }
    })
}