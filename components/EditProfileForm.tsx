"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import MagicButton from "@/components/MagicButton";
import { useState, useRef, useEffect } from "react";
import { AuthenticatedUserData } from "@/types";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import MiniLoader from "./MiniLoader";

const formSchema = z.object({
  fullName: z.string(),
  email: z.string(),
});

interface EditProfileFormProps {
  user: AuthenticatedUserData;
}

const EditProfileForm = ({ user }: EditProfileFormProps) => {
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
    },
  });

  // State for image preview and file
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "File type not allowed",
          description: "Only JPG, PNG, and WEBP formats are allowed.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (1MB = 1048576 bytes)
      if (file.size > 1048576) {
        toast({
          title: "File size too large",
          description: "File size must not exceed 1MB.",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Clean up image preview when component unmounts to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Trigger file input click when button is clicked
  const handleChangeAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/user", {
        method: "PATCH",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("result", result);
        throw new Error(result.message);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-6">
          {/* Show image preview or default image */}
          <Image
            src={imagePreview || user?.image}
            alt="Preview"
            width={85}
            height={85}
            placeholder="blur"
            blurDataURL="/blur-image.webp"
            className="w-[85px] h-[85px] object-cover rounded-md"
          />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Custom button to trigger file input */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleChangeAvatarClick}
              className="rounded-sm text-sm bg-gray-700 w-[80%] font-semibold p-2"
            >
              Change avatar
            </button>

            <p className="text-xs text-gray-400">JPG,PNG,WEBP. 1MB max.</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="mt-6 ">
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mt-6 mb-8">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full h-[1px] bg-[#181724] my-4" />
        <MagicButton
          title={loading ? <MiniLoader /> : "Save"}
          position="left"
          otherClasses="mt-4"
          disabled={loading}
          aria-live="polite" // Announce button state to screen readers
        />
      </form>
    </Form>
  );
};

export default EditProfileForm;
