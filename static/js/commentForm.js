document.querySelector("#newCommentButton").addEventListener("click", (e) => {
    e.preventDefault()
    axios.post('/api/comments', document.querySelector("#newCommentForm"), {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        window.location.reload()
    })
})