import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ModelView from "./ModelView.jsx";
export default function Model() {
  return <h1>Model</h1>;
  useGSAP(() => {
    gsap.to("#heading", { y: 0, opacity: 1 });
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look
        </h1>

        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75dvh] md:h-[90dvh] overflow-hidden relative">
            <ModelView />
          </div>
        </div>
      </div>
    </section>
  );
}
