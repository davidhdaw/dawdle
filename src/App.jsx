import { useState, useRef, useEffect } from 'react'
import GuessBox from './Components/GuessBox/GuessBox'
import Key from './Components/GuessBox/Key'
import './App.css'
import {Words} from './words.json'
function App() {

  const correctWord = ['C', 'R', 'O', 'W','D']
  const focusRef = useRef(null);

  const [winner, setWinner] = useState(false)
  const [letterError, setLetterError] = useState(false)
  const [wordError, setWordError] = useState(false)
  const [valueArray, setValueArray] = useState(
  [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]  
    
  );
  const [statusArray, setStatusArray] = useState(
      [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ]   
  );

  const [letterStatusObject, setLetterStatusObject] = useState(
    {
      Q: '',
      W: '',
      E: '',
      R: '',
      T: '',
      Y: '',
      U: '',
      I: '',
      O: '',
      P: '',
      A: '',
      S: '',
      D: '',
      F: '',
      G: '',
      H: '',
      J: '',
      K: '',
      L: '',
      Z: '',
      X: '',
      C: '',
      V: '',
      B: '',
      N: '',
      M: ''
    }
  )



  const [rowPosition, setRowPosition] = useState(0);
  const [boxPosition, setBoxPosition] = useState(0);
  useEffect(() =>{
    focusRef.current.focus()
    if(localStorage.todayWord == 'undefined') {
      localStorage.clear()
      localStorage.setItem('todayWord', JSON.stringify(correctWord))
    } else if (localStorage.todayWord != "undefined") {
      const storedString = localStorage.todayWord
      const todayString = JSON.stringify(correctWord)
      if(storedString != todayString) {
        localStorage.clear()
        localStorage.setItem('todayWord', JSON.stringify(correctWord))
      }
    }

    if(localStorage.winner == 'true') {
      console.log('ugh')
    }
    if(localStorage.statusArray) {
      setWinner(false)
      localStorage.setItem('winner', JSON.stringify('false'))
      var retrievedStatusArray = JSON.parse(localStorage.getItem('statusArray'))
      retrievedStatusArray.forEach((row) => {
        const correctNum = row.reduce((correct, entry) => {
          if(entry == 'correct') 
            {return correct++} else {return correct}
        }, 0,
      )
      if(correctNum == 5){
        setWinner(true)
        localStorage.setItem('winner', JSON.stringify('true'))
      } 
      })
      setStatusArray([...retrievedStatusArray])
    }
    if(localStorage.letterStatusObject) {
      var retrievedLetterStatusObject = JSON.parse(localStorage.getItem('letterStatusObject'))
      setLetterStatusObject({...retrievedLetterStatusObject})
    }
    if(localStorage.valueArray) {
      var retrievedValueArray = JSON.parse(localStorage.getItem('valueArray'))
      setValueArray([...retrievedValueArray])
    }
    if(localStorage.rowPosition) {
      var retrievedRowPosition = parseInt(localStorage.rowPosition)
      console.log(retrievedRowPosition)
      setRowPosition(retrievedRowPosition)
    }

  }, [])

  const keyboardCheck = (e) => {
    focusRef.current.focus()
    setLetterError(false)
    setWordError(false)
    if(!winner) {
    const letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm' ];
    const caps = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
    let value = e.key
    if(letters.includes(value) && !winner) {
      value = value.toUpperCase()
    }
      if(caps.includes(value)) {
            if(boxPosition <= 4) {
              let newValueArray = valueArray
              newValueArray[rowPosition][boxPosition] = value
              setValueArray([...newValueArray])
              setBoxPosition(boxPosition + 1)
            }
    }
    

    if(value == 'Backspace' || value == 'Escape' && !winner) {
      if(boxPosition > 0) {
          setBoxPosition(boxPosition - 1)
          let newValueArray = valueArray
          newValueArray[rowPosition][boxPosition-1] = ''
          setValueArray([...newValueArray])
        }
      }
    if(value == "Enter" && !winner) {
      guess()
    }
  }
  }

  const guess = () => {
    setLetterError(false)
    setWinner(false)
    setWordError(false)
    if(!valueArray[rowPosition].includes('')) {
      const guessWord = valueArray[rowPosition].join("").toLowerCase()
      if (Words.includes(guessWord)) {
        let updatedStatusArray = statusArray
        let updatedLetterStatusObject = letterStatusObject
        let correctNum = 0
        let remainingLetters = correctWord
        valueArray[rowPosition].forEach((letter, i) => {
          if(letter == correctWord[i]) {
            updatedStatusArray[rowPosition][i] = 'correct'
            updatedLetterStatusObject[letter] = 'correct'
            delete remainingLetters[i];
            correctNum++
          }})
        valueArray[rowPosition].forEach((letter, i) => {
          if(remainingLetters.includes(letter)) {
            if(updatedStatusArray[rowPosition][i] != "correct")
            {
              updatedStatusArray[rowPosition][i] = 'wrong-position'
              let letterIndex = remainingLetters.indexOf(letter)
              delete remainingLetters[letterIndex]
            }
            if(updatedLetterStatusObject[letter] != "correct")
            {
              updatedLetterStatusObject[letter] = 'wrong-position'
            }}})
        valueArray[rowPosition].forEach((letter, i) => {
          if(updatedStatusArray[rowPosition][i] == '' ) {
            updatedStatusArray[rowPosition][i] = 'wrong'
            if(updatedLetterStatusObject[letter] == '') {
            updatedLetterStatusObject[letter] = 'wrong'
            }
          }
        }
        )

        setStatusArray([...updatedStatusArray])
        setLetterStatusObject({...updatedLetterStatusObject})
        localStorage.setItem('statusArray', JSON.stringify(statusArray));
        localStorage.setItem('letterStatusObject', JSON.stringify(letterStatusObject));
        localStorage.setItem('valueArray', JSON.stringify(valueArray));
        focusRef.current.focus();

        if(correctNum == 5) {
          setWinner(true)
          localStorage.setItem('winner', JSON.stringify('true'))
        } else {
          setRowPosition(rowPosition + 1)
          localStorage.setItem('rowPosition', JSON.stringify(rowPosition + 1))
          console.log(localStorage.rowPosition)
          setBoxPosition(0)
        }

      } else {
        setWordError(true)
      }
    } else {
      setLetterError(true)
    }

  }



  return (
    <div className='full-area' onKeyDown={keyboardCheck} tabIndex="-1" ref={focusRef}>
      <h1>Dawdle</h1>
      <h3>(But also, hi Sugie)</h3>
    <div className='gameArea'>
      <div className='row'>
      <GuessBox value={valueArray[0][0]} status={statusArray[0][0]}  />
      <GuessBox value={valueArray[0][1]} status={statusArray[0][1]} />
      <GuessBox value={valueArray[0][2]} status={statusArray[0][2]} />
      <GuessBox value={valueArray[0][3]} status={statusArray[0][3]} />
      <GuessBox value={valueArray[0][4]} status={statusArray[0][4]} />
      </div>
      <div className='row'>
      <GuessBox value={valueArray[1][0]} status={statusArray[1][0]}  />
      <GuessBox value={valueArray[1][1]} status={statusArray[1][1]} />
      <GuessBox value={valueArray[1][2]} status={statusArray[1][2]} />
      <GuessBox value={valueArray[1][3]} status={statusArray[1][3]} />
      <GuessBox value={valueArray[1][4]} status={statusArray[1][4]} />
      </div>
      <div className='row'>
      <GuessBox value={valueArray[2][0]} status={statusArray[2][0]}  />
      <GuessBox value={valueArray[2][1]} status={statusArray[2][1]} />
      <GuessBox value={valueArray[2][2]} status={statusArray[2][2]} />
      <GuessBox value={valueArray[2][3]} status={statusArray[2][3]} />
      <GuessBox value={valueArray[2][4]} status={statusArray[2][4]} />
      </div>
      <div className='row'>
      <GuessBox value={valueArray[3][0]} status={statusArray[3][0]}  />
      <GuessBox value={valueArray[3][1]} status={statusArray[3][1]} />
      <GuessBox value={valueArray[3][2]} status={statusArray[3][2]} />
      <GuessBox value={valueArray[3][3]} status={statusArray[3][3]} />
      <GuessBox value={valueArray[3][4]} status={statusArray[3][4]} />
      </div>
      <div className='row'>
      <GuessBox value={valueArray[4][0]} status={statusArray[4][0]}  />
      <GuessBox value={valueArray[4][1]} status={statusArray[4][1]} />
      <GuessBox value={valueArray[4][2]} status={statusArray[4][2]} />
      <GuessBox value={valueArray[4][3]} status={statusArray[4][3]} />
      <GuessBox value={valueArray[4][4]} status={statusArray[4][4]} />
      </div>
      <div className='row'>
      <GuessBox value={valueArray[5][0]} status={statusArray[5][0]}  />
      <GuessBox value={valueArray[5][1]} status={statusArray[5][1]} />
      <GuessBox value={valueArray[5][2]} status={statusArray[5][2]} />
      <GuessBox value={valueArray[5][3]} status={statusArray[5][3]} />
      <GuessBox value={valueArray[5][4]} status={statusArray[5][4]} />
      </div>
    </div>
    {winner && <h2>You Won!</h2>}
    {letterError && <h2>Not Enough Letters</h2>}
    {wordError && <h2>Ezersky says it isn't a word.</h2>}
    {rowPosition == 6 && <h2>Better luck tomorrow. Luckily there's no streak to break?</h2>}
    {!winner && !letterError && !wordError && <h2 className='hide-text'>Not great Bob</h2>}
    <div className='keyboard-area'>
      <div className='keyboard-row'>
      <Key letter='Q' status={letterStatusObject.Q} keyboardCheck={keyboardCheck} />
      <Key letter='W' status={letterStatusObject.W} keyboardCheck={keyboardCheck} />
      <Key letter='E' status={letterStatusObject.E} keyboardCheck={keyboardCheck} />
      <Key letter='R' status={letterStatusObject.R} keyboardCheck={keyboardCheck} />
      <Key letter='T' status={letterStatusObject.T} keyboardCheck={keyboardCheck} />
      <Key letter='Y' status={letterStatusObject.Y} keyboardCheck={keyboardCheck} />
      <Key letter='U' status={letterStatusObject.U} keyboardCheck={keyboardCheck} />
      <Key letter='I' status={letterStatusObject.I} keyboardCheck={keyboardCheck} />
      <Key letter='O' status={letterStatusObject.O} keyboardCheck={keyboardCheck} />
      <Key letter='P' status={letterStatusObject.P} keyboardCheck={keyboardCheck} />
      </div>
      <div className='keyboard-row'>
      <Key letter='A' status={letterStatusObject.A} keyboardCheck={keyboardCheck} />
      <Key letter='S' status={letterStatusObject.S} keyboardCheck={keyboardCheck} />
      <Key letter='D' status={letterStatusObject.D} keyboardCheck={keyboardCheck} />
      <Key letter='F' status={letterStatusObject.F} keyboardCheck={keyboardCheck} />
      <Key letter='G' status={letterStatusObject.G} keyboardCheck={keyboardCheck} />
      <Key letter='H' status={letterStatusObject.H} keyboardCheck={keyboardCheck} />
      <Key letter='J' status={letterStatusObject.J} keyboardCheck={keyboardCheck} />
      <Key letter='K' status={letterStatusObject.K} keyboardCheck={keyboardCheck} />
      <Key letter='L' status={letterStatusObject.L} keyboardCheck={keyboardCheck} />
      </div>
      <div className='keyboard-row'>
      <div type="text" className="return-key" onClick={e => guess()} >
      Enter
      </div>
      <Key letter='Z' status={letterStatusObject.Z} keyboardCheck={keyboardCheck} />
      <Key letter='X' status={letterStatusObject.X} keyboardCheck={keyboardCheck} />
      <Key letter='C' status={letterStatusObject.C} keyboardCheck={keyboardCheck} />
      <Key letter='V' status={letterStatusObject.V} keyboardCheck={keyboardCheck} />
      <Key letter='B' status={letterStatusObject.B} keyboardCheck={keyboardCheck} />
      <Key letter='N' status={letterStatusObject.N} keyboardCheck={keyboardCheck} />
      <Key letter='M' status={letterStatusObject.M} keyboardCheck={keyboardCheck} />
      <div type="text" className="escape-key" onClick={e => keyboardCheck({key: 'Escape'})} >
         ESC
      </div>
      </div>

    </div>
    </div>
  )
}

export default App
