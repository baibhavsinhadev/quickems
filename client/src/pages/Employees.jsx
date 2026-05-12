import { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import { Plus, SearchIcon, XIcon } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";

const Employees = () => {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [editEmployee, setEditEmployee] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Fetch employees
    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const url = selectedDept ? `/employees?department=${selectedDept}` : "/employees";

            const res = await api.get(url);
            setEmployees(res.data.result || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch employees");
        } finally {
            setLoading(false);
        }
    }, [selectedDept]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const filtered = employees.filter((emp) => `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">Manage your team members</p>
                </div>

                <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer">
                    <Plus size={16} /> Add Employee
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 transform text-slate-400 w-4 h-4" />

                    <input type="text" placeholder="Search employees..." className="w-full pl-10!" onChange={e => setSearch(e.target.value)} value={search} />
                </div>

                <select className="max-w-40" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                    <option value="">All Departments</option>

                    {DEPARTMENTS.map((department) => (
                        <option key={department} value={department}>{department}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filtered.length === 0 ? (
                        <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No employees found</p>
                    ) : (
                        filtered.map((emp) => (
                            <EmployeeCard key={emp.id} onDelete={fetchEmployees} onEdit={(e) => setEditEmployee(e)} employee={emp} />
                        ))
                    )}
                </div>
            )}

            {showCreateModal && (
                <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowCreateModal(false)}>
                    <div className="fixed inset-0" />

                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 pb-0">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Add New Employee</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Create a user account & employee profile</p>
                            </div>

                            <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                                <XIcon size={25} />
                            </button>
                        </div>

                        <div className="p-6">
                            <EmployeeForm onSuccess={() => { setShowCreateModal(false); fetchEmployees(); }} onCancel={() => setShowCreateModal(false)} />
                        </div>
                    </div>
                </div>
            )}

            {editEmployee && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm" onClick={() => setEditEmployee(null)}>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 pb-0">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Update employee details</p>
                            </div>

                            <button onClick={() => setEditEmployee(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                                <XIcon size={25} />
                            </button>
                        </div>

                        <div className="p-6">
                            <EmployeeForm initialData={editEmployee} onSuccess={() => { setEditEmployee(null); fetchEmployees(); }} onCancel={() => setEditEmployee(null)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;