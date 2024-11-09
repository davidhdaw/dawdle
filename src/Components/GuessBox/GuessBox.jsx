import "./GuessBox.css"

//takes in a "highlighted" state to indicate if it's the box with current focus
//has a letter state that can be updated from the keyboard or from the user typing
//has a guessStatus state to indicate if the guess was good or not

//passes down all viable letters and the correct letter for this box.
//On a guess it sends the status of the locked in guess to itself and then back up the tree?

/*No okay I gotta work this data model out a bit better. On submit each letter in the current row does a check on the letter that's its current value. 
If it matches or matches in the wrong position then set the corresponding status and if it matches then send a signal back up so it can see if it gets five matches so you win
or doesn't and it moves you down to the next row.

That means what this needs to have is a function that checks
*/

/*
Okay nope again I'm being dumb.
Values come from the top down and the moving between boxes logic as well as the status check logic all lives up in the top level and passes down status and box value.
*/




function GuessBox({status, value}) {

    return (
        <>
        <div type="text" className={"default-box " + status}>
            {value}
        </div>
        </>
    )
}

export default GuessBox