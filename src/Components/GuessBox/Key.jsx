import './Key.css'

function Key({status, letter, keyboardCheck}) {

    return (
        <>
        <div type="text" className={"virtual-key " + status} onClick={e => keyboardCheck({key: letter})} >
            {letter}
        </div>
        </>
    )
}

export default Key