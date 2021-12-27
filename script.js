(function(){
    const todayHTML = document.querySelector('#today');
    const textHTML = document.querySelector('#text');
    const modalAdd = document.querySelector('#modalAdd');
    const modalEdit = document.querySelector('#modalEdit');
    const modalListEdit = document.querySelector('#modalListEdit');
    const nameHTML = document.querySelector('#name');
    const datesUl = document.querySelector('#dates');
    const myDateHTML = document.querySelector('#myDate');

    flatpickr("input[type=datetime-local", {});
  
    const btnAddDate = document.querySelector('#addDate');
    const btnCloseAdd = document.querySelector('#closeAdd');
    const btnCloseEdit = document.querySelector('#closeEdit');
    const btnSend = document.querySelector('#send');
    const btnEdit = document.querySelector('#editDate');
    const btnToday = document.querySelector('#btnToday');
    
    const container = document.querySelector('#container');
    let upload = document.querySelector('#upload');
   
    /* **Inicio** Modal add/remove/edit uma data comemorativa*/
    const dates = []

    btnAddDate.addEventListener('click', (e) =>{
        modalAdd.classList.add('show');
    });
    btnEdit.addEventListener('click', (e) =>{
        modalEdit.classList.add('show');
    });
    btnCloseAdd.addEventListener('click', (e) =>{
        modalAdd.classList.remove('show');
        modalEdit.classList.remove('show');
    });
    btnCloseEdit.addEventListener('click', (e) =>{
        modalEdit.classList.remove('show');
    });
    /* **Fim** modal add/remove adicionar uma data comemorativa*/

    const date = new Date();
    const today = {
        day: date.getDate(), 
        month: date.getMonth(), 
        year: date.getFullYear()
    }
    function todayMonth(){
        const monthTxt = ['Janeiro', 'Fevereiro','Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        let todayMonth = monthTxt[today.month]; 
        return `${today.day} de ${todayMonth} de ${today.year}`; 
    }
 
    const dayToday = todayMonth();
    todayHTML.innerHTML = `<p>${dayToday}</p>`;
    
    btnSend.addEventListener('click', (e) =>{
        const todayIf = new Date(`${today.month +1}-${today.day}-${today.year}`);
        const myDate = new Date(myDateHTML.value);
        const todayIfInMs = todayIf.getTime()
        const myDateIfInMs = myDate.getTime()

        if(myDateIfInMs < todayIfInMs){
            alert('[ATENÇÂO] - Sua data já passou ou é hoje! Adicione uma nova data. =)')
        }else if(nameHTML.value.length === 0){
            alert('[ATENÇÂO] - Adicione uma descrição!')
        }else if(myDateHTML.value.length === 0){
            alert('[ATENÇÂO] - Adicione uma data!')
        }else if(upload.value.length === 0){
            alert('[ATENÇÂO] - Adicione uma imagem!')
        }else{
            CommeDate(nameHTML.value, myDate.getDate(), myDate.getMonth(), myDate.getFullYear());
            modalAdd.classList.remove('show');
            getBase64 (upload)
            countAndCreateDate()
            clearUp()
        }

    })

    btnToday.addEventListener('click', (e) =>{
        textHTML.innerHTML = `<h2>Hoje é:</h2>`;
            todayHTML.innerHTML = `<p>${dayToday}</p>`;
            removeImg()
        })

      
        function CommeDate (name, day, month, year){
            const CDate = {
                name: name, 
                day: day+1, 
                month: month+1, 
                year: year
            }    
            dates.push(CDate);
            console.log(dates)
            return dates;
        }
        
        const seconds = 1000;
        const minutes = seconds*60;
        const hours = minutes*60;
        const days = hours*24;
        
        function getBase64(element) {
            var file = element.files[0];
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }
        
        const dateInMS= [];
        function countAndCreateDate(){
            const dat = getNewDate();
            let MS;
            
            getBase64(upload).then(function(result){
                for(let i in dat){
                    MS = {
                        name: dates[i].name,
                        faltam: Math.ceil((new Date(dat[i]).getTime() - date.getTime()) / days),
                        img: result
                    }
                }
                dateInMS.push(MS);
                const li = document.createElement('li');
                const btnSelect = document.createElement('button');
                const btnDelete = document.createElement('button');
                const btnDeleteI = document.createElement('i');
                for(let d in dateInMS){
                    li.setAttribute('class', dateInMS[d].name);
                    li.innerHTML = `<p> ${dateInMS[d].name}</p>`
                    datesUl.appendChild(li);
                    btnSelect.setAttribute('class', `${dateInMS[d].name} btn btn-select `);
                    btnDelete.setAttribute('class', `${dateInMS[d].name} btn btn-delete`);
                    btnDeleteI.setAttribute('class', 'fa fa-trash');
                    btnSelect.innerText = 'Selecionar';
                    li.appendChild(btnSelect);
                    li.appendChild(btnDelete);
                    btnDelete.appendChild(btnDeleteI);
                }
            })
        }
        
        const newDate = []; 
        function getNewDate (){
            let date;
            for(let d of dates){
                date = `${d.month}-${d.day}-${d.year}`;
            }
            newDate.push(date);
            return newDate;
        }
        
        document.addEventListener('click', (e) =>{
            const el = e.target;
            if(el.classList.contains('btn-select')){
                removeImg()
                for(let name of dateInMS){
                    if(el.parentElement.className === name.name){
                        textHTML.innerHTML = `<h2>Faltam:</h2>`;
                        todayHTML.innerHTML = `<p>${name.faltam} para ${name.name}</p>`;
                        modalEdit.classList.remove('show');
                        const img = document.createElement('img');
                        img.setAttribute('class', 'background')
                        img.setAttribute('src', name.img)
                        container.appendChild(img) 
                    }
                }
            }
        })
        
        document.addEventListener('click', (e) =>{
            const el = e.target;
            if(el.classList.contains('btn-delete')){
                const del = confirm('Você irá apagar esta data clicando em Ok.')
                if(del){
                    el.parentElement.remove()
                    modalEdit.classList.remove('show');
                    todayHTML.innerHTML = `<p>${dayToday}</p>`;
                    removeImg()
                }
            }
        })
        
        function clearUp(){
            nameHTML.value = ''
            myDateHTML.value = ''
            upload.value = ''
        }
        
        function removeImg(){
            for(let i of container.children){
                if(i.classList.contains('background')){
                    i.remove()
                }
            }
        }   
})()