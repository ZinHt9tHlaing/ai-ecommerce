import { Link } from "react-router";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="mx-auto my-32 flex flex-1 items-center">
        <Card className="w-[350px] max-w-md rounded-2xl py-3 shadow-lg md:w-[500px] lg:w-[500px]">
          <CardHeader className="flex flex-col items-center">
            <TriangleAlert
              className="mb-2 size-12 text-red-500"
              aria-hidden="true"
            />
            <CardTitle className="text-center text-2xl font-bold">
              Page Not Found
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-center text-gray-600">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              asChild
              className="rounded-xl bg-red-500 shadow-md duration-200 hover:bg-red-600 active:scale-90"
            >
              <Link to="/">Go Back Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
