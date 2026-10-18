const formulario = document.getElementById("formulario-cadastro");
const apiBaseUrl = document.querySelector('meta[name="api-base-url"]').content.replace(/\/+$/, "");

formulario.addEventListener("submit", async (event) => {
    // Evita o comportamento padrão do formulário, que recarrega a página.
    event.preventDefault();

    // Captura os valores digitados pelo usuário nos campos do formulário.
    const nome = event.target.nome.value;
    const sobrenome = event.target.sobrenome.value;
    const email = event.target.email.value;
    const senha = event.target.senha.value;

    // Cria um objeto com os dados do cadastro para enviar ao backend.
    const dadosFormulario = {
        nome,
        sobrenome,
        email,
        senha
    };

    // Envia os dados para o endpoint de cadastro do backend.
    try {
        const response = await fetch(`${apiBaseUrl}/cadastro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // Converte o objeto em JSON antes de enviar no corpo da requisição.
            body: JSON.stringify(dadosFormulario)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensagem || "Não foi possível realizar o cadastro.");
        }

        alert(data.mensagem || "Cadastro realizado com sucesso!");
        formulario.reset();
    } catch (error) {
        console.error("Erro ao enviar os dados do formulário:", error);
        const mensagem = error instanceof TypeError
            ? "Não foi possível conectar ao servidor. Confira se a API está online e tente novamente."
            : error instanceof SyntaxError
                ? "O servidor retornou uma resposta inválida. Tente novamente."
                : error.message || "Não foi possível realizar o cadastro.";
        alert(mensagem);
    }
});