import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import style from "./style.css";
import Cell from "./Cell";

const Main = () => {
    const [width, setWidth] = useState(5);
    const [height, setHeight] = useState(5);
    const [cell_kinds, setCellKinds] = useState(["#ffffff", "#000000"]);
    const [matrix, setMatrix] = useState([
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ]);
    const [bracket_type, setBracketType] = useState("square");
    const [result, setResult] = useState("");

    useEffect(() => { // 맵 크기 조절
        // height
        if (height > matrix.length) {
            for (let i = 0; i < height - matrix.length; i++) { 
                setMatrix(m => [...m, Array(m[0].length).fill(0)]);
            }
        } else if (height < matrix.length) {
            setMatrix(m => m.filter((item, i) => i < height));
        }

        // width
        if (width > matrix[0].length) {
            setMatrix(m => {
                let temp = Array(width - matrix[0].length).fill(0);
                return m.map(item => item.concat(temp));
            });
        } else if (width < matrix[0].length) {
            setMatrix(m => (
                m.map(item => item.filter((item, i) => i < width))
            ));
        }
    }, [width, height])

    const changeBracketType = (e) => {
        setBracketType(e.target.value);
    }

    const changeCellColor = (e) => { // 지정된 색 바꾸기
        setCellKinds(c => c.map((item, i) => Number(e.target.id) == i ? e.target.value : item));
    }

    const addColor = () => { // 새 색 추가
        setCellKinds(c => [...c, "#" + Math.floor(Math.random() * 16777215).toString(16)]);
    }

    const deleteColor = (e) => { // 색 삭제
        const delete_check = confirm("삭제할 색이 맵 안에 있다면, 그 셀은 맨 마지막 색으로 자동으로 바뀝니다.\n정말로 삭제하시겠습니까?");

        if (!delete_check) {
            return;
        }
        
        const id = e.target.dataset.id;

        setMatrix(m => ( // 삭제 후 색이 의도하지 않게 바뀌는 것을 방지하기 위해 id 바꾸기
            m.map((row, y) => (
                row.map((item, x) => {
                    if (item > id) {
                        return item - 1;
                    } else if (item == id) {
                        return cell_kinds.length - 2;
                    }

                    return item;
                })
            ))
        ));

        setCellKinds(k => k.filter((item, i) => i != id));
    }

    const changeWidth = (e) => { // 너비 조정
        let value = Number(e.target.value);

        if (Number.isInteger(value) && value > 0) {
            setWidth(value);
        } else {
            alert("크기는 자연수여야 합니다.")
        }
    }

    const changeHeight = (e) => { // 높이 조정
        let value = Number(e.target.value);

        if (Number.isInteger(value) && value > 0) {
            setHeight(value);
        } else {
            alert("크기는 자연수여야 합니다.")
        }
    }

    const generateToMatrix = () => { // 매트릭스 배열로 변환
        const bracket = {
            "square": {
                0: "[",
                1: "]",
            },
            "curly": {
                0: "{",
                1: "}",
            },
            "parentheses": {
                0: "(",
                1: ")",
            },
        }

        let array = bracket[bracket_type][0] + "\n";

        matrix.forEach((row) => {
            array += bracket[bracket_type][0];
            row.forEach((item) => {
                array += `${item}, `;
            });
            array = array.slice(0, array.length - 2);
            array += bracket[bracket_type][1] + ",\n";
        });
        
        array += bracket[bracket_type][1];

        console.log(array);

        setResult(array);

        navigator.clipboard.writeText(array)
        .then(() => {
            alert("변환된 매트릭스 배열이 클립보드에 복사되었습니다.\n원하는 곳에 붙여넣어 사용하세요.");
        })
        .catch(err => {
            alert("죄송합니다. 클립보드에 정상적으로 복사하지 못하였습니다. 직접 복사하여 사용하세요.\n" + err);
        })
    }

    const changeCell = (e) => { // 매트릭스 셀 색 바꾸기
        const { x, y } = e.target.dataset;

        setMatrix(
            m => m.map((row, dy) => (
                row.map((item, dx) => {
                    if (dx == x && dy == y) {
                        let temp = item + 1;
                        
                        if (temp >= cell_kinds.length) {
                            return 0;
                        } else {
                            return temp;
                        }
                    } else {
                        return item;
                    }
                })
            ))
        );
    }

    return (
        <div class={style.main}>
            <div class={style.setting}>
                <label for="width">Width</label>
                <input id="width" type="number" placeholder="Width" value={width} onChange={changeWidth} />

                <label for="height">Height</label>
                <input id="height" type="number" placeholder="Height" value={height} onChange={changeHeight} />

                <label for="bracket">Kind of bracket</label>
                <select id="bracket" onChange={changeBracketType}>
                    <option value="square">[ ]</option>
                    <option value="curly">{"{ }"}</option>
                    <option value="parentheses">( )</option>
                </select>
            </div>

            <button class={style.generate_btn} onClick={generateToMatrix}>Generate!</button>

            <textarea class={style.result} value={result}></textarea>
            
            <div class={style.editor}>
                <div class={style.customize_cell}>
                    {cell_kinds.map((item, i) => (
                        <div class={style.color}>
                            <input type="color" value={item} id={i} onChange={changeCellColor} />
                            <label for={i}>{i}</label>
                            <button data-id={i} onClick={deleteColor}>❎</button>
                        </div>
                    ))}

                    <button class={style.add_color} onClick={addColor}>Add</button>
                </div>

                <div class={style.matrix}>
                    {matrix.map((row, y) => (
                        <div class="row" style={{fontSize: 0, lineHeight: 0}}>
                            {row.map((item, x) => (
                                <Cell x={x} y={y} color={cell_kinds[item]} handleOnClick={changeCell} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Main;