
const loginForm = document.querySelector('#login')


loginForm.addEventListener('submit', e =>{
    e.preventDefault()

    const data = new FormData(loginForm)
    
    const obj ={}
    data.forEach((value, key) => obj[key] = value )
    fetch('/api/sessions/login',{
        method:'POST',
        body: JSON.stringify(obj),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(result =>{
        if(result.status === 200){
            window.location.replace('/users/')
        }
    })
    
    
})