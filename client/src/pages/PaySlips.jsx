import { useEffect, useState } from "react";
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Loading from "../components/Loading";
import PayslipList from "../components/Payslip/PayslipList";
import GeneratePayslipsForm from "../components/Payslip/GeneratePayslipsForm";
import { useAuthProvider } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const PaySlips = () => {

    const { user } = useAuthProvider();

    const [paySlips, setPaySlips] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const isAdmin = user?.role === "ADMIN";

    const fetchPaySlips = async () => {
        setLoading(true);

        try {
            const res = await api.get("/payslips");
            setPaySlips(res.data.data || [])
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update payslips");
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchPaySlips();
    }, []);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await api.get('/employees');
                setEmployees(
                    res.data.result.filter((employee) => !employee.isDeleted)
                );
            } catch (error) {
                toast.error(error?.response?.data?.message || error.message, "Failed to fetch employees");
            }
        };

        if (isAdmin) {
            fetchEmployees();
        }
    }, [isAdmin]);

    if (loading) return <Loading />

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="page-title">Payslips</h1>

                    <p className="page-subtitle">
                        {isAdmin ? "Generate & manage employee payslips" : "Your payslip history"}
                    </p>
                </div>

                {isAdmin && (
                    <GeneratePayslipsForm employees={employees} onSuccess={fetchPaySlips} />
                )}
            </div>

            <PayslipList isAdmin={isAdmin} payslips={paySlips} />
        </div>
    );
};

export default PaySlips;