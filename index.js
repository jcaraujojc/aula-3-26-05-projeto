import express from 'express';
import path from 'path';

const host = '0.0.0.0';
const porta = 3000;

let listaUsuarios = [];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'publico')));

function gerarFormularioCadastro(resposta, nome = '', sobrenome = '', usuario = '', cidade = '', estado = '', cep = '', erros = {}) {
    let htmlresposta = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página de Cadastro Usuários</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <style>
            .container {
                border: 2px solid rgb(173, 208, 196);
                border-radius: 25px;
                background-color: rgb(173, 208, 196);
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }

            .btn-primary {
                background-color: green;
                border: green;
            }
        </style>
    </head>
    <body>
        <div class="container border mt-5">
            <form method="POST" action='/cadastrarUsuario' class="row g-3'>
                <legend style="text-align: center; margin-top: 30px;">Cadastro de Usuários</legend>`;

    // Campo Nome
    htmlresposta += `
        <div class="col-md-4 form-group">
            <label for="nome" class="form-label">Nome:</label>
            <input type="text" class="form-control" id="nome" name="nome" value="${nome}">
            ${erros.nome ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o nome do usuário.</div>' : ''}
        </div>`;

    // Campo Sobrenome
    htmlresposta += `
        <div class="col-md-4 form-group">
            <label for="sobrenome" class="form-label">Sobrenome:</label>
            <input type="text" class="form-control" id="sobrenome" name="sobrenome" value="${sobrenome}">
            ${erros.sobrenome ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o sobrenome do usuário.</div>' : ''}
        </div>`;

    // Campo Nome de Usuário
    htmlresposta += `
        <div class="col-md-4 form-group">
            <label for="usuario" class="form-label">Nome do usuário:</label>
            <div class="input-group has-validation">
                <span class="input-group-text" id="inputGroupPrepend">@</span>
                <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario}" aria-describedby="inputGroupPrepend">
            </div>
            ${erros.usuario ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o nome de login do usuário.</div>' : ''}
        </div>`;

    // Campo Cidade
    htmlresposta += `
        <div class="col-md-6 form-group">
            <label for="cidade" class="form-label">Cidade:</label>
            <input type="text" class="form-control" id="cidade" name="cidade" value="${cidade}">
            ${erros.cidade ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe a cidade.</div>' : ''}
        </div>`;

    // Campo Estado
    htmlresposta += `
        <div class="col-md-3 form-group">
            <label for="estado" class="form-label">UF:</label>
            <select class="form-select" id="estado" name="estado">
                <option selected disabled value="${estado}">Escolha um estado</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
            </select>
            ${erros.estado ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o estado.</div>' : ''}
        </div>`;

    // Campo CEP
    htmlresposta += `
        <div class="col-md-3 form-group">
            <label for="cep" class="form-label">CEP:</label>
            <input type="text" class="form-control" id="cep" name="cep" value="${cep}">
            ${erros.cep ? '<div class="alert alert-danger mt-1" role="alert">Por favor informe o CEP.</div>' : ''}
        </div>`;

    // Botões
    htmlresposta += `
        <div class="col-12 mb-3">
            <button class="btn btn-primary" type="submit">Cadastrar</button>
            <a class="btn btn-secondary" href="/">Voltar</a>
        </div>
    </form>
</div>
</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
crossorigin="anonymous"></script>
</html>
`;

    resposta.write(htmlresposta);
    resposta.end();
}

function cadastrarUsuario(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const sobrenome = requisicao.body.sobrenome;
    const usuario = requisicao.body.usuario;
    const cidade = requisicao.body.cidade;
    const estado = requisicao.body.estado;
    const cep = requisicao.body.cep;

    let erros = {};

    if (!nome || nome.trim() === "") {
        erros.nome = true;
    }
    if (!sobrenome || sobrenome.trim() === "") {
        erros.sobrenome = true;
    }

    if (!usuario || usuario.trim() === "") {
        erros.usuario = true;
    }

    if (!cidade || cidade.trim() === "") {
        erros.cidade = true;
    }

    if (!estado || estado.trim() === "") {
        erros.estado = true;
    }

    if (!cep || cep.trim() === "") {
        erros.cep = true;
    }

    if (Object.keys(erros).length > 0) {
        gerarFormularioCadastro(resposta, nome, sobrenome, usuario, cidade, estado, cep, erros);
    } else {
        listaUsuarios.push({ nome, sobrenome, usuario, cidade, estado, cep });
        resposta.redirect('/listarUsuarios');
    }
}

function listarUsuarios(resposta) {
    let htmlresposta = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Usuários</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>
    <body>
        <div class="container border mt-5">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Sobrenome</th>
                        <th scope="col">Usuário</th>
                        <th scope="col">Cidade</th>
                        <th scope="col">UF</th>
                        <th scope="col">CEP</th>
                    </tr>
                </thead>
                <tbody>`;

    listaUsuarios.forEach(usuario => {
        htmlresposta += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.sobrenome}</td>
                        <td>${usuario.usuario}</td>
                        <td>${usuario.cidade}</td>
                        <td>${usuario.estado}</td>
                        <td>${usuario.cep}</td>
                    </tr>`;
    });

    htmlresposta += `
                </tbody>
            </table>
            <a class="btn btn-primary" href="/">Voltar</a>
        </div>
    </body>
    </html>`;

    resposta.write(htmlresposta);
    resposta.end();
}

app.get('/', (requisicao, resposta) => {
    gerarFormularioCadastro(requisicao,resposta);
});

app.post('/cadastrarUsuario', (requisicao, resposta) => {
    cadastrarUsuario(requisicao, resposta);
});

app.get('/listarUsuarios', (requisicao, resposta) => {
    listarUsuarios(requisicao,resposta);
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});