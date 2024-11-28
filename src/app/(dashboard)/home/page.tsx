"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@radix-ui/react-avatar";
import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRequest, postRequest } from "@/utils/apiUtils";
import { API_ENDPOINTS } from "@/constants/apiEndPointsConstant";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/redux/authSlice";

interface OrganizationItem {
  _id: string;
  title: string;
  description: string;
}

interface OrganizationCardProps {
  item: OrganizationItem;
}

const organizationSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must not exceed 200 characters"),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

const OrganizationCard: React.FC<OrganizationCardProps> = ({ item }) => {
  const router = useRouter();

  return (
    <Card
      className="border-2 h-[200px] min-w-[300px] cursor-pointer"
      onClick={() => router.push(`/docs/${item._id}`)}
    >
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>
          {item.description.length > 20
            ? item.description + "...."
            : item.description}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-1 flex-col justify-center ">
        <Button>{item.access}</Button>
      </CardContent>
    </Card>
  );
};

const DialogCard: React.FC<{
  setOrganizationList: React.Dispatch<React.SetStateAction<OrganizationItem[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onSubmit: React.FC;
}> = ({ setOrganizationList, setOpen, open, onSubmit }) => {
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedValue = localStorage.getItem("accessToken");
      setToken(storedValue);
    }
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Card className="border-2 h-[200px]">
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription>Create a new Docs</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <FaPlus className="w-10 h-auto" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Docs</DialogTitle>
          <DialogDescription>
            Fill the details of the new Docs you want to create. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter the title"
              className={`col-span-3 ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && (
              <p className="col-span-4 text-red-500 text-sm text-right">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="description"
              placeholder="Enter the description"
              {...register("description")}
              className={`col-span-3 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="col-span-4 text-red-500 text-sm text-right">
                {errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Page: React.FC = () => {
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const [organizationList, setOrganizationList] = useState<OrganizationItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedValue = localStorage.getItem("accessToken");
      setToken(storedValue);
    }
  }, []);
  const fetchDocsList = async () => {
    dispatch(setIsLoading());
    try {
      const response = await getRequest(
        API_ENDPOINTS.USER.GET_ALL_DOCUMENTS_CREATED,
        {},
        {},
        token
      );

      // Check if response is an AxiosResponse
      if (typeof response !== "string" && response?.data?.user?.documents) {
        setOrganizationList(response.data.user.documents);
      } else {
        console.warn("Unexpected response type or documents not found.");
      }
    } catch (error) {
      // console.error("Error fetching documents:", error);
      if (typeof error !== "string" && error?.response?.data?.message) {
        const errorMessage =
          error?.response?.data?.message || "An unexpected error occurred.";
        alert(errorMessage);
      }
    } finally {
      dispatch(setIsLoading());
    }
  };

  const onSubmit = async (data: OrganizationFormValues) => {
    dispatch(setIsLoading());

    try {
      const response = await postRequest(
        API_ENDPOINTS.DOCUMENT.CREATE,
        {},
        {},
        data,
        token
      );
      if (response && response?.data && response?.data?.message) {
        setOrganizationList((prev) => [...prev, { _id: "1", ...data }]);
        setOpen(false);
        fetchDocsList();
      }
    } catch (error) {
    } finally {
      dispatch(setIsLoading());
    }
  };
  useEffect(() => {
    if (token && token != "") {
      fetchDocsList();
    }
  }, [token]);
  useEffect(() => {
    console.log(organizationList);
  }, [organizationList]);

  return (
    <div className="flex flex-wrap gap-6 w-[100%] justify-center">
      {organizationList.map((item) => (
        <OrganizationCard key={item._id} item={item} />
      ))}
      <DialogCard
        setOrganizationList={setOrganizationList}
        setOpen={setOpen}
        open={open}
        onSubmit={onSubmit}
      />
    </div>
  );
};

// Dynamically import the page component and disable SSR for this page

export default Page;
