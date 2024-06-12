    const ul = document.createElement("ul");
    const main = document.querySelector("main");
    const buttonsArea = document.createElement("ul");
    const filtro = document.querySelector("svg");
    buttonsArea.className = "buttonsArea";

    const itemsPerPage = 10;
    let currentPage = 1;
    let totalPages = 1;
    let noticias = [];

    filtro.setAttribute("onclick", 'openModal()');


    function openModal(){
        const modal = document.querySelector('main #modal');
        console.log("antes")
        modal.showModal();
        console.log("depois")
    }


    const close_modal = document.querySelector("#close_modal");
    close_modal.addEventListener('click', () =>{
        const modal = document.querySelector("main #modal");
        modal.close();
    })

    

async function API(){
    try {
       const data = await fetch(`http://servicodados.ibge.gov.br/api/v3/noticias`);

       const jsonData = await data.json();
        
       
       noticias = await jsonData.items;
       totalPages = noticias.length / 10 ;
        displayItems(currentPage);
       
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

        const li = document.createElement("li");
        li.className = "newsitem";

        const div = document.createElement("div");
        const titulo = document.createElement("h2");
        titulo.textContent = element.titulo;
        const introducao = document.createElement("p");
        introducao.textContent = element.introducao
        const editora = document.createElement("p");
        editora.textContent = `#${element.editorias}`;


        let urlBase = "https://agenciadenoticias.ibge.gov.br/"
        const image = JSON.parse(element.imagens);
    
        const urlImage = urlBase + image.image_intro
        const foto = document.createElement("img");
        foto.setAttribute("src", urlImage);



        const leiaMais = document.createElement("a");
        leiaMais.textContent = "Leia mais";
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

    // console.log("entrou na função")
     buttonsArea.innerHTML = ''; // Limpar os botões existentes
     
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
            displayItems(currentPage);
            
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
          //  fetchItems(page);
        }

        // Chamar a função para buscar os itens quando a página carregar
        checkQueryString();

API();
