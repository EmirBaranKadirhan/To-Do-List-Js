const cardBodyDOM = document.querySelectorAll(".card-body")[0];
const cardBodyDOM2 = document.querySelectorAll(".card-body")[1];
const inputDOM = document.querySelector("#todoName");
const formDOM = document.querySelector("#todoAddForm");
const liDOM = document.querySelector(".list-group");
const clearButton = document.querySelector("#clearButton");
const filtreInput = document.querySelector("#todoSearch");

let toDoArray = JSON.parse(localStorage.getItem("anahtar")) || [];  // Sayfa yüklendiğinde localStorage'daki array ya da boş array

eventlar();

sayfaYuklendigindeLocalStorageGetir();

function eventlar(){
    formDOM.addEventListener("submit",yeniToDo);        // yukarida butonu secmedik cunku buton zaten form'un icerisinde, yani butonda olusacak submit zaten formda gerceklesmis olacak!!!
    liDOM.addEventListener("click",toDoSilme);
    clearButton.addEventListener("click",localdenVeListedenSilme);
    filtreInput.addEventListener("keyup",filter);
}

function filter(e){
    const filterValue = e.target.value.toLowerCase().trim();                // asagidaki input yerinde tum yazilari kucuk olacak sekilde ayarladik ve sagindaki solundaki bosluklari kaldirdik
    const toDoListesi = document.querySelectorAll(".list-group-item");       // tum eklenen li elemenlerini secmis olduk
    
    if(toDoListesi.length>0){
        toDoListesi.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){
                //
                todo.setAttribute("style","display : block");
            }else{
                todo.setAttribute("style","display : none !important");    // bootstrap'in class'ini degil de kendi istedigimiz kodun kullanilmasini istedigimiz icin  !important yazdik 
            }
        });
    }else{
        genelAlertMesajlari("Bos Listede Filtreleme Yapamazsiniz","danger",liDOM)
    }
}


function yeniToDo(e){
    e.preventDefault();                                 // sayfa yeniden yuklendiginde bilgiler gitmesin!!!
    const inputTextContent = inputDOM.value
    if(inputTextContent !== ""){
        let ozelKarakterCikartilmis = ozelKarakterEngelleme(inputTextContent);
        let enSadeHali = ozelKarakterCikartilmis.trim()         
        console.log(enSadeHali);
        if(enSadeHali != ""){
            yeniLiToDo(enSadeHali);
            localStorageEkleme(enSadeHali);
            genelAlertMesajlari("Bilgiler Başarıyla Girildi","success",formDOM);
        }
    }else{
        genelAlertMesajlari("Lütfen Bir Değer Giriniz !!!","danger",formDOM);
    }       
}

function ozelKarakterEngelleme(metin){
    yasakliKarakterler = ["<",">","/","|","`","!","*","%","#","@","^","$"]
    yeniMetin = ""

    for (i = 0; i<metin.length; i++){
        if(!yasakliKarakterler.includes(metin[i])){
            
            yeniMetin += metin[i]
            
        }else{
            console.log("evet icinde yasakli karakter var")
            
        }
    }//console.log(yeniMetin)
    return yeniMetin
}


function yeniLiToDo(todoText){
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = todoText
    const a = document.createElement("a");          // Silme butonu icin anchor tagi
    a.href = "#";
    a.className = "delete-item";
    a.innerHTML = '<i class="fa fa-remove"></i>';   // Font Awesome ikonunu ekle

    li.appendChild(a); 
    liDOM.appendChild(li); 

    inputDOM.value = "";                            // ekleme islemi yapildiktan sonra yukaridaki input kisminin tekrar bos olmasini saglar 
    
}

function toDoSilme(e) {
    if (e.target.className === "fa fa-remove") {
        const li = e.target.parentElement.parentElement; // Silinecek li öğesi
        const todoText = li.firstChild.textContent;     // li icindeki metin

        // li öğesini kaldır
        li.remove();
        console.log("ToDo Silindi");

        
        const index = toDoArray.indexOf(todoText);          // toDoArray iceririsinde todoText yoksa -1 donecek varsa listenin kacinci index'indeyse onu donecektir!!!
        if (index !== -1) {
            toDoArray.splice(index, 1);                     // eslesen oge bulunduysa sil
        }
          
       if (toDoArray.length === 0) {
        localStorage.clear()         // local storage'dan sil
        } else {
        localStorage.setItem("anahtar", JSON.stringify(toDoArray));             // guncellenmis toDoArray'i localStorage'a kaydet
        }
    }
}


function localStorageEkleme(toDo){
    toDoArray.push(toDo);               // toDoArray'e ekle
    localStorage.setItem("anahtar", JSON.stringify(toDoArray));
   
}


function sayfaYuklendigindeLocalStorageGetir(){
    toDoArray.forEach(function(item){
        yeniLiToDo(item)
    })
}


function localdenVeListedenSilme(){
    if(liDOM.children.length > 0){                     // liDOM icerisinde herhangi bir li elemani var mi kontrol ettik
        localStorage.clear();
        while (liDOM.firstChild){                      // liDOM icerisinde ilk cocuk (li) oldugu surece dongu devam eder
            liDOM.removeChild(liDOM.firstChild);       // liDOM icerisinden ilk cocuk (li) sil 
        }
        genelAlertMesajlari("Silme Islemi Basariyla Gerceklesti :)","success",liDOM);
    }else{
        console.log("Liste zaten boş"); 
        genelAlertMesajlari("Silme Islemi Gerceklesmedi :(","danger",liDOM);
    }
}



function genelAlertMesajlari(message, type, container) {            // mesaj , alert'in type'i ve hangi Dom yapisinda oldugu parametlerini alir
    const messageDiv = document.createElement("div");
    messageDiv.className = `alert alert-${type} mt-3`;
    messageDiv.role = "alert";
    messageDiv.textContent = message;

    container.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 2500);
}
