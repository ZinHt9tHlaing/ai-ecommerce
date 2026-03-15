import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "@/schema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateUserProfileMutation } from "@/queries/user-queries";
import { toast } from "sonner";
import axios from "axios";
import { useRef, useState } from "react";
import { useImagePreview } from "@/hooks/useImagePreview";

const ProfilePage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: updateProfileMutation, isPending } =
    useUpdateUserProfileMutation();

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      profilePhoto: [],
    },
  });

  const { image, setFile, removeFile } = useImagePreview();

  const updateFormHandler = async (data: UpdateProfileSchema) => {
    try {
      await updateProfileMutation({
        name: data.name,
        profilePhoto: data.profilePhoto[0].file!,
      });

      toast.success("Profile updated");

      form.reset();
      removeFile();

      setOpen(false);

      navigate("/profile", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        {/* Avatar with Edit */}
        <div className="relative mx-auto mb-8 h-32 w-32">
          <img
            src={"https://github.com/shadcn.png"}
            className="h-full w-full rounded-full border border-gray-200 object-cover"
            // alt={user?.name}
          />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="absolute right-2 bottom-0 cursor-pointer rounded-full bg-gray-800 p-2 text-white transition-colors hover:bg-gray-800">
                <Pencil className="h-4 w-4" />
              </button>
            </DialogTrigger>

            <DialogContent className="w-96 sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your name and profile photo
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(updateFormHandler)}
                  className="mt-6 space-y-4"
                >
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@eshop.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Profile Photo */}
                  <FormField
                    control={form.control}
                    name="profilePhoto"
                    render={() => (
                      <FormItem>
                        <FormLabel>Profile Photo</FormLabel>
                        <FormControl>
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              setFile(file);

                              form.setValue("profilePhoto", [
                                {
                                  file,
                                  url: URL.createObjectURL(file),
                                },
                              ]);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {image && (
                    <div className="group relative h-24 w-24">
                      <img
                        src={image.url}
                        className="h-full w-full rounded-full object-cover shadow"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          removeFile();
                          form.setValue("profilePhoto", []);

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-1 right-1 hidden size-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md group-hover:flex"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}

                  {/* Update Button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full cursor-pointer rounded-lg duration-200 active:scale-95"
                  >
                    {isPending ? (
                      <>
                        <Spinner className="size-5 animate-spin text-white" />
                        <span className="animate-pulse">Updating...</span>
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Info */}
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {/* {user?.name} */}
            ZHH
          </h1>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Account Type:{" "}
              <span className="font-medium text-gray-900">
                {/* {user?.owner ? "Admin" : "Customer"} */}
                Customer
              </span>
            </p>
            <p>
              Cart Items:{" "}
              <span className="font-medium text-gray-900">
                {/* {user?.cartItem?.length || 0} */}0
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
