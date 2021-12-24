(function(){
    const todayHTML = document.querySelector('#today');
    const textHTML = document.querySelector('#text');
    const modalAdd = document.querySelector('#modalAdd');
    const modalEdit = document.querySelector('#modalEdit');
    const nameHTML = document.querySelector('#name');
    const dayHTML = document.querySelector('#day');
    const monthHTML = document.querySelector('#month');
    const yearHTML = document.querySelector('#year');
    const datesUl = document.querySelector('#dates');
  
    const btnAddDate = document.querySelector('#addDate');
    const btnCloseAdd = document.querySelector('#closeAdd');
    const btnCloseEdit = document.querySelector('#closeEdit');
    const btnSend = document.querySelector('#send');
    const btnEdit = document.querySelector('#editDate');
    const btnToday = document.querySelector('#btnToday');
    
    const container = document.querySelector('#container');
    const upload = document.querySelector('#upload');
   
    /* **Inicio** Modal add/remove/edit uma data comemorativa*/
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
    /* **Fim** odal add/remove adicionar uma data comemorativa*/

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
        
        if(nameHTML.value.length === 0 || dayHTML.value.length === 0 || monthHTML.value.length === 0 || yearHTML.value.length === 0 || upload.value.length === 0){
            alert('[ATENÇÂO] - Preencha todos os campos.')
        } else{
            CommeDate(nameHTML.value, dayHTML.value, monthHTML.value, yearHTML.value,);
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

        const dates = []
        function CommeDate (name, day, month, year, img){
            const CDate = {
                name: name, 
                day: day, 
                month: month, 
                year: year
            }    
            dates.push(CDate);
            return dates;
        }
        
        const segundos = 1000;
        const minutos = segundos*60;
        const horas = minutos*60;
        const dias = horas*24;
        
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
                        faltam: Math.ceil((new Date(dat[i]).getTime() - date.getTime()) / dias),
                        img: result
                    }
                }
                dateInMS.push(MS);
                const li = document.createElement('li');
                const btnSelect = document.createElement('button');
                const btnDelete = document.createElement('button');
                for(let d in dateInMS){
                    li.setAttribute('class', dateInMS[d].name);
                    li.innerHTML = `<p> ${dateInMS[d].name}</p>`
                    datesUl.appendChild(li);
                    btnSelect.setAttribute('class', `${dateInMS[d].name} btn btn-select`);
                    btnDelete.setAttribute('class', `${dateInMS[d].name} btn btn-delete`);
                    btnSelect.innerText = 'Selecionar';
                    btnDelete.innerText = 'Excluir';
                    li.appendChild(btnSelect);
                    li.appendChild(btnDelete);
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
                el.parentElement.remove()
                modalEdit.classList.remove('show');
            }
        })
        
        function clearUp(){
            nameHTML.value = ''
            dayHTML.value = ''
            monthHTML.value = ''
            yearHTML.value = ''
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