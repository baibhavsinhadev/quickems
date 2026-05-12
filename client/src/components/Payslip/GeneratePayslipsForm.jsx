import { Loader2Icon, Plus, XIcon } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";

const GeneratePayslipsForm = ({ employees, onSuccess }) => {
    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const years = [currentYear - 1, ...Array.from({ length: 5 }, (_, i) => currentYear + i)];

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary flex items-center gap-2 cursor-pointer"
            >
                <Plus className="w-4 h-4" /> Generate Payslip
            </button>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.post('/payslips', data);
            setIsOpen(false);
            onSuccess();
            toast.success("Payslip Generated");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to generate payslip");
        } finally {
            setLoading(false);
        }
    };

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const isSameYear = selectedYear === currentYear;
    const isPrevYear = selectedYear === currentYear - 1;

    return (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="card max-w-lg w-full p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                        Generate Monthly Payslip
                    </h3>

                    <button onClick={() => setIsOpen(false)} className="text-slate-400 cursor-pointer hover:text-slate-600 p-1">
                        <XIcon size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Employee
                        </label>

                        <select name="employeeId">
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.firstName} {employee.lastName} ({employee.position})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Month
                            </label>

                            <select name="month">
                                {months.map((month, index) => {
                                    const monthNumber = index + 1;
                                    let isDisabled = false;

                                    if (selectedYear === currentYear) {
                                        const startMonth = currentMonth === 1 ? 1 : currentMonth - 1;
                                        isDisabled = monthNumber < startMonth;
                                    } else if (selectedYear === currentYear - 1) {
                                        isDisabled = monthNumber !== 12;
                                    } else if (selectedYear > currentYear) {
                                        isDisabled = false;
                                    } else {
                                        isDisabled = true;
                                    }

                                    return (
                                        <option key={index} value={monthNumber} disabled={isDisabled}>
                                            {monthNumber} - {month}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Year
                            </label>

                            <select name="year" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Basic Salary
                        </label>

                        <input type="number" name="basicSalary" defaultValue={0} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Allowances
                            </label>

                            <input type="number" name="allowances" defaultValue={0} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Deductions
                            </label>

                            <input type="number" name="deductions" defaultValue={0} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button className="btn-secondary cursor-pointer" type="button" onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>

                        <button type="submit" disabled={loading} className="btn-primary flex items-center disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                            {loading ? (
                                <>
                                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : "Generate"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GeneratePayslipsForm;