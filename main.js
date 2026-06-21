const botaoTema = document.getElementById('temaBtn');

botaoTema.addEventListener('click', function() {
    document.body.classList.toggle('escuro');

    if (document.body.classList.contains('escuro')) {
        botaoTema.textContent = '☀️ Modo Claro';
    } else {
        botaoTema.textContent = '🌙 Modo Escuro';
    }
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const client = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

async function excluirMensagem(id) {
    const { error } = await client
        .from('messages')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Erro ao excluir');
        console.error(error);
        return;
    }

    carregarMensagens();
}

window.excluirMensagem = excluirMensagem;

async function carregarMensagens() {
    const { data, error } = await client
        .from('messages')
        .select('*');

    if (error) {
        console.error(error);
        return;
    }

    const lista = document.getElementById('listaMensagens');
    lista.innerHTML = '';

    data.forEach(item => {
        lista.innerHTML += `
            <div class="mensagem">
                <strong>${item.nome}</strong><br>
                ${item.email}<br>
                ${item.mensagem}<br><br>

                <button onclick="excluirMensagem(${item.id})">
                    Excluir
                </button>
            </div>
        `;
    });
}

document.getElementById('mensagemForm')
.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    const resposta = document.getElementById('resposta');
    resposta.innerHTML = 'Enviando...';

    client
        .from('messages')
        .insert([
            {
                nome,
                email,
                mensagem
            }
        ])
        .then(({ error }) => {
            if (error) {
                resposta.innerHTML = 'Erro: ' + error.message;
            } else {
                resposta.innerHTML = 'Mensagem enviada com sucesso!';
                document.getElementById('mensagemForm').reset();
                carregarMensagens();
            }
        });
});

carregarMensagens();