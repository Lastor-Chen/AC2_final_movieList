/* global axios */

// /////////////////////
// 宣告
// /////////////////////
const HOST_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = 'api/v1/movies'
const POSTER_URL = HOST_URL + 'posters/'
const moviesRequest = axios.create({
  baseURL: HOST_URL
})

// /////////////////////
const tagMap = {
  "1": "Action",
  "2": "Adventure",
  "3": "Animation",
  "4": "Comedy",
  "5": "Crime",
  "6": "Documentary",
  "7": "Drama",
  "8": "Family",
  "9": "Fantasy",
  "10": "History",
  "11": "Horror",
  "12": "Music",
  "13": "Mystery",
  "14": "Romance",
  "15": "Science Fiction",
  "16": "TV Movie",
  "17": "Thriller",
  "18": "War",
  "19": "Western"
}
const movieData = []

// /////////////////////
function displayTagList(obj) {
  let html = ''
  for (const index in obj) {
      html += `
        <li class="nav-item mb-2">
          <button class="mr-2 btn btn-info" type="button" data-tag="${index}">#${obj[index]}</button>
          <button class="close" type="button" hidden>&times;</button>
        </li>
      `
  }

  $('#tag-list').html(html)
}

function displayMovie(arr) {
  let html = ''

  arr.forEach(movie => {
    // 製作tags html
    let tagHtml = ''
    const tags = movie.genres
    tags.forEach(index => {
      tagHtml += `
        <button class="tag" data-movie-tag="${index}">#${tagMap[index]}</button>
      `
    })

    // 製作movie card html
    html += `
      <div class="col-6 col-lg-4 col-xl-3">
        <div class="card">
          <img class="card-img-top " src="${POSTER_URL}${movie.image}" alt="Movie Image">
          <div class="card-body px-2">
            <h6 class="card-title">${movie.title}</h6>
            <div class="movie-tags">
              ${tagHtml}
            </div>
          </div>
        </div>
      </div>
    `
  })
  
  $('#data-panel').html(html)
}

function displayCount() {
  const count = $('#data-panel').children().length
  $('#page-title').attr('data-count', count)
  
  return count
}

function movieFilter(num) {
  return movieData.filter(movie => movie.genres.includes(num))
}

function displayTarget(tagNum) {
  const targetData = movieFilter(tagNum)
  displayMovie(targetData)

  // 製作 { "1": "Name" } 形式的資料給 displayTagList() 使用
  const targetTag = {}
  targetTag[tagNum] = tagMap[tagNum]
  displayTagList(targetTag)

  // 顯示隱藏的 close btn
  $('[data-tag]').next().attr('hidden', false)

  // 無資料, 顯示提示
  if (!displayCount()) {
    $('#data-panel').html(`
        <p class="col">Sorry. No items match the tag<p>
      `)
  }
}

// /////////////////////
// 執行序
// /////////////////////

displayTagList(tagMap)

moviesRequest.get(INDEX_URL)
  .then(res => {
    movieData.push(...res.data.results)
    displayMovie(movieData)
    displayCount()
  })

$('#tag-list').click(e => {
  if (e.target.matches('[data-tag]')) {
    const tagNum = +$(e.target).attr('data-tag')
    displayTarget(tagNum)
  }

  if (e.target.matches('.close')) {
    displayMovie(movieData)
    displayTagList(tagMap)
    displayCount()
  }
})

$('#data-panel').click(e => {
  if (e.target.matches('.tag')) {
    const tagNum = +$(e.target).attr('data-movie-tag')
    displayTarget(tagNum)
  }
})