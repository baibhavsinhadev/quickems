import { format } from "date-fns";
import { Check, XIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {

    const [processing, setProcessing] = useState({ id: null, type: null });

    const handleStatusUpdate = async (id, status) => {
        setProcessing({ id, type: status });

        try {
            await api.patch(`/leaves/${id}`, { status });
            onUpdate();
            toast.success(status === "REJECTED" ? "Leave Rejected" : "Leave Approved");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update leave status");
        } finally {
            setProcessing({ id: null, type: null });
        }
    };

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="table-modern">
                    <thead>
                        <tr>
                            {isAdmin && (
                                <th>Employee</th>
                            )}
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Status</th>
                            {isAdmin && (
                                <th className="text-center">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 4} className="text-center py-12 text-slate-400">
                                    No Leave Applications Found
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave) => (
                                <tr key={leave._id || leave.id}>
                                    {isAdmin && (
                                        <td className="text-slate-900">
                                            {leave.employee?.firstName}
                                            {leave.employee?.lastName}
                                        </td>
                                    )}

                                    <td>
                                        <span className="badge bg-slate-100 text-slate-600">
                                            {leave.type}
                                        </span>
                                    </td>

                                    <td className="text-xs text-slate-500">
                                        {format(new Date(leave.startDate), "MMM dd, yyyy")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                                    </td>

                                    <td title={leave.reason} className="max-w-xs truncate text-slate-500">
                                        {leave.reason}
                                    </td>

                                    <td>
                                        <span className={`badge ${leave.status === "APPROVED" ? "badge-success" : leave.status === "REJECTED" ? "badge-danger" : "badge-warning"}`}>
                                            {leave.status}
                                        </span>
                                    </td>

                                    {isAdmin && (
                                        <td className="text-slate-900">
                                            {leave.status === "PENDING" ? (
                                                <div className="flex justify-center gap-1">
                                                    <button onClick={() => handleStatusUpdate(leave._id || leave.id, "APPROVED")} disabled={processing.id === (leave._id || leave.id)} className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                                                        {processing.id === (leave._id || leave.id) && processing.type === "APPROVED" ? (
                                                            <Loader2Icon className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                    </button>

                                                    <button onClick={() => handleStatusUpdate(leave._id || leave.id, "REJECTED")} disabled={processing.id === (leave._id || leave.id)} className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                                                        {processing.id === (leave._id || leave.id) && processing.type === "REJECTED" ? (
                                                            <Loader2Icon className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <XIcon className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center">
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${leave.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                                                        {leave.status === "APPROVED" ? (
                                                            <>
                                                                <Check className="w-3.5 h-3.5" />
                                                                Approved
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XIcon className="w-3.5 h-3.5" />
                                                                Rejected
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveHistory;