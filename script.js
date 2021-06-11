const title = document.querySelector('#title')
const color = document.querySelector('#color')
const list = document.querySelector('#list')
const play = document.querySelector('#play')
const message = document.querySelector('#message')
const results = document.querySelector('#results')
const difficulty = document.querySelector('#difficulty')
const changeDifficulty = document.querySelector('#changeDifficulty')
const easy = document.querySelector(`#easy`)
const medium = document.querySelector(`#medium`)
const hard = document.querySelector(`#hard`)
const modal = document.querySelector('#modal')
const missedColors = document.querySelector('#missed-colors')
const closeModal = document.querySelector('.close-modal')
const totalPoints = document.querySelector('#points')

let DIFFICULTY_LEVEL = 'easy'
let MAX_COLORS = 3
let COUNT = 1
let TOTAL_POINTS = 0
let CORRECT_POSITION = 0
const WRONG_ANSWER = 'Wrong! :( Keep trying!'
const CORRECT_ANSWER = 'Correct! :)'
let TIME_OUT_WRONG_ANSWER
let EXTRA_COLORS = []
let DELETED_COLORS = []

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

const showColors = () => {
    //show list with colors AND color picked
    list.style.display = 'block'
    color.style.display = 'block'

    //clear message
    message.innerText = ''
}

const wrongColorsList = () => {
    //list all wrong colors in modal
    if (DELETED_COLORS.length > 0) {
        DELETED_COLORS.map(deletedColor => {
            let p = document.createElement('p')
            p.innerHTML = `#${deletedColor.position}: <span style="color: ${deletedColor.color};">${deletedColor.color}</span>`
            missedColors.append(p)
        })
    } else {
        let p = document.createElement('p')
        p.innerHTML = 'None! :) Excellent work!'
        missedColors.append(p)
    }

    //show modal
    modal.style.display = 'block'
}

const extraColor = async (position) => {
    //get new random Color
    const color = randomRgb()

    //Add it to EXTRA_COLORS
    EXTRA_COLORS.push(`rgb(${color})`)

    //Create button
    let button = document.createElement('button')
    button.className = 'btn'
    button.id = `btn-${position}`
    
    //Add styles
    button.style.backgroundColor = `rgb(${color})`
    button.style.borderColor = '#222'

    //Add innerText
    button.innerText = position

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

        //Add to DELETED_COLORS
        DELETED_COLORS.push({color: `rgb(${color})`, position: position})

        //Change message for wrong answer and set timeout for it
        message.innerText = WRONG_ANSWER
        timeoutWrongAnswer()
    }

    //Add breakLine if needed
    if ((position - 1) % 3 === 0) {
        addBreakLine()
    }

    //Append elements
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

const setTotalPoints = () => {
    TOTAL_POINTS += MAX_COLORS - DELETED_COLORS.length - 1
    totalPoints.innerText = TOTAL_POINTS
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
    setTotalPoints()
    wrongColorsList()
}

const changeDiff = () => {
    //first, restore data
    list.innerHTML = ''
    color.innerText = ''
    message.innerText = 'You will be getting multiple colors depending selected difficulty, where only 1 color will be the correct answer.'
    title.innerText = 'Get a random RGB color and try to guess it!'
    results.innerText = ''
    COUNT = 1
    DELETED_COLORS = []
    EXTRA_COLORS = []
    CORRECT_POSITION = 0
    missedColors.innerHTML = ''

    //hide / display elements
    difficulty.removeAttribute('style')
    results.style.display = 'none'
    changeDifficulty.style.display = 'none'
    changeDifficulty.disabled = true

    //hide modal
    modal.style.display = 'none'

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

            //Add styles
            button.style.backgroundColor = data.hex.value
            button.style.border = '#222'

            //Add innerText
            button.innerText = position

            //onclick
            button.onclick = function () {
                // console.log('CORRECT!')
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
            list.appendChild(button)

            //show list AND 'Deleted One!' button if it is last color
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

const restoreDifficulty = (element) => {
    element.classList.remove('bigButton')
    element.disabled = false
}

const setDifficulty = (element, difficulty) => {
    //show 'Lets Play' button
    play.style.display = 'block'
    play.disabled = false

    //set DIFFICULTY_LEVEL
    DIFFICULTY_LEVEL = difficulty

    //change style of selected one
    element.classList.add('bigButton')

    //add disabled
    element.disabled = true

    //restore default style to rest + set MAX_COLORS
    if (difficulty === 'easy') {
        restoreDifficulty(medium)
        restoreDifficulty(hard)
        MAX_COLORS = 3
    } else if (difficulty === 'medium') {
        restoreDifficulty(easy)
        restoreDifficulty(hard)
        MAX_COLORS = 6
    } else {
        restoreDifficulty(easy)
        restoreDifficulty(medium)
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
    DELETED_COLORS = []
    EXTRA_COLORS = []
    CORRECT_POSITION = 0
    missedColors.innerHTML = ''

    //hide list until last color is get AND color picked AND difficulty
    list.style.display = 'none'
    results.style.display = 'none'
    color.style.display = 'none'
    difficulty.style.display = 'none'

    //hide modal
    modal.style.display = 'none'

    //set close modal 'X' function
    closeModal.onclick = () => modal.style.display = 'none'

    //set "Play!" button disabled and hide it
    play.disabled = true
    play.style.display = 'none'

    //set "Change difficulty" button disabled and hide it
    changeDifficulty.disabled = true
    changeDifficulty.style.display = 'none'

    //Generate random correct answer position
    CORRECT_POSITION = Math.floor(Math.random() * MAX_COLORS)

    //Show colors
    for (let i=0; i < MAX_COLORS; i++) {
        if (i === CORRECT_POSITION) {
            await getCorrectColor(i + 1)
        } else {
            await extraColor(i + 1)
        }
    }
}
