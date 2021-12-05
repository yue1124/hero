## hero | A Hugo theme with file explorer style

> **H**ugo **E**xplorer **R**ead**O**nly 

This project mainly wants to build a blog site with file explorer style. I'm not going to make a real file manager, manipulating the markdown files is another staff. That is why I call it _Read Only_. 

### quick start

- step 1

    [install hugo](https://gohugo.io/getting-started/installing/)

- step 2

    create a new site
    ```plain
    hugo new site quickstart
    ```

- step 3
    
    add theme hero
    ```plain
    cd quickstart
    git init
    git submodule add https://github.com/yue1124/hero.git themes/hero
    ```
    then add the theme to the site configuration `config.toml`

    `theme = "hero"`

- step 4

    add some content

    ```plain
    hugo new posts/my-first-post.md
    ```

- step 5

    start the hugo server
    ```plain
    hugo server -D
    ```
    `-D` means drafts enabled

- step 6

    [customize the theme](#customization)

- step 7

    build static pages
    ```plain
    hugo -D
    ```
---

### customization

I divide the space into four parts. And the `widgets` part and `blocks` part is customizable. It means you can decide which widgets (or blocks) can be stacked on which pages. 

![homepage](https://raw.githubusercontent.com/yue1124/hero/main/images/layout.png)

As shown on the home page, `widget 1` and `widget 2` is stacked in `widgets`. And there is only one block in `blocks`. Many basic widgets and blocks have provided, and can be configured in the site configuration.

> Making your own widget or block is also possible. 

**pages**
- `home`, homepage
- `section`, sectionpage
- `single`, singlepage
- `terms`, termspage
- `term`, termpage

**provided widgets**
- `section`, section widget, shows the top-level sections of website
- `welcome`, welcome widget, a welcome message board

**provided blocks**
- `markdown`, markdown block, shows the content of your main markdown file
- `folder`, folder block, shows the sub sections and posts under current section
- `profile`, profile block, shows main infomation of website

**example configuration**

```toml
[params.widgets]
    home = [
        "section",
        "welcome"
    ]
    section = [
        "section"
    ]
    single = [
        "section"
    ]
    term = []
    terms = [
        "section"
    ]

[params.blocks]
    home = [
        "profile"
    ]
    section = [
        "folder"
    ]
    single = [
        "markdown"
    ]
    term = []
    terms = [
    ]

[params.welcome]
    head = '你好呀！^.^'
    body = '这里是Hugo主题hero的样例网站，更多详细信息请查看主题首页。'

[params.profile]
    avatar = '/img/logo.png'
    head = '请随意替换此文本，或者不要'
    [[params.profile.links]]
        url = 'tags'
        text = '标签'
    [[params.profile.links]]
        url = 'categories'
        text = '分类'
```

**iconfont**

I used iconfont as my icon library. And for every top-level sections, you can configure the icon by add `icon` frontmatter in `_index.md` file. If there is no suitable icons in my library, you can create your own icon library and set `iconfont` in site configurations.

```toml
[params]
    iconfont = '//at.alicdn.com/t/font_2881911_o39brzj1llb.css'
```

> copy all the icons in my library to make sure all the used icons is not missing.

---

### Features

- File explorer style
- Customizable and extensible widgets or blocks
- Breadcrumb Navigation
- Dark mode support
- Using iconfont
- Using Hugo's `json` output format for Search In All regular pages
- No implemented markdown theme and toc theme yet
- No suitable for mobile or some devices

### A complete example `config.toml`

```toml
baseURL = 'https://yue1124.github.io/hero/'
defaultContentLanguage = 'zh'
theme = 'hero'
enableEmoji = true

[languages]
    [languages.en]
        title = 'Demo'
        description = 'A demo of theme hero'

    [languages.zh]
        title = '样例'
        description = '关于主题hero的样例网站'

[outputs]
    home = ["HTML", "JSON"]

[params]
    author = 'bigyue'
    iconfont = '//at.alicdn.com/t/font_2881911_o39brzj1llb.css'

[params.widgets]
    home = [
        "section",
        "welcome"
    ]
    section = [
        "section"
    ]
    single = [
        "section"
    ]
    term = []
    terms = [
        "section"
    ]

[params.blocks]
    home = [
        "profile"
    ]
    section = [
        "folder"
    ]
    single = [
        "markdown"
    ]
    term = []
    terms = [
    ]

[params.welcome]
    head = '你好呀！^.^'
    body = '这里是Hugo主题hero的样例网站，更多详细信息请查看主题首页。'

[params.profile]
    avatar = '/img/logo.png'
    head = '请随意替换此文本，或者不要'
    [[params.profile.links]]
        url = 'tags'
        text = '标签'
    [[params.profile.links]]
        url = 'categories'
        text = '分类'
```