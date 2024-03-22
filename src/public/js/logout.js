const logOut = document.querySelector('#logout-button')


logOut.addEventListener('click', ()=>{
    fetch('/api/sessions/logout' ,{
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json'
    }
}).then(result =>{
    if(result.status === 200){
        window.location.replace('/users/login')
    }
})
})