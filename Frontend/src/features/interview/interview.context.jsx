import {createContext, useContext, useState} from "react";

const InterviewContext = createContext();

export const useInterview = () => {
    return useContext(InterviewContext);
};
export const InterviewProvider = ({children, value}) => {
const  [loading, setLoading] = useState(false);
const  [report, setReport] = useState(null);
const [reports, setReports] = useState([]);
    return (
        <InterviewContext.Provider value={{loading, setLoading, report, setReport}}>
            {children}
        </InterviewContext.Provider>
    );
};