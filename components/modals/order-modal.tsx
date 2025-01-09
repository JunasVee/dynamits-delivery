"use client";

import { z } from "zod";

import { useOrderModal } from "@/hooks/use-order-modal";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
    senderName: z.string().min(1),
    senderPhone: z.string().min(1),
    pickupLocation: z.string().min(1),
    receiverName: z.string().min(1),
    receiverPhone: z.string().min(1),
    destination: z.string().min(1),
    packageDescription: z.string().min(1),
    deliveryOption: z.enum(["Same Day", "One Day"]),
});

export const OrderModal = () => {
    const orderModal = useOrderModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            senderName: "",
            senderPhone: "",
            pickupLocation: "",
            receiverName: "",
            receiverPhone: "",
            destination: "",
            packageDescription: "",
            deliveryOption: "Same Day"
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderName: values.senderName,
                    senderPhone: values.senderPhone,
                    pickupLocation: values.pickupLocation,
                    receiverName: values.receiverName,
                    receiverPhone: values.receiverPhone,
                    destination: values.destination,
                    packageDescription: values.packageDescription,
                    deliveryOption: values.deliveryOption,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit order');
            }

            const data = await response.json();
            console.log("Order Created:", data);
            // Optionally handle the response, like showing a success message
        } catch (error) {
            console.error("Error submitting order:", error);
            // Handle the error accordingly (show error message)
        }
    }

    return (
        <Modal
            title="Order Delivery"
            description="Please complete the details to continue your order!"
            isOpen={orderModal.isOpen}
            onClose={orderModal.onClose}
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {[
                                { name: "senderName", label: "Sender's Name", placeholder: "Enter sender's name" },
                                { name: "senderPhone", label: "Sender's Phone Number", placeholder: "Enter sender's phone number" },
                                { name: "pickupLocation", label: "Pickup Location", placeholder: "Enter pickup location" },
                                { name: "receiverName", label: "Receiver's Name", placeholder: "Enter receiver's name" },
                                { name: "receiverPhone", label: "Receiver's Phone Number", placeholder: "Enter receiver's phone number" },
                                { name: "destination", label: "Destination", placeholder: "Enter destination" },
                                { name: "packageDescription", label: "Package Description", placeholder: "What is your package?(e.g. clothes, food, etc)" },
                            ].map(({ name, label, placeholder }) => (
                                <FormField
                                    key={name}
                                    control={form.control}
                                    name={name as keyof z.infer<typeof formSchema>}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{label}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={placeholder} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <FormField
                                control={form.control}
                                name={"deliveryOption" as keyof z.infer<typeof formSchema>}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivery Option</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Same Day" id="same-day" />
                                                    <label htmlFor="same-day" className="text-sm">Same Day</label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="One Day" id="one-day" />
                                                    <label htmlFor="one-day" className="text-sm">One Day</label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button variant="destructive" onClick={orderModal.onClose}>Cancel</Button>
                                <Button type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

        </Modal>
    );
}