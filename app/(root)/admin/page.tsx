"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define Order type
type Order = {
    id: string;
    senderName: string;
    senderNumber: string;
    pickupLocation: string;
    receiverName: string;
    receiverNumber: string;
    destination: string;
    packageDesc: string;
    deliveryType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check if admin is logged in
        if (!localStorage.getItem("adminLoggedIn")) {
            router.push("/admin/login"); // Redirect to login page
        } else {
            const fetchOrders = async () => {
                try {
                    const res = await fetch("/api/orders", { cache: "no-store" });
                    if (!res.ok) throw new Error("Failed to fetch orders");

                    const data = await res.json();

                    const sortedOrders = data.sort((a: Order, b: Order) => {
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    });
                    setOrders(sortedOrders);
                    setLoading(false);
                } catch (err: any) {
                    console.error("Error fetching orders:", err);
                    setError(err.message);
                    setLoading(false);
                }
            };

            fetchOrders();
        }
    }, [router]);

    const updateOrderStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
        } catch (err: any) {
            console.error("Error updating order status:", err);
        }
    };

    const deleteOrder = async (id: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete order");

            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        } catch (err: any) {
            console.error("Error deleting order:", err);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // This will format the date into a readable string
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Sender</th>
                        <th className="border px-4 py-2">Receiver</th>
                        <th className="border px-4 py-2">Pickup</th>
                        <th className="border px-4 py-2">Destination</th>
                        <th className="border px-4 py-2">Package</th>
                        <th className="border px-4 py-2">Delivery Type</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Ordered At</th>
                        <th className="border px-4 py-2">Delivered At</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border">
                            <td className="border px-4 py-2">
                                {order.senderName} <br />
                                <span className="text-sm text-gray-600">
                                    {order.senderNumber}
                                </span>
                            </td>
                            <td className="border px-4 py-2">
                                {order.receiverName} <br />
                                <span className="text-sm text-gray-600">
                                    {order.receiverNumber}
                                </span>
                            </td>
                            <td className="border px-4 py-2">{order.pickupLocation}</td>
                            <td className="border px-4 py-2">{order.destination}</td>
                            <td className="border px-4 py-2">{order.packageDesc}</td>
                            <td className="border px-4 py-2">{order.deliveryType}</td>
                            <td className="border px-4 py-2">{order.status}</td>
                            <td className="border px-4 py-2">{formatTimestamp(order.createdAt)}</td>
                            <td className="border px-4 py-2">
                                {order.status === "DELIVERED" ? formatTimestamp(order.updatedAt) : "-"}
                            </td>
                            <td className="border px-4 py-2">
                                <select
                                    className="border p-1 rounded"
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PICKING_UP">Picking Up</option>
                                    <option value="DELIVERING">Delivering</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                                <button
                                    onClick={() => deleteOrder(order.id)}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
