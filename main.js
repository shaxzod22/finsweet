const API = `https://newsapi.org/v2/everything?q=business&from=2023-10-16&sortBy=publishedAt&apiKey=aa2924f52be9408abb9f001fb8a20112`
const paginationList = document.querySelector('.info__pagination__list')
let businessList = document.querySelector('.info__list')
let loading = document.querySelector('.loading')
let dataPerPage = 10
let currentPage = 1
let minPage = 1
let maxPage = minPage + 6


async function getData(url) {
    try {
        loading.classList.remove('none')
        let myResponse = await fetch(url, {
            method: 'GET',
        })
        let myData = await myResponse.json()
        return myData
    } catch (error) {
        console.error(error);
    } finally {
        loading.classList.add('none')
    }
}

getData(API).then((data) => {
    renderData(data.articles, businessList)
})


function renderData(array = [], list) {
    list.innerHTML = null
    let allPages = Math.ceil(array.length / dataPerPage)
    let startData = (currentPage - 1) * dataPerPage
    let endData = Math.min(startData + dataPerPage, array.length)

    function renderBtn() {
        paginationList.innerHTML = null

        for (let i = minPage; i <= maxPage; i++) {
            let paginationBtn = document.createElement('button')
            paginationBtn.textContent = i
            paginationBtn.classList = 'info__pagination__btn'
            paginationList.appendChild(paginationBtn)
            if (i == currentPage) {
                paginationBtn.classList.add('info__pagination__btn-active')
            }
            paginationBtn.addEventListener('click', () => {
                window.scrollTo(0, 0)
                currentPage = i
                if (currentPage - 3 > 0) {
                    minPage = currentPage - 3
                } else {
                    minPage = 1
                    maxPage = currentPage + 6
                }
                if (currentPage + 3 <= allPages && currentPage - 3 <= 0) {
                    maxPage = currentPage + 6
                } else if (currentPage + 3 <= allPages) {
                    maxPage = currentPage + 3
                } else {
                    maxPage = allPages
                    minPage = currentPage - 6
                }

                getData(API).then((data) => {
                    renderData(data.articles, businessList)
                })
                renderBtn()
            })
        }
    }


    renderBtn()

    let newArr = array.filter((el) => el.urlToImage && el.title && el.description)

    newArr.slice(startData, endData).forEach((element) => {
        let { urlToImage, title, description } = element
        list.innerHTML += `  <li class="info__item">
        <img src="${urlToImage}" alt="${title}" class="info__img" width="447" height="312">
        
        <div class="info__inner__box">
        <h3 class="info__inner__title">Business</h3>
        
        <h2 class="info__inner__heading">${title}</h2>
        
        <p class="info__inner__text">${description}</p>
        </div>
        </li>`
    })
}