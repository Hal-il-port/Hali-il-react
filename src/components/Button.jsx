import "./Button.css"

const Button = ({ text, type, onClick, disabled }) => {
    return (
        <button
            className={`Button ${type}`}
            onClick={onClick}
            disabled={disabled}  // 이 줄이 있어야 비활성화 가능
        >
            {text}
        </button>
    );
};

export default Button;