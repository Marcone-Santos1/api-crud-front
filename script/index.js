let UfSelectorElement = document.querySelectorAll('.uf-selector');
let inputNameElement = document.querySelector('#nome');
let inputIdadeElement = document.querySelector('#idade');
let inputCpfElement = document.querySelector('#cpf');
let cidadeModal = document.querySelector('#cidade');

let UfSelectorElementEdit = document.querySelector('#cidadeEdit');
let inputNameElementEdit = document.querySelector('#nomeEdit');
let inputIdadeElementEdit = document.querySelector('#idadeEdit');
let inputCpfElementEdit = document.querySelector('#cpfEdit');

let btnSubmitElement = document.querySelector('.button-submit');
let btnSubmitEditElement = document.querySelector('.button-submit-edit');
let btnSubmitDeleteElement = document.querySelector('.button-submit-delete');


let cellsOfTableElement = document.querySelector('#elements-table');

let table = document.querySelector('#table');

let cellsIdOfTableElement = document.querySelectorAll('.id_cliente');
let cellsNameOfTableElement = document.querySelectorAll('.nome');
let cellsAgeOfTableElement = document.querySelectorAll('.idade');
let cellsCPFOfTableElement = document.querySelectorAll('.cpf');
let cellsCityOfTableElement = document.querySelectorAll('.cidade');

// In your Javascript (external .js resource or <script> tag)
$(document).ready(function () {
    $('.uf-selector').select2({
        theme: 'bootstrap4',
    });
});

let raw = "";

let requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

listar();

fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados", requestOptions)
    .then(response => response.json())
    .then(result => {
        return result.sort((a, b) => a.sigla > b.sigla ? 1 : -1)
    })
    .then(result => {
        result.forEach(element => {
            $(UfSelectorElement).append(`<option class="option" value="${element.sigla}">${element.nome}</option>`);
        });
    })
    .catch(error => console.log('error', error));

function listar() {
    fetch("http://localhost:3000/cliente", requestOptions)
        .then(response => response.json())
        .then(result => {
            result.clientes.forEach(element => {
                if (element.id_cliente in cellsIdOfTableElement) {
                    console.log('já existe')
                } else {
                    insertIntem(element);
                }
            });
        })
        .catch(error => console.log('error', error));
}

function insertIntem(element) {
    $(cellsOfTableElement).append(`
        <tr>
            <td class="id_cliente
            ">${element.id_cliente}</td>
            <td class="nome">${element.nome}</td>
            <td class="idade">${element.idade}</td>
            <td class="cpf">${element.cpf}</td>
            <td class="cidade">${element.cidade
        }</td>
            <td>
                <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalEditCliente" onclick="editar(${element.id_cliente})">Editar</button>
                <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#modalDeleteCliente" onclick="deletar(${element.id_cliente})">Deletar</button>
            </td>
        </tr>
    `);
}

function editar(id) {

    let idCliente = id;
    let option = document.querySelectorAll(`.option`);

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("http://localhost:3000/cliente/" + idCliente, requestOptions)
        .then(response => response.json())
        .then(result => {

            inputNameElementEdit.setAttribute('value', result.response.cliente.nome);
            inputIdadeElementEdit.setAttribute('value', result.response.cliente.idade);
            inputCpfElementEdit.setAttribute('value', result.response.cliente.cpf);


            option.forEach(element => {
                if (element.value == result.response.cliente.cidade) {
                    document.querySelector('#select2-cidadeEdit-container').innerHTML = element.innerText;
                }
            });

            console.log(btnSubmitEditElement)

            btnSubmitEditElement.addEventListener('click', (event) => {
                event.preventDefault();
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                let raw = JSON.stringify({
                    "nome": inputNameElementEdit.value,
                    "idade": inputIdadeElementEdit.value,
                    "cpf": inputCpfElementEdit.value,
                    "cidade": UfSelectorElementEdit.value,
                });

                console.log(raw);

                let requestOptions = {
                    method: 'PATCH',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("http://localhost:3000/cliente/" + idCliente, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                        alert('Cliente Atualizado com sucesso!');
                        $("#modalEditCliente").hide();
                        setInterval(() => {
                            location.reload();
                        }, 2000);
                        btnSubmitElement.classList.remove('button-submit-edit')
                    })
                    .catch(error => console.log('error', error));
            });

        })
        .catch(error => console.log('error', error));
}

function deletar(id) {
    let idCliente = id;

    btnSubmitDeleteElement.addEventListener('click', (event) => {
        event.preventDefault();
        let requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };
    
        fetch("http://localhost:3000/cliente/" + idCliente, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                alert('Cliente deletado com sucesso!');
                $("#modalDeleteCliente").hide();
                setInterval(() => {
                    location.reload();
                }, 2000);
            }
            )
            .catch(error => console.log('error', error));
    });

}


btnSubmitElement.addEventListener('click', (event) => {

    event.preventDefault();
    console.log('Clicou ' + event);
    if (inputNameElement.value === '' || inputIdadeElement.value === '' || inputCpfElement.value === '' || UfSelectorElement.value == '') {
        alert('Preencha todos os campos');
        return;
    } else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "nome": inputNameElement.value,
            "idade": inputIdadeElement.value,
            "cpf": inputCpfElement.value,
            "cidade": cidadeModal.value
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/cliente", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                alert('Cliente cadastrado com sucesso!');
                $("#modalCreateCliente").hide();
                setInterval(() => {
                    location.reload();
                }, 2000);
            })
            .catch(error => console.log('error', error));
    }
});

