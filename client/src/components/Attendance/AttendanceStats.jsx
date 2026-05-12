import { AlertCircleIcon, CalendarIcon, ClockIcon } from "lucide-react";

const AttendanceStats = ({ history }) => {

    const totalPresent = history.filter((h) => h.status === "PRESENT" | h.status === "LATE").length;
    const totalLate = history.filter((h) => h.status === "LATE").length;

    const workingEntries = history.filter((h) => h.workingHours);
    const avgHours = workingEntries.length
        ? (workingEntries.reduce((sum, h) => sum + h.workingHours, 0) / workingEntries.length).toFixed(1)
        : 0;

    const stats = [
        {
            label: "Days Present",
            value: totalPresent,
            icon: CalendarIcon
        },
        {
            label: "Late Arrivals",
            value: totalLate,
            icon: AlertCircleIcon
        },
        {
            label: "Average Work Hours",
            value: avgHours,
            icon: ClockIcon
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {stats.map((stat) => {

                const Icon = stat.icon

                return (
                    <div key={stat.label} className="card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70" />

                        <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                            <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200" />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-medium text-slate-900 tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default AttendanceStats;