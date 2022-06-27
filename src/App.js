import React from 'react'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
const { log } = console

function App() {
  const [wikiData, setWikiData] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isShow, setIsShow] = useState(false)
  const ref = React.useRef('')

  // log(inputValue, wikiData)
  useEffect(() => {
    toggleSearchBtnColor()
  }, [inputValue])

  const toggleSearchBtnColor = () => {
    const searchBtn = ref.current
    // const searchBtn =document.querySelector('.search-btn')
    if (!trimInputValue().length) {
      searchBtn.style.backgroundColor = 'transparent'
      searchBtn.style.color = 'black'
    } else {
      searchBtn.style.backgroundColor = 'rgb(70, 65, 221)'
      searchBtn.style.color = 'white'
    }
  }

  const fetchData = async () => {
    try {
      // log(inputValue)
      const API = `https://en.wikipedia.org/w/api.php?&format=json&action=query&generator=search&gsrlimit=20&prop=pageimages|extracts&exchars=${getMaxChars()}&exintro&explaintext&exlimit=max&origin=*&gsrsearch=${trimInputValue()}`
      // add origin=*
      const res = await fetch(API)
      const data = await res.json()
      // log(data)
      // log(results)
      setWikiData(getSearchResults(data))
    } catch (err) {
      console.error(err)
    }
  }

  const trimInputValue = () => {
    // Remove space at both ends. two or more spaces into one.
    const value = inputValue.trim()
    const regEx = /\s{2,}/gi
    const newValue = value.replace(regEx, ' ')
    return newValue
  }

  const getMaxChars = () => {
    const width = window.innerWidth
    let maxChars
    if (width <= 576) {
      maxChars = 100
    } else {
      maxChars = 200
    }
    return maxChars
  }

  const getSearchResults = (rawData) => {
    const resultArray = []
    if (rawData.hasOwnProperty('query')) {
      const results = rawData.query.pages
      Object.keys(results).forEach((key) => {
        const { title, extract, pageid, thumbnail } = results[key]
        const img = thumbnail ? thumbnail.source : null
        const item = {
          id: pageid,
          title: title,
          desc: extract,
          img: img,
        }
        resultArray.push(item)
      })
    }

    return resultArray
  }

  const handleChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setIsShow(true)
    if (!value.length) {
      setIsShow(false)
    }
  }

  const handleMouseOver = () => {
    const searchBtn = ref.current
    searchBtn.style.backgroundColor = 'rgb(70, 65, 221)'
    searchBtn.style.color = 'white'
  }
  const handleMouseLeave = () => {
    if (!trimInputValue().length) {
      const searchBtn = ref.current
      searchBtn.style.backgroundColor = 'transparent'
      searchBtn.style.color = 'black'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (trimInputValue() === '') return
    fetchData()
  }
  const handleClick = (e) => {
    setInputValue('')
    setIsShow(false)
  }

  const alertMessage =
    wikiData &&
    (wikiData.length ? (
      <p className='result-length'>Displaying {wikiData.length} results.</p>
    ) : (
      <p className='result-length'>Sorry, no result. please try again.</p>
    ))

  const resultElements =
    wikiData &&
    wikiData.map((item, index) => {
      const { id, desc, title, img } = item
      const pageURL = `https://en.wikipedia.org/?curid=${id}`
      return (
        <article key={index}>
          <h3 className='title'>
            <a href={pageURL} target='_blank' rel='noreferrer'>
              {title}
            </a>
          </h3>
          <div className='info'>
            {img && <img src={img} alt={title} className='thumbnail' />}
            <p className='desc'>{desc}</p>
          </div>
        </article>
      )
    })
  const colors = [
    'blue',
    'red',
    'orange',
    'blue',
    'green',
    'red',
    'blue',
    'red',
    'orange',
    'blue',
    'green',
    'red',
    'blue',
    'red',
    'orange',
    'blue',
    'green',
    'red',
  ]
  const wikipediaSearcher = 'WikipediaSearcher!'.split('').map((ele, index) => {
    return (
      <span
        key={index}
        className={ele === '!' ? `${colors[index]} exclamation` : colors[index]}
      >
        {ele}
      </span>
    )
  })

  return (
    <main>
      <section>
        <h1 className='headline'>{wikipediaSearcher}</h1>
        <a
          className='random'
          href='https://en.wikipedia.org/wiki/Special:Random'
        >
          click here for random articles
        </a>
        <form action='' onSubmit={handleSubmit}>
          <label htmlFor='search' className='offscreen'>
            Search Wikipedia
          </label>
          <input
            type='text'
            id='search'
            name='search'
            onChange={handleChange}
            value={inputValue}
          />
          {isShow && (
            <button
              className='btn clear-btn'
              type='reset'
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faTimes} size='2x' />
            </button>
          )}
          <button
            type='submit'
            className='btn search-btn'
            ref={ref}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
          >
            <FontAwesomeIcon icon={faSearch} size='2x' />
          </button>
        </form>
      </section>
      {alertMessage}
      <section className='result'>{resultElements}</section>
    </main>
  )
}

export default App
