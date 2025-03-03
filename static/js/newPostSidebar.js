document.querySelector("#newPostButton").addEventListener("click", (e) => {
    e.preventDefault()
    axios.post('/api/posts', document.querySelector("#newPostForm"), {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        window.location.replace("/posts/" + res.data.id)
    })
})