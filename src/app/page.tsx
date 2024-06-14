import { H1 } from "@/components/ui/H1";
import { Metadata } from "next";
import Image from "next/image";
import me from "@/assets/Ahmed.jpg";

export const metadata: Metadata = {
  title: "Ahmed Oublihi - My Smart Portfolio",
};

export default function Home() {
  return (
    <section className="space-y-16 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat px-1 py-8">
      <section className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
        <div className="space-y-3">
          <H1 className="text-center sm:text-start">Hi, I&apos;m Ahmed 👋</H1>
          <p className="text-center sm:text-start">
            I&apos;m a full-stack developer based in Bremen Germany who builds cool
            projects.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src={me}
            alt="A photo of me"
            height={300}
            width={300}
            className="aspect-square rounded-full border-2 object-cover shadow-md dark:border-foreground"
          />
        </div>
      </section>
      <section className="space-y-3 text-center">
      </section>
    </section>
  );
}
