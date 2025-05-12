"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@heroui/react";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" })
    .regex(/^\+?[0-9\s\-()]+$/, {
      message: "Please enter a valid phone number",
    }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });
    
  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h1>Shipping Information</h1>
        <p>Please enter your shipping details to complete your order.</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={form.control}
            name="name"
            
            render={({ field }) => <Input placeholder="John Doe" {...field} 
            errorMessage={form.formState.errors.name?.message}
            isInvalid={!!form.formState.errors.name}
            />}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <Input
                type="email"
                placeholder="john.doe@example.com"
                errorMessage={form.formState.errors.email?.message}
                isInvalid={!!form.formState.errors.email}
                {...field}
              />
            )}
          />

          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <Input
                placeholder="+1 (555) 123-4567"
                errorMessage={form.formState.errors.phone?.message}
                isInvalid={!!form.formState.errors.phone}
                {...field}
                className="min-h-[100px]"
              />
            )}
          />

          <Controller
            control={form.control}
            name="address"
            render={({ field }) => (
              <Input
                placeholder="123 Main St, Apt 4B, City, State, Zip Code"
                {...field}
                className="min-h-[100px]"
                errorMessage={form.formState.errors.address?.message}
                isInvalid={!!form.formState.errors.address}
              />
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} />
                Processing...
              </>
            ) : isSuccess ? (
              <>
                <FontAwesomeIcon icon={faCheck} />
                Order Placed
              </>
            ) : (
              "Complete Order"
            )}
          </Button>
        </form>
      </CardBody>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <p>All information is encrypted and secure</p>
      </CardFooter>
    </Card>
  );
}
