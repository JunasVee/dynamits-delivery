import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Status } from "@prisma/client";

export async function PUT(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params; // No need for await

        const body = await req.json();
        const { status } = body;

        // Validate ID format
        if (!id) {
            return new NextResponse("Invalid order ID", { status: 400 });
        }

        // Validate status
        if (!status || !Object.values(Status).includes(status)) {
            return new NextResponse(`Invalid status: ${status}`, { status: 400 });
        }

        // Check if order exists
        const existingOrder = await prismadb.order.findUnique({
            where: { id },
        });

        if (!existingOrder) {
            return new NextResponse("Order not found", { status: 404 });
        }

        // Update order status
        const updatedOrder = await prismadb.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedOrder, { status: 200 });

    } catch (error) {
        console.error("[ORDER_UPDATE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params; // Destructure id from params

        // Check if ID is provided
        if (!id) {
            return new NextResponse("Invalid order ID", { status: 400 });
        }

        await prismadb.order.delete({
            where: { id },
        });

        return new NextResponse("Order deleted successfully", { status: 200 });
    } catch (error) {
        console.error("[ORDER_DELETE_ERROR]", error);
        return new NextResponse("Failed to delete order", { status: 500 });
    }
}