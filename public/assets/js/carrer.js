let carrerRows = document.getElementById("carrers").children[1].children.length;

function limpiar(event){
  event.preventDefault();
  document.getElementById("carrerId").value="";
  document.getElementById("name").value="";
  document.getElementById("cardTitle").innerHTML = "Nueva Carrera";
}

function agregar(event){
    event.preventDefault();

    let name = document.getElementById("name").value;
    let carrersTable = document.getElementById("carrers");
    let carrerId = document.getElementById("carrerId").value;

    if(carrerId==""){
      let tr = document.createElement("TR");
      let td1 = document.createElement("TD");
      let td2 = document.createElement("TD");
      let td3 = document.createElement("TD");

      carrerRows = carrerRows + 1;
      td1.innerHTML = carrerRows;
      td2.innerHTML = name;

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);

      console.log(tr);

      carrersTable.children[1].appendChild(tr);
    }else{
      let tbody = carrersTable.children[1];

      for (let tr of tbody.children) {
        console.log("1 ++++++++++++++++++++")
        console.log(typeof tr.children[0].innerHTML.trim())
        console.log(typeof carrerId)
        if(tr.children[0].innerHTML.trim() == carrerId){
          tr.children[1].innerHTML = name;
          document.getElementById("carrerId").value="";
          document.getElementById("name").value="";
          document.getElementById("cardTitle").innerHTML = "Nueva Carrera";
        }
      }
    }
}

function eliminar(id, event){
    let tr = event.currentTarget.parentElement.parentElement;
    tr.remove();
}

function editar(id, event){
    let tr = event.currentTarget.parentElement.parentElement;
    let idRow = tr.children[0].innerHTML;
    let name = tr.children[1].innerHTML;

    document.getElementById("cardTitle").innerHTML = "Editar Carrera";

    document.getElementById("name").value = name.trim();
    document.getElementById("carrerId").value = id;
}