const title = document.querySelector('#title')
const color = document.querySelector('#color')
const list = document.querySelector('#list')
const play = document.querySelector('#play')
const message = document.querySelector('#message')
const results = document.querySelector('#results')
const difficulty = document.querySelector('#difficulty')
const changeDifficulty = document.querySelector('#changeDifficulty')

let DIFFICULTY_LEVEL = 'easy'
let MAX_COLORS = 3
let COUNT = 1
const WRONG_ANSWER = 'Wrong! :( Keep trying!'
const CORRECT_ANSWER = 'Correct! :)'
let TIME_OUT_WRONG_ANSWER

const randomRgb = () => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return `${r},${g},${b}`
}

const onMouseOver = (element) => {
    element.style.opacity = 0.8
}

const onMouseOut = (element) => {
    element.style.opacity = 1
}

const timeoutWrongAnswer = () => {
    TIME_OUT_WRONG_ANSWER = setTimeout(() => {
        message.innerText = ''
    }, 1500)
}

const getNewColor = async () => {
    //Get color from api
    let image = ''
    const url = `https://www.thecolorapi.com/id?rgb=${randomRgb()}`
    await fetch(url)
        .then(response => response.json())
        .then((data) => {
            image = data.image.bare
        })
    return image
}

const showColors = () => {
    //show list with colors AND color picked
    list.style.display = 'block'
    color.style.display = 'block'

    //clear message
    message.innerText = ''
}

const extraColor = async (position) => {
    //get new color from API
    const newColorImgUrl = await getNewColor()

    //Create button
    let button = document.createElement('button')
    button.className = 'btn'
    button.id = `btn-${position}`

    //Create img
    let img = document.createElement('img')
    img.id = `img-${position}`
    img.src = newColorImgUrl

    //Onclick
    button.onclick = () => {
        //ClearTimeOut
        clearTimeout(TIME_OUT_WRONG_ANSWER)

        //add +1 to count
        COUNT += 1

        //add disabled attribute
        button.disabled = true

        //Change opacity
        button.style.opacity = 0.1

        //Change message for wrong answer and set timeout for it
        message.innerText = WRONG_ANSWER
        timeoutWrongAnswer()
    }

    //Add breakLine if needed
    if ((position - 1) % 3 === 0) {
        addBreakLine()
    }

    //Append elements
    button.append(img)
    list.appendChild(button)

    //show list if it is last color
    if (position === MAX_COLORS) {
        showColors()
    }
}

const clearExtraColors = (correct) => {
    for (let i=0; i < MAX_COLORS; i++) {
        if (i + 1 !== correct) {
            const btn = document.querySelector(`#btn-${i + 1}`)
            btn.disabled = true
            btn.style.opacity = 0.1
        }
    }
}

const gameCleared = () => {
    message.innerText = CORRECT_ANSWER
    results.innerText = `You needed ${COUNT} attempt/s to guess it.`
    play.innerText = 'Play again!'
    play.disabled = false
    results.style.display = 'block'
    play.style.display = 'block'
    changeDifficulty.style.display = 'block'
    changeDifficulty.disabled = false
}

const changeDiff = () => {
    //first, restore data
    list.innerHTML = ''
    color.innerText = ''
    message.innerText = 'You will be getting multiple colors depending selected difficulty, where only 1 color will be the correct answer.'
    title.innerText = 'Get a random RGB color and try to guess it!'
    results.innerText = ''
    COUNT = 1

    //hide / display elements
    difficulty.removeAttribute('style')
    results.style.display = 'none'
    changeDifficulty.style.display = 'none'
    changeDifficulty.disabled = true
}

const getCorrectColor = async (position) => {
    //Get color from api
    const url = `https://www.thecolorapi.com/id?rgb=${randomRgb()}`
    await fetch(url)
        .then(response => response.json())
        .then((data) => {
            //set color value
            color.innerText = data.rgb.value

            //Create button
            let button = document.createElement('button')
            button.className = 'btn'
            button.id = `btn-${position}`

            //create img with correct color
            let img = document.createElement('img')
            img.src = data.image.bare

            //onclick
            button.onclick = function () {
                console.log('CORRECT!')
                clearTimeout(TIME_OUT_WRONG_ANSWER)
                button.disabled = true
                clearExtraColors(position)
                gameCleared()
            }

            //Add breakLine if needed
            if ((position - 1) % 3 === 0) {
                addBreakLine()
            }
            
            //Append elements
            button.append(img)
            list.appendChild(button)

            //show list if it is last color
            if (position === MAX_COLORS) {
                showColors()
            }
        })
}

const addBreakLine = () => {
    let breakLine = document.createElement('div')
    breakLine.classList.add('break')
    list.appendChild(breakLine)
}

const setDifficulty = (element, difficulty) => {

    //show 'Lets Play' button
    play.style.display = 'block'

    //set DIFFICULTY_LEVEL
    DIFFICULTY_LEVEL = difficulty

    //change style of selected one
    element.classList.add('bigButton')

    //add disabled
    element.disabled = true

    //restore default style to rest + set MAX_COLORS
    if (difficulty === 'easy') {
        const medium = document.querySelector(`#medium`)
        medium.classList.remove("bigButton")
        medium.disabled = false

        const hard = document.querySelector(`#hard`)
        hard.classList.remove("bigButton")
        hard.disabled = false

        MAX_COLORS = 3
    } else if (difficulty === 'medium') {
        const easy = document.querySelector(`#easy`)
        easy.classList.remove("bigButton")
        easy.disabled = false

        const hard = document.querySelector(`#hard`)
        hard.classList.remove("bigButton")
        hard.disabled = false

        MAX_COLORS = 6
    } else {
        const easy = document.querySelector(`#easy`)
        easy.classList.remove("bigButton")
        easy.disabled = false

        const medium = document.querySelector(`#medium`)
        medium.classList.remove("bigButton")
        medium.disabled = false

        MAX_COLORS = 9
    }
}

const letsPlay = async () => {
    //first, restore data
    list.innerHTML = ''
    color.innerText = ''
    message.innerText = 'Loading colors... please wait'
    results.innerText = ''
    title.innerText = 'Can you guess it?'
    COUNT = 1

    //hide list until last color is get AND color picked AND difficulty
    list.style.display = 'none'
    results.style.display = 'none'
    color.style.display = 'none'
    difficulty.style.display = 'none'

    //set "Play!" button disabled and hide it
    play.disabled = true
    play.style.display = 'none'

    //set "Change difficulty" button disabled and hide it
    changeDifficulty.disabled = true
    changeDifficulty.style.display = 'none'

    //Generate random correct answer position
    const correctPosition = Math.floor(Math.random() * MAX_COLORS)

    //Show colors
    for (let i = 0; i < MAX_COLORS; i++) {
        if (i === correctPosition) {
            await getCorrectColor(i + 1)
        } else {
            await extraColor(i + 1)
        }
    }
}

