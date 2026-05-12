import { useEffect, useState } from "react";
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Loading from "../components/Loading";
import PayslipList from "../components/Payslip/PayslipList";
import GeneratePayslipsForm from "../components/Payslip/GeneratePayslipsForm";

const PaySlips = () => {

    const [paySlips, setPaySlips] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const isAdmin = true;

    const fetchPaySlips = () => {
        setLoading(true);
        setPaySlips(dummyPayslipData);

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchPaySlips();
    }, []);

    useEffect(() => {
        if (isAdmin) {
            setEmployees(dummyEmployeeData)
        };
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