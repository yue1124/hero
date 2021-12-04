enable_width_control()
enable_widget_fold_control()

function enable_width_control() {
    let controlers = document.getElementsByClassName("width-control");
    for (let controler of controlers) {
        let parent_elm = controler.parentElement;
        controler.onmousehover
        controler.onmousedown = function(e) {
            let [start_x, start_width] = [e.clientX, parent_elm.offsetWidth];
            let min_width = parseInt(parent_elm.style.minWidth) || 160;
            let max_width = parseInt(parent_elm.style.maxWidth) || 640;

            let original_backgroundColor = controler.style.backgroundColor;
            controler.style.backgroundColor = window.getComputedStyle(controler, ":hover").backgroundColor;
            document.documentElement.style.userSelect = 'none';
            document.onmousemove=function(e) {
                let new_x = e.clientX;
                let new_offsetWidth = new_x - start_x + start_width;
                if (new_offsetWidth > max_width) {
                    new_offsetWidth = max_width;
                } else if (new_offsetWidth < min_width) {
                    new_offsetWidth = min_width;
                }

                parent_elm.style.width = new_offsetWidth + 'px';
            };

            document.onmouseup=function(){
                controler.style.backgroundColor = original_backgroundColor;
                document.documentElement.style.userSelect = 'auto';
                document.onmousemove=null;
                document.onmouseup=null;
            };
        }
    }
}

function enable_widget_fold_control() {
    let controlers = document.getElementsByClassName("widget-fold-control");

    for (let controler of controlers ) {
        let widget_header_elm = controler.parentElement;
        let widget_body_elm = widget_header_elm.nextElementSibling;

        let widget_body_height = widget_body_elm.clientHeight;
        let widget_body_width = widget_body_elm.clientWidth;
        widget_body_elm.style.height = widget_body_height + 'px';
        
        widget_header_elm.onclick = function(e) {
            if(widget_body_elm.style.height === '0px'){
                controler.style.transform = 'rotate(0deg)';
                widget_body_elm.style.height = widget_body_height + 'px';
            } else {
                controler.style.transform = 'rotate(-90deg)';
                widget_body_height = widget_body_elm.clientHeight;
                widget_body_elm.style.height = '0px';
            }
        }

        new ResizeObserver(entries => {
            if(entries[0].contentRect.width !== widget_body_width && widget_body_elm.style.height !== '0px'){
                widget_body_elm.style.height = '';
                
                if(widget_body_elm.clientHeight === 0){
                    widget_body_elm.style.height = widget_body_height + 'px';
                    return
                }
                widget_body_height = widget_body_elm.clientHeight;
                widget_body_elm.style.height = widget_body_height + 'px';
                widget_body_width = entries[0].contentRect.width;
            }
        }).observe(widget_body_elm);
    }
}


enable_dark_toggle()
enable_layout_toggle()

function enable_dark_toggle() {
    let toggler_elm = document.getElementById("toggler-dark");
    let dark = localStorage.getItem('hero-dark');
    if (dark === 'true' && !document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.toggle('dark');
        toggler_elm.firstElementChild.classList.toggle('icon-Daytimemode-fill');
        toggler_elm.firstElementChild.classList.toggle('icon-Daytimemode');
    } else if (dark === null) {
        localStorage.setItem('hero-dark', 'false');
    }
    toggler_elm.onclick = function (e) {
        document.documentElement.classList.toggle('dark');
        toggler_elm.firstElementChild.classList.toggle('icon-Daytimemode-fill');
        toggler_elm.firstElementChild.classList.toggle('icon-Daytimemode');
        if (localStorage.getItem('hero-dark') === 'true') {
            localStorage.setItem('hero-dark', 'false');
        } else {
            localStorage.setItem('hero-dark', 'true');
        }
    }
}

function enable_layout_toggle() {
    let toggler_elm = document.getElementById("toggler-layout");
    let layout = localStorage.getItem('hero-layout');
    if (layout === 'reading' && !document.documentElement.classList.contains('layout-reading')) {
        document.documentElement.classList.toggle('layout-reading')
    } else if (layout === null) {
        localStorage.setItem('hero-layout', 'default');
    }
    toggler_elm.onclick = function (e) {
        document.documentElement.classList.toggle('layout-reading');
        if (localStorage.getItem('hero-layout') === 'reading') {
            localStorage.setItem('hero-layout', 'default');
        } else {
            localStorage.setItem('hero-layout', 'reading');
        }
    }
}

enable_search()

var fuse = null;
function enable_search() {
    let search_input_elm = document.getElementById("search-input");
    let search_result_elm = document.getElementById("search-result");
    let search_mask_elm = document.getElementById("search-result-mask");
    let search_content_elm = document.getElementById("search-result-content");
    let previous_search_value = null;
    
    loadSearch()

    search_mask_elm.onclick = function(e) {
        search_result_elm.classList.remove("active");
    }

    search_input_elm.onfocus = function(e) {
        search_result_elm.classList.add("active");
    }

    search_input_elm.onkeyup = function(e) {
        if (!e.isComposing && e.key === "Enter") {
            let search_input_value = search_input_elm.value.trim();
            if(previous_search_value !== search_input_value) {
                // do search
                executeSearch(search_input_value, search_content_elm);
                previous_search_value = search_input_value;
            }
        }
    }
}

function executeSearch(query, result_elm) {
    let results_html = '';
    if (fuse === null){
        results_html = '<span>搜索工具暂不可用，请稍后重试。</span>'
    }else {
        let results = fuse.search(query);
        if(results.length === 0) {
            results_html = '<span>无匹配结果</span>'
        } else {
            for(let item in results.slice(0, 7)){
                let result = results[item].item;

                let tags_html = '';
                for(let tag in result.tags){
                    tags_html = tags_html + `<span class="entry-tag">${result.tags[tag]}</span>`
                }
                results_html = results_html + `
                <div class='result-entry flex-single-col'>
                    <a href="${result.permalink}" class="entry-title">${result.title}</a>
                    <span class="entry-summary">${result.summary}</span>
                    <span class="entry-tags">
                        ${tags_html}
                    </span>
                </div>
                `
            }
        }
    }
    // build html
    result_elm.innerHTML = results_html;
}

function loadSearch() {
    fetchJSONFile('/index.json', function(data){
        var options = { // fuse.js options; check fuse.js website for details
            shouldSort: true,
            location: 0,
            distance: 100,
            threshold: 0.25,
            minMatchCharLength: 1,
            keys: [
                'title',
                'summary'
            ]
        };
        fuse = new Fuse(data, options);
    })
}

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                // console.log(data)
                if (callback) callback(data);
            } else {
                // console.log(httpRequest)
            }
        } else {
            // console.log(httpRequest)
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}