import * as params from '@params';

const resultContainer = document.getElementById("entry-group")
const resultInfoDom = document.getElementById("result-info")
const searchInputDom = document.getElementById("search-input")

createEntryDom = (permalink, title, size, matchedKey) => {
    const entry = document.createElement('section')
    entry.classList.add("entry", "group-item", "group-row", "single-row")

    const entry_name = document.createElement('span')
    entry_name.classList.add("group-item", "entry-name")
    entry_name.innerHTML = `<a href="${permalink}"><i class="fas fa-file-alt"></i> ${title}</a>`

    const entry_key = document.createElement('span')
    entry_key.classList.add("group-item", "entry-key")
    entry_key.innerHTML = `${matchedKey}`

    const entry_type = document.createElement('span')
    entry_type.classList.add("group-item", "entry-type")
    entry_type.innerHTML = `Post`

    const entry_size = document.createElement('span')
    entry_size.classList.add("group-item", "entry-size")
    entry_size.innerHTML = `${size}`

    entry.append(entry_name, entry_key, entry_type, entry_size)
    return entry
}

class SimpleSearch {
    constructor(data, options) {
        this.options = options
        this.data = data
    }

    search(searchValue) {
        var results = []
        const data = this.data
        for(let idx = 0; idx < data.length; ++idx){
            const item = data[idx];
            for(const key in item){
                if(item[key] && item[key].includes(searchValue)){
                    results.push({
                        item,
                        refIndex: idx,
                        matchedKey: key
                    })
                    break
                }
            }
        }

        return results
    }
}

startSearch = (searchHelper, searchValue) => {
    const results = searchHelper.search(searchValue.trim())
    // console.log(results)
    if(results.length > 0){
        for(let item in results) {
            const permalink = results[item].item.permalink
            const title = results[item].item.title
            const size = results[item].item.content.length
            const matchedKey = results[item].matchedKey
            const entry = createEntryDom(permalink, title, size, matchedKey)

            resultContainer.appendChild(entry)
        }
    }
    resultInfoDom.innerHTML = `<span>一共搜索到${results.length}条文档</span>`
}

buildSearch = (searchValue) => {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 200){
                var data = JSON.parse(xhr.responseText);
                if (data) {
                    var options = params.searchOpts || {
                        distance: 100,
                        threshold: 0.4,
                        ignoreLocation: true,
                        keys: [
                            'title',
                            'permalink',
                            'author',
                            'content'
                        ]
                    };
                    startSearch(new SimpleSearch(data, options), searchValue)
                }
            } else {
                console.log(xhr.responseText)
            }
        }
    };
    xhr.open('GET', "../index.json");
    xhr.send();
}

executeSearch = () => {
    const [key, value] = [location.search.substring(0, 3), location.search.substring(3)]
    const validValue = unescape(value).trim()
    if(key === '?q=' && validValue){
        // console.log(value)
        searchInputDom.value = validValue
        buildSearch(validValue)
    } else {
        resultInfoDom.innerHTML = `<span>你输入了空格，我不会进行搜索的</span>`
    }
}

executeSearch();