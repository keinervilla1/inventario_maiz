import { usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const breadcrumbs = [{ title: "Estadisticas", href: "/dashboard" }];

export default function Dashboard() {
    const { estadisticas } = usePage<{ estadisticas?: any[] }>().props;
    const data = estadisticas || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    📅 Estadísticas del Último Año (BULTOS)
                </h2>

                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={380}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="mes" stroke="#4b5563" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    color: "#fff",
                                    borderRadius: 8,
                                    border: "none",
                                }}
                                labelStyle={{ color: "#f3f4f6" }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar
                                dataKey="total_ingresados"
                                name="Ingresados"
                                fill="#10b981"
                                radius={[6, 6, 0, 0]}
                                barSize={28}
                            />
                            <Bar
                                dataKey="total_vendidos"
                                name="Vendidos"
                                fill="#6366f1"
                                radius={[6, 6, 0, 0]}
                                barSize={28}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No hay datos disponibles.</p>
                )}
            </div>
        </AppLayout>
    );
}
