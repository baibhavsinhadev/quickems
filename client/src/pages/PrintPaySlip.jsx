import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyPayslipData } from "../assets/assets";
import Loading from "../components/Loading";
import { format } from "date-fns";
import api from "../api/axios";

const PrintPaySlip = () => {

    const { id } = useParams();
    const [payslip, setPayslip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/payslips/${id}`).then((res) => setPayslip(res.data)).catch(console.error("Payslip not found")).finally(() => setLoading(false))
    }, [id]);

    if (loading) return (
        <div className="flex justify-center h-screen items-center">
            <div className="animate-spin size-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );

    if (!payslip) return <p className="text-center py-12 text-slate-400">Payslip not found</p>

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 animate-fade-in">
            <div className="card card-hover p-8 md:p-10 shadow-sm">
                <div className="text-center border-b border-slate-200 pb-6 mb-8">
                    <h1 className="text-3xl font-semibold text-indigo-600 tracking-tight">PAYSLIP</h1>

                    <p className="text-slate-500 text-sm mt-2">{format(new Date(payslip.year, payslip.month - 1), "MMMM, yyyy")}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50/60 rounded-lg p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Employee Name</p>
                        <p className="font-semibold text-slate-900">{payslip.employee?.firstName} {payslip.employee?.lastName}</p>
                    </div>

                    <div className="bg-slate-50/60 rounded-lg p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Position</p>

                        <p className="font-semibold text-slate-900">{payslip.employee?.position}</p>
                    </div>

                    <div className="bg-slate-50/60 rounded-lg p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</p>

                        <p className="font-semibold text-slate-900">{payslip.employee?.email}</p>
                    </div>

                    <div className="bg-slate-50/60 rounded-lg p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Period</p>

                        <p className="font-semibold text-slate-900">{format(new Date(payslip.year, payslip.month - 1), "MMMM, yyyy")}</p>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 mb-8">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Basic Salary</td>
                                <td className="text-right font-medium text-slate-900">${payslip.basicSalary?.toLocaleString()}</td>
                            </tr>

                            <tr>
                                <td>Allowances</td>
                                <td className="text-right font-medium text-emerald-600">+${payslip.allowances?.toLocaleString()}</td>
                            </tr>

                            <tr>
                                <td>Deductions</td>
                                <td className="text-right font-medium text-rose-600">-${payslip.deductions?.toLocaleString()}</td>
                            </tr>

                            <tr className="bg-indigo-50/60">
                                <td className="font-semibold text-slate-900">Net Salary</td>
                                <td className="text-right font-bold text-indigo-700 text-lg">${payslip.netSalary?.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center">
                    <button className="btn-primary print:hidden cursor-pointer" onClick={() => window.print()}>
                        Print Payslip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintPaySlip;