const searchInputDom = document.getElementById("search-input")

searchInputDom.onkeyup = (e) => {
    if(e.keyCode === 13 && searchInputDom.value) {
        window.location.href = `${window.location.origin}/search?q=${escape(searchInputDom.value)}`
    }
}