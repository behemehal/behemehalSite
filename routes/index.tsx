import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import HeadCustom from "../components/HeadCustom.tsx";
import Navbar from "../components/Navbar.tsx";
import Intro from "../components/Intro.tsx";

export default function Home() {
  return (
    <div class="w-full h-full flex flex-col bg-primaryDark">
      <HeadCustom title="Behemehal" description="Açık kaynak dünyaya, Açık kaynak çözümler" url="https://www.ellie-lang.org" />
      <Navbar />
      <Intro />
    </div>
  );
}