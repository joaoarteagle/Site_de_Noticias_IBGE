    const ul = document.createElement("ul");
    const main = document.querySelector("main");
    const buttonsArea = document.createElement("ul");
    buttonsArea.className = "buttonsAreas"

    

async function API(){
    try {
       const data = await fetch(`http://servicodados.ibge.gov.br/api/v3/noticias`);

       const jsonData = await data.json();
        
       const pageQunt = jsonData.count / 10 ;

       const noticias = await jsonData.items.slice(0,10);
        
       noticias.forEach(element => {

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

        console.log(element.titulo);
       });

       main.appendChild(ul);
       createButton();
       
    } catch (error) {
        console.error(error)
        console.log("Algo de errado")
    }
}

function createButton(){
    for(i = 1; i<= 10; i++){

        button = document.createElement("button");
        button.textContent = i; 
        li = document.createElement("li");
        li.appendChild(button);

        buttonsArea.appendChild(li);
        main.appendChild(buttonsArea);
    }
}


API();
