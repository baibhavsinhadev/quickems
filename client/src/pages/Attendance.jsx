import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import CheckInButton from "../components/Attendance/CheckInButton";
import AttendanceStats from "../components/Attendance/AttendanceStats";
import AttendanceHistory from "../components/Attendance/AttendanceHistory";
import api from "../api/axios";

const Attendance = () => {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const res = await api.get("/attendance");
            const json = res.data;

            if (!json?.success) {
                throw new Error("Invalid response");
            };

            setHistory(json.result || []);
            setIsDeleted(!!json.employee?.isDeleted);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch attendance");
        } finally {
            setLoading(false)
        };
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <Loading />

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecord = history.find((r) => new Date(r.date).toDateString() === today.toDateString());

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Attendance</h1>
                <p className="page-subtitle">Track your work hours & daily check-ins</p>
            </div>


            {isDeleted ? (
                <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-xl text-center">
                    <p className="text-rose-600">You can no longer clock in or out because your employee records have been marked as deleted.</p>
                </div>
            ) : (
                <div className="mb-8">
                    <CheckInButton todayRecord={todayRecord} onAction={fetchData} />
                </div>
            )}

            <AttendanceStats history={history} />
            <AttendanceHistory history={history} />
        </div>
    );
};

export default Attendance;