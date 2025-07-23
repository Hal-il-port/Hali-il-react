import Header from "../components/Header";
import "./Board.css";
import { useState } from "react";
import BoardItem from "../components/boardItem";
import BoardDetail from "../components/BoardDetail";
import AddBoardItem from "../components/AddBoardItem";

const Board = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const tabData = [
        { label: '공지사항', content: '공지사항 아이템' },
        { label: 'QnA', content: 'QnA Item' },
        { label: 'FAQ', content: 'FAQ Item' },
    ];

    const handleTabClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div>
            <Header />
            <div className="Board">
                <div className="tab-buttons">
                    {tabData.map((tab, index) => (
                    <button
                        key={index}
                        className={activeIndex === index ? 'active' : ''}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </button>
                    ))}
                </div>
                
                <div className="button-wrapper">
                    <button>문의하기</button>
                </div>

                <div className="Item-wrapper">
                    <div className="tab-content">
                        {tabData[activeIndex].content}
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Board;