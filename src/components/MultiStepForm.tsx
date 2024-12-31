"use client";

import { FormSchema, FormValues } from "@/schemas/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useMemo, useState } from "react";
import { useForm, SubmitHandler, useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import ProgressBar from "./ui/progress-bar";

const Field = ({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const MultiStepForm = () => {
  const steps = useMemo(
    () => [
      {
        id: "Step 1",
        name: "Personal Information",
        fields: [
          { name: "name", label: "Name", placeholder: "Name", type: "text" },
          {
            name: "email",
            label: "Email",
            placeholder: "Email",
            type: "email",
          },
          { name: "age", label: "Age", placeholder: "Age", type: "number" },
        ],
      },
      {
        id: "Step 2",
        name: "Location",
        fields: [
          {
            name: "country",
            label: "Country",
            placeholder: "Country",
            type: "text",
          },
        ],
      },
      {
        id: "Step 3",
        name: "Security",
        fields: [
          {
            name: "password",
            label: "Password",
            placeholder: "Password",
            type: "password",
          },
          {
            name: "confirmPassword",
            label: "Confirm Password",
            placeholder: "Confirm Password",
            type: "password",
          },
        ],
      },
      { id: "Step 4", name: "Complete", fields: [] },
    ],
    []
  );

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const lastStep = steps.length - 1;
  const stepBeforeLast = steps.length - 2;

  console.log({ previousStep });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 18,
      country: "",
      password: "",
      confirmPassword: "",
    },
  });

  const processForm: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    // Simulate API call with 2-second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);

    setIsLoading(false);
  };

  type FieldName = keyof FormValues;

  const next = async () => {
    const fields = steps[currentStep].fields.map(
      (field) => field.name
    ) as FieldName[];

    const isValid = await form.trigger(fields);

    if (!isValid) return;

    if (currentStep < lastStep) {
      if (currentStep === stepBeforeLast) {
        await processForm(form.getValues());
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const renderStepContent = () => {
    if (currentStep === lastStep) {
      return (
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Registration Complete!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for registering. We&apos;ve sent you an email with further
            instructions.
          </p>
        </div>
      );
    }

    return steps[currentStep].fields.map((field) => (
      <Field key={field.name} {...field} />
    ));
  };

  return (
    <section className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <ProgressBar steps={steps} currentStep={currentStep} />
        <Form {...form}>
          <form className="mt-8 space-y-6">
            {renderStepContent()}
            {currentStep < lastStep && (
              <div className="mt-8 flex justify-between space-x-4">
                <Button
                  type="button"
                  onClick={prev}
                  disabled={currentStep === 0 || isLoading}
                  className="w-full"
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={next}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading && (
                    <Fragment>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Fragment>
                  )}

                  {!isLoading && currentStep === stepBeforeLast && "Submit"}
                  {!isLoading && currentStep !== stepBeforeLast && "Next"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </section>
  );
};

export default MultiStepForm;
