    const ul = document.createElement("ul");
    ul.className = "container"
    const main = document.querySelector("main");
    const buttonsArea = document.createElement("ul");
    const filtro = document.querySelector("svg");
    buttonsArea.className = "buttonsArea";

    const urlSearchParams = new URLSearchParams(location.search);

    let parans = urlSearchParams.toString();
    let position = parans.indexOf("?");
    let result = parans.substring(position);

    let page = !isNaN(urlSearchParams.get("page"))
    ? parseInt(urlSearchParams.get("page"))
    : 1


    console.log(page);


    let itemsPerPage = 10;//(parseInt(urlSearchParams.get("qtd")) !== null) ? (parseInt(urlSearchParams.get("qtd"))) : 10
    let currentPage = !isNaN(urlSearchParams.get("page"))
    ? parseInt(urlSearchParams.get("page"))
    : 1
     let totalPages = 1;
    let noticias = [];
    let jsonData;

    filtro.setAttribute("onclick", 'openModal()');


//     function getFilter(){
//           // URLSearchParams é uma classe que facilita a manipulação de query strings
//   const urlSearchParams = new URLSearchParams(location.search)

//   // Pegando o valor do parâmetro name
//   const pokemonName = urlSearchParams.get('name')



//     }

    //=====FUNCÃO QUE ABRE O MODAL E ADICIONA OS ANTIGOS VALORES DOS FILTROS
    function openModal(){
        const urlSearchParams = new URLSearchParams(location.search);

        const modal = document.querySelector('main #modal');

        const type       = document.querySelector("#type");
        const quantidade = document.querySelector("#quantidade");
        const de         = document.querySelector("#de");
        const ate        = document.querySelector("#ate");


        type.value       = urlSearchParams.get('tipo');
        quantidade.value = urlSearchParams.get('qtd');
        de.value         = urlSearchParams.get('de');
        ate.value        = urlSearchParams.get('ate');

        
        modal.showModal();
       
    }

    //=======ADICIONANDO FUNÇÃO DE FECHAR MODAL AO BOTAO X
    const close_modal = document.querySelector("#close_modal");
    close_modal.addEventListener('click', () =>{
        const modal = document.querySelector("main #modal");
        modal.close();
    })

    

async function API(query){

    try {
       const data = await fetch(`https://servicodados.ibge.gov.br/api/v3/noticias/?${query}`);

       jsonData = await data.json();
        
       
       noticias = await jsonData.items;

        totalPages = jsonData.totalPages ;
    
        await displayItems(currentPage);
        console.log("fez")
       
    } catch (error) {
        console.error(error)
        console.log("Algo de errado")
    }
}

 // Função para exibir os itens de uma página específica
function displayItems(page) {

    ul.innerHTML = ''; // Limpar os itens existentes
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const items = noticias.slice(startIndex, endIndex);

 
   

    items.forEach(element => {

        const li               = document.createElement("li");
        li.className           = "newsitem";

        const div              = document.createElement("div");

        const titulo           = document.createElement("h2");
        titulo.textContent     = element.titulo;
        const introducao       = document.createElement("p");
        introducao.textContent = element.introducao
        const editora          = document.createElement("p");
        editora.textContent    = `#${element.editorias}`;


        let urlBase            = "https://agenciadenoticias.ibge.gov.br/"
        const image            = JSON.parse(element.imagens);
    
        const urlImage         = urlBase + image.image_intro
        const foto             = document.createElement("img");
        foto.setAttribute("src", urlImage);



        const leiaMais         = document.createElement("a");
        leiaMais.textContent   = "Leia mais";
        leiaMais.setAttribute("href", `${element.link}`);




       li.appendChild(foto);
       div.appendChild(titulo);
       div.appendChild(introducao);
       div.appendChild(editora);
       div.appendChild(leiaMais);
        li.appendChild(div);


        ul.appendChild(li);

    
       });

       main.appendChild(ul);
       updateQueryString(currentPage);
       createPaginationButtons();

   
}

// function createButton(){

    
//     for(i = 1; i<= 10; i++){

//         button = document.createElement("button");
//         button.textContent = i; 
//         li = document.createElement("li");
//         li.appendChild(button);

//         buttonsArea.appendChild(li);
//         main.appendChild(buttonsArea);
//     }
// }


 // Função para criar os botões de paginação
 function createPaginationButtons() {
    buttonsArea.innerHTML = ''; // Limpar os botões existentes

    // console.log("entrou na função")
     let page = 11;

     


    const urlSeachParam = new URLSearchParams(location.search);
    const atualPage = parseInt(urlSeachParam.get("page"));

    if(atualPage > 6){
    

        page += atualPage - 6;
    }


     
     for (let i = page - 10; i < page; i++) {
        

        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = "pageButton"
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;

            updateQueryString(currentPage);
            // urlSeachParam.set("page", i)
            
            location.reload();
            API(urlSeachParam.toString().substring(position));
            
        });

        if(i === atualPage){
            button.className = "activeButton"
        }

        li.appendChild(button);
        buttonsArea.appendChild(li);
    }



    // const divButtonScroll = document.createElement("div");
    // divButtonScroll.className = "divButtonScroll";
    // divButtonScroll.appendChild(buttonsArea);
    main.appendChild(buttonsArea);
}






        // Função para atualizar a query string da URL
        function updateQueryString(page) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('page', page);
            window.history.pushState({}, '', newUrl);
        }

        // Verificar a query string ao carregar a página
        function checkQueryString() {
            const urlParams = new URLSearchParams(window.location.search);
            const page = parseInt(urlParams.get('page')) || 1;

            displayItems(page);
        }

        // Chamar a função para buscar os itens quando a página carregar
        checkQueryString();


        function filterNews(event){
            event.preventDefault();

            const form = document.querySelector("#form_modal");

            let formData = new FormData(form);
           
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('tipo',formData.get("type"));
            newUrl.searchParams.set('qtd', formData.get("quantidade"));
            newUrl.searchParams.set('de', formData.get("de"));
            newUrl.searchParams.set('ate', formData.get("ate"));
            window.history.pushState({}, '', newUrl);

            itemsPerPage = formData.get("qtd");

            

            displayItems(currentPage);
            
        }


       function SearchNews(event){
            event.preventDefault();


        

            const form = document.querySelector("#main_form");

            let formData = new FormData(form);
            const newUrl = new URL(window.location.href);


            if(formData.get("main_input")){

                newUrl.searchParams.set('busca', formData.get("main_input"));
                window.history.pushState({}, '', newUrl);
    
                 document.querySelector("#main_input").value = '';


            }

        }


API(result);
