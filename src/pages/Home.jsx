import Header from "../components/Header";
import ScheduleList from "../components/ScheduleList";
import Calendar from "../components/Calendar";
import "./Home.css";

const Home = () => {
    
    return (
        <div>
            <Header />

            <div className="MainContent">
                {/* <div className="CalendarWrapper">
                    <Calendar />
                </div> */}
                <div className="ScheduleWrapper">
                    <ScheduleList />
                </div>
            </div>
        </div>
    );
};

export default Home;