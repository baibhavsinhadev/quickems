import { useEffect, useState } from "react";
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/AdminDashboard";
import api from "../api/axios";
import { toast } from "react-toastify";

const Dashboard = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/dashboard');
                setData(res.data);
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loading />;
    if (!data) return <p className="text-center text-slate-500 py-12">Failed to load dashboard</p>;

    if (data.role === "ADMIN") {
        return (
            <AdminDashboard data={data} />
        );
    } else {
        return (
            <EmployeeDashboard data={data} />
        );
    };
};

export default Dashboard;