import style from "../style.css";

const Cell = ({ x, y, color, handleOnClick }) => {
    return (
        <button data-x={x} data-y={y} class={style.cell} style={{ backgroundColor:color }} onClick={handleOnClick}></button>
    )
}

export default Cell;