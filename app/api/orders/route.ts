import { DeliveryType, Status } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";

const orderSchema = z.object({
    senderName: z.string().min(1),
    senderPhone: z.string().min(1),
    pickupLocation: z.string().min(1),
    receiverName: z.string().min(1),
    receiverPhone: z.string().min(1),
    destination: z.string().min(1),
    packageDescription: z.string().min(1),
    deliveryOption: z.enum(["Same Day", "One Day"]),
});

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();

        const validatedData = orderSchema.parse(body);

        const orderData = {
            senderName: validatedData.senderName,
            senderNumber: validatedData.senderPhone,
            pickupLocation: validatedData.pickupLocation,
            receiverName: validatedData.receiverName,
            receiverNumber: validatedData.receiverPhone,
            destination: validatedData.destination,
            packageDesc: validatedData.packageDescription,
            deliveryType: validatedData.deliveryOption === "Same Day" ? DeliveryType.SAME_DAY : DeliveryType.ONE_DAY,
            status: Status.PENDING,
        };

        const order = await prismadb.order.create({
            data: orderData,
        })

        return NextResponse.json(order, { status: 201 });

    } catch (error) {
        console.log('[ORDERS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET() {
    try {
        const orders = await prismadb.order.findMany();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.log("[ORDERS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}